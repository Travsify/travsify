import { XMLBuilder, XMLParser } from 'fast-xml-parser';

export class NdcUtils {
  private static builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    suppressEmptyNode: true,
  });

  private static parser = new XMLParser({
    ignoreAttributes: false,
    removeNSPrefix: true, // Simplifies JSON access by removing 'a:', 'b:', etc.
  });

  /**
   * Creates a SOAP 1.2 Envelope for XML.AGENCY API
   */
  static createEnvelope(methodName: string, bodyContent: any, action?: string, endpoint?: string): string {
    const envelope: any = {
      's:Envelope': {
        '@_xmlns:s': 'http://www.w3.org/2003/05/soap-envelope',
        '@_xmlns:a': 'http://www.w3.org/2005/08/addressing',
        's:Header': {
          'a:Action': {
            '@_s:mustUnderstand': '1',
            '#text': action || '',
          },
          'a:To': {
            '@_s:mustUnderstand': '1',
            '#text': endpoint || '',
          },
        },
        's:Body': {
          [methodName]: {
            '@_xmlns': 'http://tempuri.org/',
            ...bodyContent
          }
        }
      }
    };
    return this.builder.build(envelope);
  }

  /**
   * Generates standard AuthInfo credentials for XML.AGENCY
   */
  static getCredentials(auth: { login: string, pass: string, token?: string, deviceId?: string, lang?: string, currency?: string }) {
    return {
      credentials: {
        '@_xmlns:a': 'http://schemas.datacontract.org/2004/07/SiteCity.Common',
        '@_xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
        'a:ApiLogin': auth.login,
        'a:ApiPassword': auth.pass,
        'a:AuthExtendedData': { '@_i:nil': 'true' },
        'a:Currency': auth.currency || 'USD',
        'a:DeviceId': auth.deviceId || 'test',
        'a:Language': auth.lang || 'EN',
        'a:TokenGuid': auth.token || '00000000-0000-0000-0000-000000000000',
      }
    };
  }

  static jsonToXml(obj: any): string {
    return this.builder.build(obj);
  }

  static xmlToJson(xml: string): any {
    return this.parser.parse(xml);
  }
}
