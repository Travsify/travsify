import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CurrencyService } from '../../common/services/currency.service';
import { ConfigService } from '@nestjs/config';
import { DuffelService } from './duffel.service';
import axios from 'axios';
import { NdcUtils } from './ndc.utils';
import { UnifiedFlight, TravelVertical } from '../../common/interfaces/unified-travel.interface';
import { PricingEngine } from '../../common/utils/pricing.util';

@Injectable()
export class NdcService {
  private readonly logger = new Logger(NdcService.name);
  private readonly searchUrl: string;
  private readonly actionUrl: string;
  private readonly apiLogin: string;
  private readonly apiPass: string;
  private readonly apiToken: string;
  private readonly deviceId: string;

  constructor(
    private configService: ConfigService,
    private duffelService: DuffelService,
    private currencyService: CurrencyService
  ) {
    this.searchUrl = this.configService.get<string>('NDC_API_SEARCH_URL') || 'https://search-api.xml.agency/SiteCity';
    this.actionUrl = this.configService.get<string>('NDC_API_ACTION_URL') || 'https://api.city.travel/SiteCity';
    this.apiLogin = this.configService.get<string>('NDC_API_LOGIN') || 'test';
    this.apiPass = this.configService.get<string>('NDC_API_PASS') || 'test';
    this.apiToken = this.configService.get<string>('NDC_API_TOKEN') || '00000000-0000-0000-0000-000000000000';
    this.deviceId = this.configService.get<string>('NDC_API_DEVICE_ID') || 'test';
  }

  private getAuth() {
    return NdcUtils.getCredentials({
      login: this.apiLogin,
      pass: this.apiPass,
      token: this.apiToken,
      deviceId: this.deviceId,
      lang: 'EN',
      currency: 'USD',
    });
  }

  async airShopping(
    searchCriteria: { origin: string, destination: string, departureDate: string, adults: number, currency?: string, cabinClass?: string },
    tenant: { flightMarkup: number, flightProvider?: string, ndcEnabled?: boolean }
  ): Promise<UnifiedFlight[]> {
    const targetCurrency = searchCriteria.currency || 'NGN';
    this.logger.log(`Executing Flight Search (Target: ${targetCurrency}) for tenant: ${searchCriteria.origin} -> ${searchCriteria.destination}`);

    const results: UnifiedFlight[] = [];
    const provider = tenant.flightProvider || 'duffel';
    const isNdcExplicitlyEnabled = tenant.ndcEnabled === true;

    // 1. Fetch Duffel if selected
    if (provider === 'duffel' || provider === 'both') {
      const duffelResults = await this.duffelService.searchFlights(searchCriteria, tenant.flightMarkup, targetCurrency, searchCriteria.cabinClass).catch(err => {
        this.logger.error(`Duffel search failed: ${err.message}`);
        return [];
      });
      results.push(...duffelResults);
    }

    // 2. Fetch SiteCity/NDC if selected AND enabled
    if ((provider === 'sitecity' || provider === 'both') && isNdcExplicitlyEnabled) {
      const siteCityResults = await this.getSoapSearch(searchCriteria, tenant.flightMarkup, targetCurrency).catch(err => {
        this.logger.warn(`SiteCity sub-search failed: ${err.message}`);
        throw new Error(`Live Flight API Search Failed: ${err.message}`);
      });
      results.push(...siteCityResults);
    }

    return results;
  }

  private async getSoapSearch(
    searchCriteria: { origin: string, destination: string, departureDate: string, adults: number },
    tenantMarkup: number = 0,
    targetCurrency: string = 'NGN'
  ): Promise<UnifiedFlight[]> {
    const action = 'http://tempuri.org/ISiteAvia/AeroSearch';
    const formattedDate = this.formatDate(searchCriteria.departureDate);
    
    const xmlBody = `${NdcUtils.getCredentials({
      login: this.apiLogin,
      pass: this.apiPass,
      token: this.apiToken,
      deviceId: this.deviceId,
      lang: 'EN',
      currency: 'USD',
    })}
<aeroSearchParams xmlns:a="http://schemas.datacontract.org/2004/07/SiteCity.Avia.Search" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <a:Adults>${searchCriteria.adults}</a:Adults>
  <a:Childs>0</a:Childs>
  <a:Infants>0</a:Infants>
  <a:FlightClass>Economy</a:FlightClass>
  <a:SearchFlights>
    <a:SearchFlight>
      <a:Date>${formattedDate}</a:Date>
      <a:IATAFrom>${searchCriteria.origin}</a:IATAFrom>
      <a:IATATo>${searchCriteria.destination}</a:IATATo>
    </a:SearchFlight>
  </a:SearchFlights>
  <a:ExtendedParams i:nil="true" />
  <a:PartnerName i:nil="true" />
</aeroSearchParams>`;

    const xmlRequest = NdcUtils.createEnvelope('AeroSearch', xmlBody);
    const response = await this.sendSoapRequest(this.searchUrl, action, xmlRequest);
    return this.processSearchResponse(response, tenantMarkup, targetCurrency);
  }

