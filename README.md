# AAPDASETU — Advanced Flood Alert, Prediction, Rescue and Disaster Management Platform

> **Tagline:** “Warn Early. Navigate Safely. Survive Smarter.”

AAPDASETU is an integrated, full-stack disaster management and humanitarian logistics platform built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **Prisma + SQLite**, **Leaflet / OpenStreetMap**, **Recharts**, **Dexie IndexedDB (PWA Offline)**, and an **Always-Available AI Safety Assistant** with deterministic local fallback.

It bridges the critical disconnect during catastrophic flood emergencies between **affected citizens** and **emergency response commanders (NDRF / SDRF / DDMA)**.

---

## 📑 Table of Contents

1. [Architectural Overview](#architectural-overview)
2. [Complete Route Sitemap](#complete-route-sitemap)
3. [Core Algorithms & Formulae](#core-algorithms--formulae)
4. [Technology Stack](#technology-stack)
5. [Quick Start & Setup Instructions](#quick-start--setup-instructions)
6. [Demo Accounts & Credentials](#demo-accounts--credentials)
7. [Automated Testing](#automated-testing)
8. [Feature Matrix: Live Implemented vs External Integration](#feature-matrix)
9. [Offline PWA & Resilience Architecture](#offline-pwa--resilience-architecture)
10. [Safety & Statutory Disclaimer](#safety--statutory-disclaimer)

---

## 🏛️ 1. Architectural Overview

AAPDASETU unites two synchronized applications within a single codebase backed by a shared SQLite database:

```
                                 AAPDASETU Unified Platform
                                             │
               ┌─────────────────────────────┴─────────────────────────────┐
               ▼                                                           ▼
     Citizen Emergency App                                     Incident Command Center (ICS)
 (Mobile-First, PWA Offline Hub)                               (Admin & Field Responder Desk)
  • / (Landing & Orientation)                                   • /admin (Operational Command)
  • /dashboard (Personalized Risk Score)                        • /admin/map (Live Beacon Telemetry)
  • /map (GIS Spatial Awareness)                                • /admin/rescue (SOS Dispatch Triage)
  • /warnings (Explainable Advisories)                          • /admin/shelters (Capacity Management)
  • /shelters (4-Factor Safety Ranking)                         • /admin/relief (Shortage Prediction)
  • /resources (Supplies & Field Hospitals)                     • /admin/alerts (Public Broadcasting)
  • /route (Hazard-Avoiding Navigation)                         • /admin/analytics (Recharts Trends)
  • /sos (Instant Incident Reporting)
  • /family (Welfare Status Circle)
  • /offline (PWA Shell & Local Queues)
  • /checklist (Offline Survival Go-Bag)
               │                                                           │
               └─────────────────────────────┬─────────────────────────────┘
                                             ▼
                             Prisma + SQLite Relational Database
                             (Seamlessly swappable to PostgreSQL)
```

---

## 🗺️ 2. Complete Route Sitemap

### A. Citizen Routes
| Route | Purpose | Key Features |
|---|---|---|
| `/` | **Landing Page** | 10-second elevator pitch, 6 feature cards, 5-stage survival journey, demo map preview, helplines. |
| `/dashboard` | **Flood Risk Dashboard** | 0–100 normalized risk score, river gauge telemetry, boundary proximity, recommended shelter, quick action hub. |
| `/map` | **Interactive Flood Map** | Zoomable Leaflet map, OpenStreetMap tiles, layer filters for risk zones, shelters, hospitals, relief hubs, sensors. |
| `/warnings` | **Early Warning Center** | Explainable bulletins, hydrological rationale breakdown, recommended public evacuation actions. |
| `/shelters` | **Smart Shelter Finder** | 8+ seeded shelters ranked by distance, occupancy %, flood safety %, and amenities. Detail modal & directions. |
| `/resources` | **Relief Resource Finder** | Food, potable water, medical kits, power stations, bedding, and trauma hospitals with live bed counts. |
| `/route` | **Safe Route Planner** | Evaluates 3 candidate routes (A, B, C) avoiding verified blocked/flooded segments. |
| `/sos` | **Emergency SOS** | High-speed mobile report, vulnerability weighting, unique case ID (e.g. `SOS-2045`), and offline queueing. |
| `/family` | **Family Safety Circle** | "I'M SAFE" and "NEED HELP" one-touch status buttons, member notes, and consent-based check-in. |
| `/offline` | **Offline Emergency Mode** | PWA shell, IndexedDB cached shelters, 112/1077/108 tap-to-call, pending draft synchronization. |
| `/checklist` | **Preparedness Checklist** | 9-point essential survival go-bag with local storage persistence and print/export support. |

### B. Admin & Responder Routes
| Route | Purpose | Key Features |
|---|---|---|
| `/admin` | **Command Center** | Top 6 metrics, urgent incident triage queue, shelter vacancy bars, critical shortage alerts. |
| `/admin/map` | **Live Ops Map** | Responder GIS view displaying active SOS beacons, river stations, and sector inspector. |
| `/admin/rescue` | **Rescue Case Triage** | 4-step workflow: `Reported` &rarr; `Assigned` &rarr; `En Route` &rarr; `Resolved`. Assign to self, audit trail. |
| `/admin/shelters` | **Shelter Capacity Ops** | Edit total/occupied capacity with strict `occupied <= total` validation. Real-time sync to citizen app. |
| `/admin/relief` | **Relief Shortage Prediction** | Burn-rate formula: `Days = Stock ÷ Burn Rate`. Proactive replenishment recommendations. |
| `/admin/alerts` | **Public Alert Manager** | Create, preview, and broadcast emergency alerts with prominent `DEMO ALERT` labels. |
| `/admin/analytics` | **Analytics Dashboard** | Recharts visualizations: Severity pie chart, SOS bar chart, shelter capacity comparison, water trend lines. |

### C. Authentication & Profile Routes
- `/login` — Demo role switcher with one-click pre-filled authentication.
- `/register` — Citizen registration form.
- `/profile` — Session inspector, role display, and logout.

---

## 🧮 3. Core Algorithms & Formulae

### 1. Flood Risk Assessment Formula
The risk score (0 to 100) is calculated from 5 normalized indicators:
$$\text{Risk Score} = W_{\text{rain}} \cdot N_{\text{rain}} + W_{\text{water}} \cdot N_{\text{water}} + W_{\text{prox}} \cdot N_{\text{prox}} + W_{\text{hist}} \cdot N_{\text{hist}} + W_{\text{road}} \cdot N_{\text{road}}$$
- **Rainfall Severity (25%)**: Normalized up to 120 mm threshold.
- **River Water Level (30%)**: Scaled against sensor danger threshold ($H / H_{\text{danger}}$).
- **Flood Boundary Proximity (25%)**: Scaled inversely from 0 km (max danger) to 10 km (safe).
- **Historical Exposure (10%)**: Historical inundation index.
- **Nearby Road Blockages (10%)**: Scaled by verified local hazard obstructions.
- **Bands**:
  - `0–29`: **LOW RISK**
  - `30–59`: **MODERATE RISK**
  - `60–84`: **HIGH RISK**
  - `85–100`: **EXTREME RISK**

### 2. Smart Shelter Safety Ranking Formula
$$\text{Shelter Score} = \text{Distance}(30\%) + \text{Vacancy}(20\%) + \text{Flood Safety}(20\%) + \text{Amenities}(30\%)$$
- Evaluates Haversine distance from citizen GPS coordinates.
- Penalizes overcrowding ($100 - \text{Occupancy}\%$).
- Awards points for verified potable water, food rations, on-site medical post, electricity, toilets, and wheelchair accessibility.

### 3. Relief Resource Shortage Prediction Formula
$$\text{Days Remaining} = \frac{\text{Available Stock}}{\text{Daily Consumption Rate}}$$
- Division-by-zero protection handles unrecorded drain rates gracefully.
- Suggests replenishment quantity for target 7-day coverage $+ 20\%$ safety buffer:
$$\text{Replenishment} = \max\left(0, \left(7 \times \text{Rate} \times 1.20\right) - \text{Stock}\right)$$

### 4. SOS Priority Urgency Scoring Formula
- Urgency Base: Trapped Floodwater (40 pts), Medical Emergency (38 pts), Evacuation (25 pts), Food/Water (22 pts).
- Vulnerability Multiplier: $+25\text{ pts}$ if infants, pregnant mother, elderly, or injured persons are present.
- Cluster Multiplier: Up to $+20\text{ pts}$ scaled by stranded group size.
- Threat Zone Multiplier: Up to $+15\text{ pts}$ if situated inside an Extreme Inundation Zone.

---

## 🛠️ 4. Technology Stack

- **Framework**: Next.js 14 (App Router) with React 18 and TypeScript.
- **Styling**: Tailwind CSS with dark navy emergency color scheme (`#070b14`).
- **Icons**: Lucide React.
- **Maps**: Leaflet 1.9 with OpenStreetMap tiles & dynamic client SSR avoidance.
- **Charts**: Recharts 2.x for data-driven analytics.
- **Database**: Prisma ORM with SQLite (`dev.db`).
- **Offline Storage**: Dexie.js (IndexedDB wrapper) & Service Worker (`sw.js`).
- **Unit Testing**: Native Node.js Test Runner (`node --test`).

---

## 🚀 5. Quick Start & Setup Instructions

### Prerequisites
- Node.js v18+ or v20+
- npm v9+

### Step-by-Step Run Commands

```bash
# 1. Navigate to project directory
cd aapdasetu

# 2. Install dependencies (if not already installed)
npm install

# 3. Synchronize database schema with SQLite
npm run db:push

# 4. Seed comprehensive demo disaster dataset
npm run db:seed

# 5. Run automated algorithm unit tests
npm test

# 6. Start development server
npm run dev
```

Open your browser at: **`http://localhost:3000`**

---

## 🔐 6. Demo Accounts & Credentials

The platform includes 3 pre-seeded demo accounts. You can also sign in with **1 click** using the quick-switch buttons on `/login`.

| Role | Email | Password | Access Privileges |
|---|---|---|---|
| **Disaster Commander (Admin)** | `admin@aapdasetu.gov.in` | `Admin@12345` | Full incident command, alert broadcasting, shelter capacity modification, inventory adjustments, demo dataset reset. |
| **NDRF Field Responder** | `responder@aapdasetu.gov.in` | `Rescue@12345` | SOS incident triage, status transitions (`ASSIGNED`, `EN_ROUTE`, `RESOLVED`), operational map. |
| **Affected Citizen** | `citizen@aapdasetu.gov.in` | `Citizen@12345` | Personal risk dashboard, family circle check-in, shelter routing, offline mode. |

---

## 🧪 7. Automated Testing

All core mathematical models and edge-case behaviors are validated using automated unit tests:

```bash
npm test
```

### Verified Test Cases:
1. `Risk scoring handles extreme flood scenario (Breached danger + cloudburst >= 85 Extreme)` — **PASS**
2. `Risk scoring handles low risk dry weather scenario (< 30 Low)` — **PASS**
3. `Resource shortage algorithm handles division by zero safely` — **PASS**
4. `Resource shortage detects critical depletion within 24 hours (< 1 day)` — **PASS**
5. `SOS priority assigns CRITICAL to trapped families with vulnerable members` — **PASS**

---

## 📊 8. Feature Matrix

| Feature | Status | Notes |
|---|---|---|
| **Flood Risk Dashboard** | ✅ Implemented | Live normalized calculation via `/api/risk`. |
| **Leaflet OpenStreetMap GIS** | ✅ Implemented | Layer toggles, custom SVG markers, popup telemetry. |
| **Smart Shelter Finder** | ✅ Implemented | 8+ seeded shelters ranked by 4-factor formula. |
| **Safe Route Planner** | ✅ Implemented | 3 candidate corridors evaluated against flooded hazards. |
| **Emergency SOS Workflow** | ✅ Implemented | Mobile form, unique ID (`SOS-XXXX`), priority calculation. |
| **Responder Triage Center** | ✅ Implemented | 4-state workflow, assign to self, audit logging. |
| **Admin Shelter Management** | ✅ Implemented | Capacity validation (`occupied <= total`), citizen live sync. |
| **Relief Shortage Prediction** | ✅ Implemented | Burn-rate formula, zero-drain protection, replenishment math. |
| **Public Alert Broadcasting** | ✅ Implemented | Create, preview, and withdraw bulletins. |
| **Recharts Analytics** | ✅ Implemented | Severity pie chart, SOS bar chart, water trend lines. |
| **AI Safety Assistant** | ✅ Implemented | Always-available bubble, local rule-based fallback, guardrails. |
| **PWA & Offline Storage** | ✅ Implemented | Service worker shell cache, Dexie IndexedDB, offline SOS queue. |
| **Bilingual Interface** | ✅ Implemented | English / Hindi switcher across major labels. |
| **Live External Weather API** | 🔌 Plug-and-Play | Schema ready; configure `WEATHER_API_KEY` in `.env`. |
| **Live CWC River Telemetry** | 🔌 Plug-and-Play | Model supports external provider replacement. |

---

## 📴 9. Offline PWA & Resilience Architecture

During power outages or cell tower collapse:
1. The **Service Worker** serves cached application shell assets from local cache.
2. **Dexie.js (IndexedDB)** stores downloaded shelter registries and emergency numbers (112, 1077, 108).
3. If an SOS request is filed while disconnected, it is saved in local IndexedDB with a `DRAFT-SOS-XXXX` tracking ID labeled **“Saved on this device — NOT YET SENT”**.
4. When network connectivity is restored, the client automatically flushes the queue to `/api/sos` and confirms server delivery.

---

## ⚠️ 10. Safety & Statutory Disclaimer

> **STATUTORY NOTICE:** AAPDASETU is a technological demonstration and disaster response coordination platform utilizing simulated hydrological models and sample incident telemetry (Bihar Riparian Sector). It is **not** an official government declaration from the National Disaster Management Authority (NDMA) or Central Water Commission (CWC). In an active life-threatening flood, immediately dial **112** (National Emergency) or **1077** (District Emergency Operations Center). Never walk or drive into moving floodwater.

