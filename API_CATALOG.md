# 🌐 Travsify Integrated API Catalog

This document catalogs all external API providers currently integrated into the Travsify NDC Platform.

## ✈️ Flights & NDC
### XML Agency / City Travel
- **Primary Function**: Core NDC provider for global flight search, pricing, and booking.
- **Protocol**: SOAP/XML
- **Endpoints**:
  - Search: `http://search-api.xml.agency/SiteCity`
  - Action: `http://api.city.travel/SiteCity`
- **Integration**: `backend/src/modules/ndc/ndc.service.ts`

## 🏨 Accommodations
### LiteAPI
- **Primary Function**: Global hotel inventory (2.5M+ properties).
- **Protocol**: REST/JSON
- **Website**: [liteapi.com](https://liteapi.com)
- **Integration**: `backend/src/modules/demo/services/liteapi.service.ts`

## 🛂 Travel Documents
### Atlys
- **Primary Function**: eVisa processing and visa requirements check.
- **Protocol**: REST/JSON
- **Website**: [atlys.com](https://atlys.com)
- **Integration**: `backend/src/modules/demo/services/atlys.service.ts`

## 🛡️ Insurance
### SafetyWing
- **Primary Function**: Travel insurance quotes and issuance.
- **Protocol**: REST/JSON
- **Website**: [safetywing.com](https://safetywing.com)
- **Integration**: `backend/src/modules/demo/services/safetywing.service.ts`

## 🚗 Logistics & Transfers
### Mozio
- **Primary Function**: Airport transfers and ground logistics.
- **Protocol**: REST/JSON
- **Website**: [mozio.com/partners](https://www.mozio.com/business-partners/)
- **Integration**: `backend/src/modules/demo/services/mozio.service.ts`

## 🎭 Experiences
### GetYourGuide
- **Primary Function**: Tours, activities, and local experiences.
- **Protocol**: REST/JSON
- **Website**: [getyourguide.com](https://getyourguide.com)
- **Integration**: `backend/src/modules/demo/services/getyourguide.service.ts`

## 💳 Payments & FinTech
### Fincra
- **Primary Function**: NGN settlement, virtual accounts, and local funding.
- **Website**: [fincra.com](https://fincra.com)

### Stripe
- **Primary Function**: USD settlement and global card processing.
- **Website**: [stripe.com](https://stripe.com)