  // --- RESTORING BOOKING METHODS ---

  async offerPrice(offerCode: string, searchGuid: string): Promise<any> {
    const prebookParams = {
      'aeroPrebookParams': {
        '@_xmlns:a': 'http://schemas.datacontract.org/2004/07/SiteCity.Avia.Prebook',
        'a:OfferCode': offerCode,
        'a:SearchGuid': searchGuid,
      }
    };
    const xmlBody = `${this.getAuth()}${NdcUtils.jsonToXml(prebookParams)}`;
    const action = 'http://tempuri.org/ISiteAvia/AeroPrebook';
    const xmlRequest = NdcUtils.createEnvelope('AeroPrebook', xmlBody);
    return this.sendSoapRequest(this.actionUrl, action, xmlRequest);
  }

  async orderCreate(bookingData: { offerCode: string, searchGuid: string, passengers: any[], contact: any }): Promise<any> {
    const bookParams = {
      'aeroBookParams': {
        '@_xmlns:a': 'http://schemas.datacontract.org/2004/07/SiteCity.Avia.Book',
        '@_xmlns:b': 'http://schemas.datacontract.org/2004/07/SiteCity.Common',
        'a:OfferCode': bookingData.offerCode,
        'a:SearchGuid': bookingData.searchGuid,
        'a:Email': bookingData.contact?.email || 'test@test.com',
        'a:Phone': bookingData.contact?.phone || '12345678',
        'a:PaxList': {
          'b:PaxData': bookingData.passengers.map(pax => ({
            'b:AgeType': pax.ageType || 'Adult',
            'b:BirthDay': pax.birthDay,
            'b:BirthISO': pax.nationality || 'RUS',
            'b:Document': pax.documentNumber,
            'b:GenderType': pax.gender || 'Male',
            'b:Name': pax.firstName,
            'b:Surname': pax.lastName,
          }))
        },
      }
    };
    const xmlBody = `${this.getAuth()}${NdcUtils.jsonToXml(bookParams)}`;
    const action = 'http://tempuri.org/ISiteAvia/AeroBook';
    const xmlRequest = NdcUtils.createEnvelope('AeroBook', xmlBody);
    return this.sendSoapRequest(this.actionUrl, action, xmlRequest);
  }

  async orderChange(confirmData: { bookId: number, bookGuid: string, price: number }): Promise<any> {
    const confirmParams = {
      'confirmBookParams': {
        '@_xmlns:a': 'http://schemas.datacontract.org/2004/07/SiteCity.BookInfo.ConfirmBook',
        'a:BookGuid': confirmData.bookGuid,
        'a:BookId': confirmData.bookId,
        'a:Price': confirmData.price,
      }
    };
    const xmlBody = `${this.getAuth()}${NdcUtils.jsonToXml(confirmParams)}`;
    const action = 'http://tempuri.org/ISiteBookInfo/ConfirmBook';
    const xmlRequest = NdcUtils.createEnvelope('ConfirmBook', xmlBody);
    return this.sendSoapRequest(this.actionUrl, action, xmlRequest);
  }

  // --- END OF BOOKING METHODS ---

