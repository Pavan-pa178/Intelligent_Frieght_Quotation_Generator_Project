# PORTLINE FREIGHT SYSTEMS
## Comprehensive Role Credentials, Demo Dashboards & System Access Directory

> **SYSTEM NOTICE**: All accounts listed in this directory are active and verified across both the Django authentication backend and the MongoDB database. Demo dashboard accounts use dedicated credentials with `.demo` as suffix for both username/email and password, fully isolated from real production accounts. Multi-role access routes are automatically gated by role permissions upon login at [http://localhost:5173/login](http://localhost:5173/login).

---

## 1. System End-to-End Operational Workflow

```
[ 1. Admin Verification & Governance ] (/admin)
  │  • Platform Admin approves & verifies partner freight companies (CMA CGM, MSC, Maersk, etc.)
  │  • Verifying grants 'is_eligible: true', enabling carrier routes in customer recommendations
  │  • Admin / Manager onboards carrier operational agents with email and password
  ▼
[ 2. Company Manager Operations ] (/analytics)
  │  • Carrier Company Manager monitors assigned quote requests, SLA windows, and ML telemetry
  │  • Manages operational agent team directory and provisions new agent logins
  ▼
[ 3. Customer Quote Creation & Live Estimation ] (/ship)
  │  • Shipper selects Origin, Destination, Freight Mode (Ocean FCL/LCL, Air, Road), & Cargo Specs
  │  • AI Pricing Engine computes nautical distance, BAF bunker surcharge, THC, and ML-predicted rates
  │  • Only Admin-Verified & Eligible carrier options are presented
  │  • Shipper submits quotation request -> Pipeline Status: 'PENDING_AGENT_REVIEW'
  ▼
[ 4. Carrier Agent Review & Pricing Revision ] (/agent)
  │  • Specific Carrier Desk Agent reviews quote in carrier-isolated queue (/agent?desk=...)
  │  • Agent can: 1) Approve Quote, 2) Revise Pricing (Base freight, BAF, THC), or 3) Reject
  │  • Workflow Status updates: 'Approved by Agent' or 'Price Revised by Agent'
  ▼
[ 5. Customs Clearance Review ] (/customs)
  │  • Customs Officer reviews container declaration, HS codes, Bill of Lading (B/L), and entry docs
  │  • Officer grants Customs Clearance -> Workflow Status updates: 'Customs Approved'
  ▼
[ 6. Customer Decision & Final Booking ] (/quotes/:id)
  │  • Customer inspects live dual-status stepper (Agent Approval + Customs Approval)
  │  • If price was revised by agent, customer reviews adjustment breakdown
  │  • Customer clicks 'Accept & Book Quotation' -> Status updates to 'Booked' / 'CONFIRMED'
  │  • Synced instantly across Customer Portal, Carrier Agent Desk, Admin Panel, and Tracking
  ▼
[ 7. Real-Time Tracking & Shipment Lifecycle ] (/tracking)
  │  • Real-time container milestones (Booking Confirmed -> Cargo Picked Up -> In Transit -> Delivered)
```

---

## 2. Dedicated Isolated Demo Dashboard Accounts (`.demo` Suffix)

*These accounts are dedicated exclusively for demonstration and evaluation. Their data (quotes, shipments, audit trails) is completely isolated from real production staff and customer accounts.*

| Demo Role | Assigned Name | Login Email / Username | Password | Target Dashboard |
| :--- | :--- | :--- | :--- | :--- |
| **Customer / Shipper Demo** | Demo Shipper | `customer.demo@portline.in` | `customer.demo` | `/portal` |
| **Platform Administrator Demo** | Demo Admin | `admin.demo@portline.in` | `admin.demo` | `/admin` |
| **Customs Clearance Officer Demo** | Demo Customs Officer | `customs.demo@portline.in` | `customs.demo` | `/customs` |
| **Carrier Agent Lead Demo** | Demo Agent Lead | `agent.demo@portline.in` | `agent.demo` | `/agent` |
| **Company Analytics Manager Demo** | Demo Analytics Mgr | `manager.demo@portline.in` | `manager.demo` | `/analytics` |
| **AI Agent Ops Telemetry Demo** | Demo AI Agent Ops | `agentop.demo@portline.in` | `agentop.demo` | `/agents` |

---

## 3. Core Production Staff & System Operations Roles

*Production operational accounts for authorized staff members:*

| Role & Description | Assigned Name | Login Email | Password | Dashboard URL |
| :--- | :--- | :--- | :--- | :--- |
| **System Administrator** | Priya Admin | `admin@portline.in` | `admin123` | `/admin` |
| **Commercial Agent Desk Lead** | Arjun Agent | `agent@portline.in` | `agent123` | `/agent` |
| **Customs Clearance Officer** | Inspector Rajesh Kumar | `customs@portline.in` | `customs123` | `/customs` |
| **Commercial Analytics Manager** | Ananya Roy | `manager@portline.in` | `manager123` | `/analytics` |
| **AI Agent Operations (ML Ops)** | Suresh Varma | `agentop@portline.in` | `agentop.demo` | `/agents` |

---

## 4. Carrier-Specific Commercial Agent Desks (`/agent`)

*When a customer selects a carrier option from the 3 route recommendations on their quotation detail page, the commercial review is automatically routed to the corresponding carrier desk below.*

| Carrier Desk / Company | Company ID | Assigned Lead Agent | Desk Login Email | Password | Isolated Desk URL |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CMA CGM Commercial Desk** | `COMP-CMA-01` | Deepa Nair (CMA CGM Desk) | `agent.cmacgm@portline.in` | `agent123` | `/agent?desk=CMA%20CGM` |
| **MSC (Mediterranean Shipping Co)** | `COMP-MSC-02` | Vikram Singh (MSC Desk) | `agent.msc@portline.in` | `agent123` | `/agent?desk=MSC` |
| **Maersk Line Commercial Desk** | `COMP-MSK-03` | Kiran Reddy (Maersk Desk) | `agent.maersk@portline.in` | `agent123` | `/agent?desk=Maersk` |
| **Evergreen Marine Desk** | `COMP-EVG-04` | Amrita Pillai (Evergreen Desk) | `agent.evergreen@portline.in` | `agent123` | `/agent?desk=Evergreen` |
| **Hapag-Lloyd Commercial Desk** | `COMP-HAP-05` | Sunil Verma (Hapag Desk) | `agent.hapag@portline.in` | `agent123` | `/agent?desk=Hapag-Lloyd` |
| **COSCO Shipping Line Desk** | `COMP-COS-06` | Ravi Shankar (COSCO Desk) | `agent.cosco@portline.in` | `agent123` | `/agent?desk=COSCO` |
| **Ocean Network Express (ONE)** | `COMP-ONE-07` | Pooja Menon (ONE Desk) | `agent.one@portline.in` | `agent123` | `/agent?desk=ONE` |
| **Air Cargo Desk** *(Emirates, Air India)* | `COMP-AIR-08` | Meera Iyer (Air Cargo Desk) | `agent.air@portline.in` | `agent123` | `/agent?desk=Air` |
| **Express Courier Desk** *(DHL, FedEx)* | `COMP-EXP-09` | Nitesh Dubey (Express Desk) | `agent.express@portline.in` | `agent123` | `/agent?desk=Express` |
| **General / Lead Commercial Desk** | `COMP-GEN-10` | Arjun Agent (General Desk) | `agent@portline.in` | `agent123` | `/agent` |

---

## 5. Registered Shipper & Customer Accounts

*Shipper accounts access the Customer Portal (`/portal` and `/quotes`) where they can create freight quote requests, compare 3-tier route recommendations, inspect multi-leg transit maps, select carrier routes, and book/track shipments.*

| Customer / Contact Name | Organization / Company | Registered Email | Password | Account Status |
| :--- | :--- | :--- | :--- | :--- |
| **Demo Shipper (Isolated)** | Global Trade Corp (Demo) | `customer.demo@portline.in` | `customer.demo` | Primary Demo Customer (Pre-seeded) |
| **Hello Shipper** | Global Shippers Corp | `hello1@gmail.com` | `HelloTest` *(or `hellotest`)* | Primary Active Customer (Production) |
| **Ravi Sharma** | Sharma Textiles | `ravi@sharmatextiles.in` | `demo123` | Registered Database User |
| **Alen Alex Paul** | Global Logistics Partner | `alenalex243@gmail.com` | `AS45678` | Registered Database User |
| **Samanvitha** | Dyashin Cargo | `samanchitlur@gmail.com` | `samanvitha` | Registered Database User |

---

## 6. Login Page 1-Click Demo Buttons Reference

On the Login screen (`/login`), 1-click quick-fill buttons are embedded at the bottom for instant access:
1. **1. Customer Demo (Shipper)**: `customer.demo@portline.in` / `customer.demo` (Routes to `/portal`)
2. **2. Admin Demo**: `admin.demo@portline.in` / `admin.demo` (Routes to `/admin`)
3. **3. Customs Demo**: `customs.demo@portline.in` / `customs.demo` (Routes to `/customs`)
4. **4. AI Ops Demo**: `agentop.demo@portline.in` / `agentop.demo` (Routes to `/agents`)
5. **5. Manager Demo**: `manager.demo@portline.in` / `manager.demo` (Routes to `/analytics`)
6. **6. Carrier Agent Demo**: `agent.demo@portline.in` / `agent.demo` (Routes to `/agent`)
