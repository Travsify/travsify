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
    this.searchUrl = this.configService.get<string>('NDC_API_SEARCH_URL') || 'http://search-api.xml.agency/SiteCity';
    this.actionUrl = this.configService.get<string>('NDC_API_ACTION_URL') || 'http://api.city.travel/SiteCity';
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
    const searchParams = {
      aeroSearchParams: {
        '@_xmlns:a': 'http://schemas.datacontract.org/2004/07/SiteCity.Avia.Search',
        '@_xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
        'a:Adults': searchCriteria.adults,
        'a:Childs': 0,
        'a:Infants': 0,
        'a:FlightClass': 'Economy',
        'a:SearchFlights': {
          'a:SearchFlight': {
            'a:Date': this.formatDate(searchCriteria.departureDate),
            'a:IATAFrom': searchCriteria.origin,
            'a:IATATo': searchCriteria.destination,
          }
        },
        'a:ExtendedParams': { '@_i:nil': 'true' },
        'a:PartnerName': { '@_i:nil': 'true' },
      }
    };

    const body = { ...this.getAuth(), ...searchParams };
    const xmlRequest = NdcUtils.createEnvelope('AeroSearch', body);
    
    try {
      const response = await this.sendSoapRequest(this.searchUrl, 'http://tempuri.org/ISiteAvia/AeroSearch', xmlRequest);
      return this.processSearchResponse(response, tenantMarkup);
    } catch (error) {
      this.logger.error(`AeroSearch failed: ${error.message}`);
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
    const body = { ...this.getAuth(), ...prebookParams };
    const xmlRequest = NdcUtils.createEnvelope('AeroPrebook', body);
    return this.sendSoapRequest(this.actionUrl, 'http://tempuri.org/ISiteAvia/AeroPrebook', xmlRequest);
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
    const body = { ...this.getAuth(), ...bookParams };
    const xmlRequest = NdcUtils.createEnvelope('AeroBook', body);
    return this.sendSoapRequest(this.actionUrl, 'http://tempuri.org/ISiteAvia/AeroBook', xmlRequest);
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
    const body = { ...this.getAuth(), ...confirmParams };
    const xmlRequest = NdcUtils.createEnvelope('ConfirmBook', body);
    return this.sendSoapRequest(this.actionUrl, 'http://tempuri.org/ISiteBookInfo/ConfirmBook', xmlRequest);
  }

  // --- END OF BOOKING METHODS ---

  private async sendSoapRequest(url: string, action: string, xml: string): Promise<any> {
    const response = await axios.post(url, xml, {
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8',
        'action': action,
      },
      timeout: 30000,
    });

    const json = NdcUtils.xmlToJson(response.data);
    const body = json.Envelope.Body;
    const result = body[Object.keys(body)[0]];
    const finalResult = result[Object.keys(result)[0]];

    if (finalResult.Success === 'false' || finalResult.Success === false) {
      throw new Error(finalResult.ErrorString || 'Unknown API Error');
    }

    return finalResult;
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
        provider: 'SME.ng',
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
    this.logger.warn(`Search failed for ${criteria.origin} -> ${criteria.destination}. Returning empty results (No Dummy Data).`);
    return [];
  }
}
