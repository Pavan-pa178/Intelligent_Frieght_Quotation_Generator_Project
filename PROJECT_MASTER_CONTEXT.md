# PORTLINE Intelligent Freight Platform — Consolidated Project Master Context
**Merged Project History & Multi-Chat Unified Reference**

---

## 1. Project Background & Objective
This platform is the **PORTLINE Intelligent Freight Platform** developed for the **Infosys SpringBoard Internship Project**.
It integrates Machine Learning pricing models, multi-agent orchestration, statutory customs compliance, real-time address validation, and a multi-stage sequential approval workflow into a unified logistics web application.

---

## 2. Combined Chronological Milestones

### Phase 1: Project Initialization & Milestone 1 (Data & Architecture)
- **Data Engineering**: Compiled empirical maritime and air corridors, container basis metrics (`20GP`, `40GP`, `40HC`, `LCL`), port distances, and transit times.
- **Synthesized 5,000-row Dataset**: Generated and verified synthetic shipment pricing datasets (`freight_pricing_training_dataset_5000.xlsx` and `merged_freight_pricing_dataset.csv`).
- **Core Architecture**:
  - Backend: Django REST Framework with modular apps (`quotes`, `shipments`, `analytics`, `agents`).
  - Database: MongoDB Atlas cloud cluster with seamless in-memory / SQLite fallback for disconnected operation.
  - Frontend: Vite React application with responsive Tailwind CSS design.

### Phase 2: Milestone 2 (Machine Learning Pricing Engine)
- **Multi-Factor Pricing Equation**:
  $$\text{Final Tariff} = \text{Base Freight} + \text{BAF} + \text{Origin THC} + \text{Dest THC} + \text{Documentation} + \text{Margin}$$
- **Model Training**: Trained Random Forest and Gradient Boosted Regressors predicting base freight rates and spot surcharges from gross weight, sea distance, container size, and seasonal indices ($R^2 \approx 0.98$, Low MAE/RMSE).
- **ML Analytics Dashboard (`/analytics`)**: Live model performance tracking, corridor volume distribution, realized profit margins, and predictive vs. actual rate scatter plots.

### Phase 3: Milestone 3 (Multi-Agent System & Statutory Customs RAG)
- **5 Autonomous Domain Agents (`/agents`)**:
  1. *Pricing Agent*: Dynamic liner tariffs, BAF fuel calculation, margin floor enforcement.
  2. *Routing Agent*: Multi-carrier trade corridor optimization (Maersk, CMA CGM, Hapag-Lloyd).
  3. *Customs Agent*: Harmonized System (HS) code classification and statutory trade agreement mapping.
  4. *Risk Agent*: Marine weather monitoring, typhoon tracking, and port dwell time congestion.
  5. *Ops Agent*: Track & trace event checkpoints, booking confirmation, and milestone timeline updates.
- **Customs Legal RAG (`/customs`)**: Regulatory knowledge base covering EU Union Customs Code (UCC) Art. 127, India-Singapore CECA, SOLAS Convention Chap VII, and dangerous goods compliance.

### Phase 4: Chat 2 Enhancements (User Experience & Governance Workflows)
- **Origin & Destination Labels**: Simplified gateway labels in `Ship.jsx` to clean **"Origin"** and **"Destination"**.
- **Address Verification Logic**:
  - Implemented `checkAddressMatchesGateway(address, gateway)` ensuring pickup matches Origin port city (e.g. Chennai) and delivery matches Destination port city (e.g. Hamburg).
  - Provided live visual validation feedback (green checkmark if valid, red alert if mismatched).
- **Mobile Number Integration**:
  - Added dedicated **Mobile number / Phone** input field under Step 5 ("Destination contact details") in `Ship.jsx`.
  - Displayed contact mobile number in Quotation Details sidebar, Shipper Portal cards (`Portal.jsx`), and Tracking card (`Tracking.jsx`).
- **Interactive Route Selection**:
  - Customer can interactively select any recommended carrier route on `QuoteDetail.jsx`.
  - Dispatches `POST /api/v1/quotes/{id}/select-route/`, updates indicative total, and sets route status to `PENDING_APPROVAL`.
- **Agent Dashboard Simplification**:
  - Completely removed route recommendations in Freight Agent view (`?view=agent`) to eliminate broker clutter.
- **Sequential 3-Stage Approval Sequence**:
  - **Stage 1 (Freight Agent)**: Commercial approval in `/agent` &rarr; `AGENT_APPROVED`.
  - **Stage 2 (Customs Officer)**: Documentation clearance in `/customs` &rarr; `CUSTOMS_APPROVED`.
  - **Stage 3 (Customer Acceptance)**: "Accept & Book Quotation" button locked until both Agent and Customs have signed off.
- **Customs Document Flagging & Customer Upload Modal**:
  - Customs Officers can flag specific missing certificates (e.g., EU Declaration of Conformity, RoHS Certificate) with custom notes.
  - Customers receive compliance alerts on Quote Detail and Tracking pages with a **"Upload Required Documents"** button.
  - Opens a dedicated modal with **separate file upload inputs for each requested document**.
  - Submitting uploads documents, marks checklist items `VERIFIED`, and recalculates the statutory readiness score.

---

## 3. Verified System Endpoints

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/v1/quotes/` | List all freight quotes |
| `GET` | `/api/v1/quotes/{id}/` | Get detailed quote with route breakdown and customs status |
| `POST` | `/api/v1/quotes/{id}/select-route/` | Customer selects recommended route option |
| `POST` | `/api/v1/quotes/{id}/action/` | Freight Agent commercial approval/rejection |
| `POST` | `/api/v1/quotes/{id}/customs-action/` | Customs Officer clearance sign-off or document flagging |
| `POST` | `/api/v1/quotes/{id}/upload-documents/` | Customer uploads flagged compliance documents |
| `POST` | `/api/v1/quotes/{id}/customer-decision/` | Customer accepts or rejects finalized quote |
| `GET` | `/api/v1/shipments/track/{tn}/` | Live tracking checkpoints and customs clearance status |

---

## 4. Role Personas & Test Logins

| Persona | Email | Password | Default Workspace |
|:---|:---|:---|:---|
| **Customs Officer** | `customs@portline.in` | `customs123` | `/customs` |
| **Freight Broker / Agent** | `agent@portline.in` | `agent123` | `/agent` |
| **Shipper (Customer)** | `demo@portline.in` | `demo123` | `/portal` |
| **Operations Admin** | `admin@portline.in` | `admin123` | `/admin` |
| **AI Agent Ops** | `agentop@portline.in` | `agent123` | `/agents` |
| **Analytics Manager** | `manager@portline.in` | `manager123` | `/analytics` |

---

## 5. Verification Status
- **Automated Backend Suite**: 7/7 test stages passed (`backend_test_workflow.py`).
- **Frontend Production Build**: Vite production build succeeded with Code 0.
- **Live Local Servers**:
  - Backend API: `http://localhost:8000`
  - Frontend UI: `http://localhost:5173`
