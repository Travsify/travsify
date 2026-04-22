import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { NdcUtils } from './ndc.utils';

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

  /**
   * AeroSearch - Search for flights (Uses Search URL)
   */
  async airShopping(searchCriteria: { origin: string, destination: string, departureDate: string, adults: number, childs?: number, infants?: number }): Promise<any> {
    const searchParams = {
      aeroSearchParams: {
        '@_xmlns:a': 'http://schemas.datacontract.org/2004/07/SiteCity.Avia.Search',
        '@_xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
        'a:Adults': searchCriteria.adults,
        'a:Childs': searchCriteria.childs || 0,
        'a:Infants': searchCriteria.infants || 0,
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
      return this.processSearchResponse(response);
    } catch (error) {
      this.logger.error(`AeroSearch failed: ${error.message}`);
      throw new InternalServerErrorException('Flight search failed: ' + error.message);
    }
  }

  /**
   * AeroPrebook - Reconfirm price and rules (Uses Action URL)
   */
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

    try {
      const response = await this.sendSoapRequest(this.actionUrl, 'http://tempuri.org/ISiteAvia/AeroPrebook', xmlRequest);
      return response;
    } catch (error) {
      throw new InternalServerErrorException('Pre-booking reconfirmation failed: ' + error.message);
    }
  }

  /**
   * AeroBook - Create a reservation (Uses Action URL)
   */
  async orderCreate(bookingData: { offerCode: string, searchGuid: string, passengers: any[], contact: any }): Promise<any> {
    const bookParams = {
      'aeroBookParams': {
        '@_xmlns:a': 'http://schemas.datacontract.org/2004/07/SiteCity.Avia.Book',
        '@_xmlns:b': 'http://schemas.datacontract.org/2004/07/SiteCity.Common',
        'a:OfferCode': bookingData.offerCode,
        'a:SearchGuid': bookingData.searchGuid,
        'a:Email': bookingData.contact.email,
        'a:Phone': bookingData.contact.phone,
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
        'a:SelectedTariffs': { '@_i:nil': 'true', '@_xmlns:c': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays' },
      }
    };

    const body = { ...this.getAuth(), ...bookParams };
    const xmlRequest = NdcUtils.createEnvelope('AeroBook', body);

    try {
      const response = await this.sendSoapRequest(this.actionUrl, 'http://tempuri.org/ISiteAvia/AeroBook', xmlRequest);
      return response;
    } catch (error) {
      throw new InternalServerErrorException('Booking reservation failed: ' + error.message);
    }
  }

  /**
   * ConfirmBook - Final ticketing (Uses Action URL)
   */
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

    try {
      const response = await this.sendSoapRequest(this.actionUrl, 'http://tempuri.org/ISiteBookInfo/ConfirmBook', xmlRequest);
      return response;
    } catch (error) {
      throw new InternalServerErrorException('Ticketing confirmation failed: ' + error.message);
    }
  }

  private async sendSoapRequest(url: string, action: string, xml: string): Promise<any> {
    const response = await axios.post(url, xml, {
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8',
        'action': action,
      },
      timeout: 30000, // 30 second timeout
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

  private processSearchResponse(data: any) {
    if (!data || !data.FlightData) {
      return { searchGuid: data?.SearchGuid || '', offers: [] };
    }

    const flightDataList = Array.isArray(data.FlightData.FlightData) 
      ? data.FlightData.FlightData 
      : fdOrFallback(data.FlightData.FlightData);

    function fdOrFallback(fd: any) {
      return fd ? [fd] : [];
    }

    return {
      searchGuid: data.SearchGuid,
      offers: flightDataList.map((fd: any) => ({
        offerCode: fd.OfferCode,
        totalPrice: parseFloat(fd.TotalPrice),
        currency: data.Currency || 'USD',
        flights: this.mapSegments(fd.Offers?.OfferInfo?.Segments?.OfferSegment || [])
      }))
    };
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
      aircraft: s.AirCraft,
      baggage: s.Baggage,
    }));
  }
}
