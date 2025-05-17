# 🎟️ Ticket Marketplace Platform

A full-featured ticketing marketplace where users can create, promote, and sell tickets to events. Built with **Laravel 12**, **Inertia.js**, and **React**, with **Stripe Connect** powering multi-vendor payments.

## ⚙️ Tech Stack

- **Backend:** Laravel 12
- **Frontend:** React + Inertia.js
- **Database:** MySQL
- **Queueing & Caching (optional):** Redis
- **Payments:** Stripe Connect (Express Accounts)
- **Authentication:** Laravel Sanctum
- **PDF Generation:** Browsershot (headless Chrome)
- **QR Code Generation:** Simple QrCode

---

## 🚀 Features

### 🧾 Event & Ticket Management
- Create & manage events (multi-organizer support)
- Sell tickets with customizable pricing
- Dynamic ticket form UI based on organizer/company
- Track ticket sales and availability

### 🧍 Buyer Experience
- Purchase tickets via Stripe Checkout
- View and download ticket PDFs with embedded QR codes
- Real-time queue / waitlist system for sold-out events
- Receive email confirmations and updates

### ✅ Check-In & Validation
- Scan QR codes to validate tickets at the event
- Secure check-in route with `auth:sanctum` and ability middleware
- Rate-limited endpoints to prevent abuse (`throttle:3,1`)

### 💳 Stripe Connect Integration
- Support for **Express accounts**
- Organizers receive direct payouts via Stripe
- Admin onboarding and dashboard integration

### 🧠 Admin & Middleware
- Role-based access using custom `CheckAbilities` middleware
- Laravel rate-limiting and token scope enforcement
- Clean controller separation (`TicketScanController`, `EventController`, etc.)

---

## 🛠 Installation

```bash
git clone https://github.com/your-username/ticket-marketplace.git
cd ticket-marketplace

composer install
npm install && npm run dev

cp .env.example .env
php artisan key:generate

# Configure DB, Redis, Stripe in .env
php artisan migrate --seed
