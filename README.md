# 🚀 Nodebase — A Production-Ready Workflow Automation Platform

Nodebase is a **modern, extensible, and production-ready workflow automation platform** inspired by tools like **Zapier** and **n8n**. It enables users to visually design workflows using a **node-based editor**, execute them reliably, integrate with **AI providers**, **webhooks**, and **third-party services**, and operate everything as a full-fledged **SaaS product**.

This repository demonstrates a **complete end-to-end system**: frontend, backend, execution engine, background jobs, authentication, payments, AI integration, monitoring, and deployment.

> 📌 This README is intentionally detailed so anyone can understand the system **without opening the codebase**.

---

## ✨ What Is Nodebase?

Nodebase allows users to:

- Build automation workflows using a **drag-and-drop canvas**
- Combine **trigger nodes** and **execution nodes**
- Execute workflows **synchronously or asynchronously**
- Receive **real-time execution feedback**
- Securely manage credentials
- Enforce **subscription-based access**
- Track **errors, sessions, and AI usage**
- Deploy and operate as a **production SaaS**

---

## 🧠 Core Concepts

### Workflow Canvas

Workflows are modeled as **directed graphs**:

- **Trigger Nodes**
  - Entry point of workflows
  - Examples: Manual Trigger, Google Form Trigger, Stripe Webhook

- **Execution Nodes**
  - Perform actions
  - Examples: HTTP Request, OpenAI, Gemini, Anthropic, Discord, Slack

Execution order is derived automatically based on node connections.

---

### Execution Engine

- Starts execution from trigger nodes
- Resolves dependencies via **topological sorting**
- Uses an **executor registry** mapping node types → executor logic
- Passes data and context between nodes
- Enables branching and complex automation flows

---

### Background Jobs (Ingest)

Used for long-running or expensive operations:

- AI inference
- Multi-step workflows
- External API requests

Benefits:
- Non-blocking UX
- Automatic retries
- Real-time pub/sub updates
- Reliable execution guarantees

---

### Real-Time Node Status

Each node displays live execution state:

- ⏳ Running
- ✅ Success
- ❌ Failed

Powered by **Ingest real-time channels**, consumed via a custom React hook.

---

### Dynamic Templating

Node inputs support **Handlebars templating**:

```handlebars
https://api.example.com/users/{{nodes.http_1.output.userId}}

- Reference outputs from previous nodes  
- Custom JSON helpers  
- Enables powerful data-driven workflows  

---

# 🧱 Tech Stack

## 🎨 Frontend

- **Next.js 15.5.4** — App Router, Server Components  
- **React + TypeScript** — Type-safe UI development  
- **Tailwind CSS v4** — Utility-first styling (no config required)  
- **Shadcn UI** — Consistent, accessible UI components  
- **React Flow** — Node-based workflow canvas  
- **Yai** — Lightweight global state management  
- **Nooks** — URL-synced pagination and filters  
- **SuperJSON** — Safe serialization for complex data  

---

## 🛠 Backend & API

- **tRPC** — End-to-end type-safe APIs  
- **Prisma ORM** — Database schema and access layer  
- **PostgreSQL (Neon)** — Serverless Postgres provider  
- **Zod** — Runtime schema validation  
- **Node.js** — Backend runtime  

---

## 🔐 Authentication

- **BetterAuth** — Modern authentication system  
- **Prisma Adapter** — Database-backed sessions  

### OAuth Providers
- Google  
- GitHub  

- Protected **tRPC procedures** for access control  

---

## 💳 Payments & Subscriptions

- **Polar**
  - Open-source Merchant of Record  
  - Subscription management  
  - Taxes & billing  

- Premium-gated API procedures  
- Subscription-aware UI and feature access  
- Billing portal integration  

---

## 🔄 Background Jobs & Real-Time

- **Ingest**
  - Background job execution  
  - Retry logic  
  - Real-time pub/sub messaging  

- Live node execution updates  
- Reliable async processing  

---

## 🤖 AI & Automation

- **AI SDK**
  - OpenAI  
  - Google Gemini  
  - Anthropic (Claude)  

- Background AI execution  
- System & user prompts  
- Token usage, latency, and cost tracking  
- AI observability via Sentry  

---

## 🔑 Credential Management & Security

- Encrypted credential storage using **cryptor**  
- User ownership enforcement  
- Credential ID injection protection  
- Secure credential selection per node  
- Designed for future secrets manager integration  

---

## 📊 Monitoring & Observability

- **Sentry**
  - Frontend & backend error tracking  
  - Session replay  
  - AI call monitoring  

- Execution error tracing  
- Detailed stack traces and logs  

---

## 🧑‍💻 Developer Experience

- **CodeRabbit** — AI-powered GitHub code reviews  
- Feature-based Git workflow  
- Chapter-based commits  
- Pull-request driven development  
- Clean, readable Git history  

---

# 🧩 Workflow Editor (React Flow)

- Drag, zoom, and pan canvas  
- Custom trigger & execution nodes  
- Node selector panel  
- Node configuration dialogs  
- Visual execution indicators  
- Save/load editor state from database  
- Bidirectional mapping between React Flow and Prisma models  

---

# 🔐 Authentication & Authorization

- Email/password login  
- OAuth (Google, GitHub)  
- Secure sessions  
- Protected routes  
- Authorization enforced via **tRPC**, not middleware  

---

# 🧪 Execution History & Monitoring

- Persistent execution records  
- Status lifecycle: `running → success / failed`  
- Execution duration tracking  
- Outputs and error stack traces  
- Linked to background job lifecycle  