  private async sendSoapRequest(url: string, action: string, xml: string): Promise<any> {
    try {
      this.logger.debug(`Sending SOAP request to ${url}...`);
      const response = await axios.post(url, xml, {
        headers: {
          'Content-Type': `application/soap+xml; charset=utf-8; action="${action}"`,
          'Accept': 'application/soap+xml',
        },
        timeout: 45000,
      });

      this.logger.debug(`SOAP response received. Status: ${response.status}`);
      const json = NdcUtils.xmlToJson(response.data);
      const body = json.Envelope.Body;
      this.logger.debug(`SOAP Body keys: ${Object.keys(body).join(', ')}`);

      if (body.Fault) {
        const fault = body.Fault;
        const reasonObj = fault.Reason?.Text || fault.Reason || 'Unknown Reason';
        const reason = typeof reasonObj === 'string' ? reasonObj : JSON.stringify(reasonObj);
        const codeObj = fault.Code?.Value || fault.Code || 'Unknown Code';
        const code = typeof codeObj === 'string' ? codeObj : JSON.stringify(codeObj);
        
        this.logger.error(`SOAP Fault Received: [${code}] ${reason}`);
        if (fault.Detail) {
           this.logger.error(`Fault Detail: ${JSON.stringify(fault.Detail)}`);
        }
        throw new Error(`SOAP Fault: ${reason}`);
      }
      
      const result = body[Object.keys(body)[0]];
      const finalResult = result[Object.keys(result)[0]];

      if (finalResult && (finalResult.Success === 'false' || finalResult.Success === false)) {
        throw new Error(finalResult.ErrorString || 'Unknown API Error');
      }

      return finalResult;
    } catch (error) {
      this.logger.error(`sendSoapRequest error: ${error.message}`);
      if (error.response) {
        this.logger.error(`Status: ${error.response.status}`);
        this.logger.error(`Response data: ${typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }

  private formatDate(date: string): string {
    const [y, m, d] = date.split('-');
    return `${d}.${m}.${y}`;
  }

  private processSearchResponse(data: any, tenantMarkup: number, targetCurrency: string): UnifiedFlight[] {
    if (!data || !data.FlightData) return [];

    const flightDataList = Array.isArray(data.FlightData.FlightData) 
      ? data.FlightData.FlightData 
      : [data.FlightData.FlightData];

    return flightDataList.filter((fd: any) => fd).map((fd: any) => {
      const basePrice = parseFloat(fd.TotalPrice);
      const travsifyFee = basePrice * 0.03;

      // Extract cabin class from the offer data
      const cabin = fd.FlightClass || fd.CabinClass || 'Economy';
      const formattedCabin = cabin.charAt(0).toUpperCase() + cabin.slice(1).toLowerCase();

      // Extract baggage from offer
      const baggageAllowance = fd.BaggageInfo || fd.Baggage || '1x Checked (23kg)';

      // Compute total duration from segments
      const segments = this.mapSegments(fd.Offers?.OfferInfo?.Segments?.OfferSegment || []);
      let totalDuration = '';
      if (segments.length > 0 && segments[0].departureTime && segments[segments.length - 1].arrivalTime) {
        const dep = new Date(segments[0].departureTime).getTime();
        const arr = new Date(segments[segments.length - 1].arrivalTime).getTime();
        const diff = arr - dep;
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          totalDuration = `${hours}h ${minutes}m`;
        }
      }

      // Extract fare rules / refundability
      const isRefundable = fd.IsRefundable === true || fd.IsRefundable === 'true';
      const fareRules: string[] = [];
      if (fd.FareRules) {
        fareRules.push(fd.FareRules);
      }
      if (isRefundable) {
        fareRules.push('Refundable fare');
      } else {
        fareRules.push('Non-refundable');
      }
      if (fd.PenaltyInfo) {
        fareRules.push(`Penalty: ${fd.PenaltyInfo}`);
      }

      return {
        id: fd.OfferCode,
        vertical: TravelVertical.FLIGHT,
        provider: 'xml.agency',
        source: data.SearchGuid,
        isRefundable,
        fareRules,
        cabin: formattedCabin,
        baggageAllowance,
        totalDuration,
        price: PricingEngine.calculate(basePrice, travsifyFee, tenantMarkup, 'USD', targetCurrency, this.currencyService),
        segments,
      };
    });
  }

  private mapSegments(segments: any) {
    const segList = Array.isArray(segments) ? segments : [segments];
    return segList.map(s => ({
      flightNumber: s.FlightNum,
      airline: s.MarketingAirline,
      airlineCode: s.MarketingAirlineCode || s.MarketingAirline?.substring(0, 2) || null,
      operatingAirline: s.OperatingAirline || s.MarketingAirline,
      operatingAirlineCode: s.OperatingAirlineCode || null,
      departure: s.Departure.Iata,
      arrival: s.Arrival.Iata,
      departureTime: s.Departure.Date,
      arrivalTime: s.Arrival.Date,
      departureTerminal: s.Departure.Terminal || null,
      arrivalTerminal: s.Arrival.Terminal || null,
      aircraft: s.AircraftType || s.Aircraft || null,
      duration: s.Duration || null,
    }));
  }

  }
}
