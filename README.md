# NDC B2B Travel API Platform

A high-performance Travel-as-a-Service platform that abstracts complex XML-based NDC APIs into a simple REST/JSON API.

## 🚀 Features
- **Unified REST API**: Flight search, pricing, and booking.
- **Fintech Dashboard**: Premium UI for businesses to manage wallets (NGN/USD), KYC, and API keys.
- **Wallet System**: Multi-currency support with automated ledger and funding via Finca (NGN) and Stripe (USD).
- **NDC XML Integration**: Built-in logic to handle SOAP envelopes and XML/JSON mapping.
- **Automated Ticketing**: Fail-safe booking engine with automatic ticket issuance and refunds.

## 🛠️ Tech Stack
- **Backend**: NestJS, TypeORM, PostgreSQL, Redis, `fast-xml-parser`.
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, TypeScript.

## ⚙️ Getting Started

### Backend
1. Navigate to `/backend`.
2. Configure `.env` (provided with placeholders).
3. Install dependencies: `npm install`.
4. Run in dev: `npm run start:dev`.

### Frontend
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Run in dev: `npm run dev`.

## 📂 Project Structure
- `backend/src/modules`: Core business logic (Auth, Wallet, NDC, Bookings).
- `backend/src/common/guards`: Security layers (API Key, JWT).
- `frontend/src/app`: Modern UI components and dashboard pages.
- `frontend/src/context`: Auth state management.

## 🔐 Security
- API Key + Secret Key authentication for external integrations.
- JWT-based authentication for dashboard access.
- Role-based access control (User, Admin).
