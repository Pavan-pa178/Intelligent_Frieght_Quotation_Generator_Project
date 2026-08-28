# PORTLINE Intelligent Freight Platform ? Role Credentials Guide

This document contains the verified production credentials and workspace routing for all role personas in the PORTLINE system.

---

## ?? System Role Credentials

| Role | Email | Password | Assigned Workspace | Purpose & Capabilities |
|:---|:---|:---|:---|:---|
| **Customs Officer** | `customs@portline.in` | `customs123` | **`/customs`** | Harmonized System (HS) statutory validation, Legal RAG regulatory screening, and formal officer clearance sign-offs with audit trails. |
| **Analytics Manager** | `manager@portline.in` | `manager123` | **`/analytics`** | Executive commercial dashboard, corridor revenue analysis, realized margin distribution, and ML model performance metrics ($R^2$, MAE, RMSE). |
| **AI Agent Ops** | `agentop@portline.in` | `agent123` | **`/agents`** | Real-time multi-agent orchestration monitoring, cluster uptime telemetry, inference latency (p50/p95), and fallback status for all 5 domain agents. |
| **Operations Admin** | `admin@portline.in` | `admin123` | **`/admin`** | Master gateway and route rate card governance, global quote inspection, and platform user management. |
| **Broker / Agent** | `agent@portline.in` | `agent123` | **`/agent`** | Broker review queue, carrier route confirmation, tariff margin floor checks, and slot booking verification. |
| **Customer (Shipper)** | `demo@portline.in` | `demo123` | **`/portal`** | Customer shipper portal: active shipment milestone tracking, quotation history, and new cargo booking requests. |
| **Custom User** | `hello1@gmail.com` | `HelloTest` | **`/portal`** | Verified customer account for custom booking scenarios and testing. |

---

## ?? Quick Navigation & Access Rules

1. **Direct Login**: Navigate to `/login` and use the email & password from the table above, or click the **1-Click Quick Persona Buttons** below the login form.
2. **Universal Logout**: Available in the top-right corner of the navbar on every page across desktop and mobile.
3. **Database Persistence**: All above accounts are permanently hashed and stored in the backend database (`backend/db.sqlite3`).
