import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

  constructor(private configService: ConfigService) {
    this.searchUrl = this.configService.get<string>('NDC_API_SEARCH_URL') || 'https://search-api.xml.agency/SiteCity';
    this.actionUrl = this.configService.get<string>('NDC_API_ACTION_URL') || 'https://api.city.travel/SiteCity';
    this.apiLogin = this.configService.get<string>('NDC_API_LOGIN') || 'test';
    this.apiPass = this.configService.get<string>('NDC_API_PASS') || 'test';
    this.apiToken = this.configService.get<string>('NDC_API_TOKEN') || '00000000-0000-0000-0000-000000000000';
    this.deviceId = this.configService.get<string>('NDC_API_DEVICE_ID') || 'test';

    this.logger.log(`NDC Config: login=${this.apiLogin}, device=${this.deviceId}, token=${this.apiToken.substring(0, 8)}..., searchUrl=${this.searchUrl}`);
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
    searchCriteria: { origin: string, destination: string, departureDate: string, adults: number },
    tenantMarkup: number = 0
  ): Promise<UnifiedFlight[]> {
    const action = 'http://tempuri.org/ISiteAvia/AeroSearch';
    const formattedDate = this.formatDate(searchCriteria.departureDate);
    
    const xmlBody = `${this.getAuth()}
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
    
    try {
      this.logger.log(`AeroSearch request: ${this.searchUrl} | ${searchCriteria.origin}->${searchCriteria.destination} | date=${searchCriteria.departureDate}`);
      this.logger.debug(`SOAP XML:\n${xmlRequest}`);
      const response = await this.sendSoapRequest(this.searchUrl, action, xmlRequest);
      return this.processSearchResponse(response, tenantMarkup);
    } catch (error) {
      this.logger.error(`AeroSearch failed: ${error.message}`);
      if (error.response) {
        this.logger.error(`Status: ${error.response.status}`);
        this.logger.error(`Response body: ${typeof error.response.data === 'string' ? error.response.data.substring(0, 1000) : JSON.stringify(error.response.data).substring(0, 1000)}`);
      }
      this.logger.error(`Request URL: ${this.searchUrl}, Login: ${this.apiLogin}, Token: ${this.apiToken.substring(0, 8)}...`);
      return this.getFallbackFlights(searchCriteria, tenantMarkup);
    }
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

  private processSearchResponse(data: any, tenantMarkup: number): UnifiedFlight[] {
    if (!data || !data.FlightData) return [];

    const flightDataList = Array.isArray(data.FlightData.FlightData) 
      ? data.FlightData.FlightData 
      : [data.FlightData.FlightData];

    return flightDataList.filter((fd: any) => fd).map((fd: any) => {
      const basePrice = parseFloat(fd.TotalPrice);
      const travsifyFee = basePrice * 0.03;

      return {
        id: fd.OfferCode,
        vertical: TravelVertical.FLIGHT,
        provider: 'xml.agency',
        source: data.SearchGuid,
        segments: this.mapSegments(fd.Offers?.OfferInfo?.Segments?.OfferSegment || []),
        price: PricingEngine.calculate(basePrice, travsifyFee, tenantMarkup, 'USD'),
      };
    });
  }

  private mapSegments(segments: any) {
    const segList = Array.isArray(segments) ? segments : [segments];
    return segList.map(s => ({
      flightNumber: s.FlightNum,
      airline: s.MarketingAirline,
      departure: s.Departure.Iata,
      arrival: s.Arrival.Iata,
      departureTime: s.Departure.Date,
      arrivalTime: s.Arrival.Date,
    }));
  }

  private getFallbackFlights(criteria: any, tenantMarkup: number): UnifiedFlight[] {
    this.logger.log(`Simulation Mode: Generating high-fidelity flight results for ${criteria.origin} -> ${criteria.destination}`);
    
    const airlines = [
      { name: 'Qatar Airways', code: 'QR', basePrice: 850 },
      { name: 'Emirates', code: 'EK', basePrice: 920 },
      { name: 'Lufthansa', code: 'LH', basePrice: 780 },
      { name: 'British Airways', code: 'BA', basePrice: 810 },
      { name: 'Air Peace', code: 'P4', basePrice: 650 },
      { name: 'Turkish Airlines', code: 'TK', basePrice: 740 },
    ];

    return airlines.map((airline, index) => {
      const departureDate = new Date(criteria.departureDate || new Date());
      departureDate.setHours(8 + index * 2, 0, 0);
      
      const arrivalDate = new Date(departureDate);
      arrivalDate.setHours(arrivalDate.getHours() + 6 + Math.floor(Math.random() * 4));

      const basePrice = airline.basePrice + (Math.random() * 200);
      const travsifyFee = basePrice * 0.03;

      return {
        id: `sim-${airline.code}-${index}-${Date.now()}`,
        vertical: TravelVertical.FLIGHT,
        provider: 'xml.agency (Simulated)',
        source: `SIM-${Math.random().toString(36).substring(7).toUpperCase()}`,
        price: PricingEngine.calculate(basePrice, travsifyFee, tenantMarkup, 'USD'),
        segments: [
          {
            flightNumber: `${airline.code}${100 + index * 15}`,
            airline: airline.name,
            departure: criteria.origin,
            arrival: criteria.destination,
            departureTime: departureDate.toISOString(),
            arrivalTime: arrivalDate.toISOString(),
          }
        ],
      };
    });
  }
}
