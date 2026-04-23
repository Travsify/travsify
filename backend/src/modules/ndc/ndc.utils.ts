import { XMLBuilder, XMLParser } from 'fast-xml-parser';

export class NdcUtils {
  private static builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    attributeNamePrefix: '@_',
  });

  private static parser = new XMLParser({
    ignoreAttributes: false,
    removeNSPrefix: true, // Simplifies JSON access by removing 'a:', 'b:', etc.
  });

  /**
   * Creates a SOAP 1.2 Envelope for XML.AGENCY API using a template for reliability
   */
  static createEnvelope(methodName: string, bodyContent: string): string {
    // Use a template for the Envelope to ensure strict WCF compliance
    return `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope">
  <s:Body>
    <${methodName} xmlns="http://tempuri.org/">
      ${bodyContent}
    </${methodName}>
  </s:Body>
</s:Envelope>`;
  }

  /**
   * Generates standard AuthInfo credentials for XML.AGENCY as a manual XML string
   * to avoid attribute minimization issues with XML builders.
   */
  static getCredentials(auth: { login: string, pass: string, token?: string, deviceId?: string, lang?: string, currency?: string }) {
    return `<credentials xmlns:a="http://schemas.datacontract.org/2004/07/SiteCity.Common" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <a:ApiLogin>${auth.login}</a:ApiLogin>
  <a:ApiPassword>${auth.pass}</a:ApiPassword>
  <a:AuthExtendedData i:nil="true" />
  <a:Currency>${auth.currency || 'USD'}</a:Currency>
  <a:DeviceId>${auth.deviceId || 'test'}</a:DeviceId>
  <a:Language>${auth.lang || 'EN'}</a:Language>
  <a:TokenGuid>${auth.token || '00000000-0000-0000-0000-000000000000'}</a:TokenGuid>
</credentials>`;
  }

  static jsonToXml(obj: any): string {
    return this.builder.build(obj);
  }

  static xmlToJson(xml: string): any {
    return this.parser.parse(xml);
  }
}
