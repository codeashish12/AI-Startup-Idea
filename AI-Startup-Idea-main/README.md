# Future Engine - AI Scenario-based Decision Platform

> **Disclaimer:** This is a scenario-based decision support system. It does not predict the future.

Future Engine is an enterprise-grade AI decision simulation platform built with React 19, Express, TypeScript, Zod, and Google Gemini. It allows professionals, founders, and students to evaluate complex career, business, and financial decisions by comparing 3 distinct strategic pathways (Aggressive, Balanced, Conservative) using the **Future Decision Framework (FDF)**.

---

## Key Capabilities

- **FDF Engine Architecture:** Modular, decoupled engine microservices for Identity, Goal Understanding, Skill Gap Analysis, Risk Vectors, Opportunity Vectors, Decision Formula Evaluation, Roadmap Generation, and Report Synthesis.
- **Explainability Engine:** Every decision score, risk score, and opportunity score is accompanied by mathematical formula breakdowns, key drivers, weighting models, and trade-offs.
- **Production Backend API:** Standardized REST endpoints supporting JWT Authentication, Profile Management, Simulation Persistence, Report Synthesis, Analytics Dashboard, and OpenAPI 3.0 documentation.
- **Strict Scope & Currency Discipline:** All monetary amounts are formatted in Indian Rupees (₹ INR / Lakhs / Crores).

---

## REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/signup` | Register new user account |
| `POST` | `/auth/login` | Authenticate user & receive JWT |
| `GET` | `/profile` | Retrieve user profile & capacity |
| `PUT` | `/profile` | Update user profile |
| `POST` | `/simulation` | Execute FDF AI decision simulation |
| `GET` | `/simulation/:id` | Fetch saved simulation by UUID |
| `POST` | `/report` | Generate complete PDF/JSON report payload |
| `GET` | `/dashboard` | Retrieve user analytics & history |
| `GET` | `/fdf/architecture` | Inspect FDF modules, formulas & weights |
| `GET` | `/docs` | OpenAPI 3.0 Specification JSON |

---

## How to Run Locally

### Prerequisites
- Node.js v20+ or v22+
- npm v10+

### Steps

1. **Clone & Install Dependencies:**
   ```bash
   git clone <repository-url>
   cd future-engine
   npm install
   ```

2. **Configure Environment Variables:**
   Create `.env` file in project root:
   ```env
   PORT=3000
   JWT_SECRET=production_jwt_secret_key_2026
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Run Unit Tests:**
   ```bash
   npm run test
   ```

5. **Type Check & Linting:**
   ```bash
   npm run lint
   ```

6. **Build for Production:**
   ```bash
   npm run build
   npm run start
   ```

---

## System Architecture & FDF Scoring Formulas

- **Risk Score Formula:**
  $$\text{RiskScore} = (\text{Fin} \times 0.25) + (\text{Time} \times 0.15) + (\text{Exec} \times 0.20) + (\text{Comp} \times 0.10) + (\text{Tech} \times 0.10) + (\text{Learn} \times 0.10) + (\text{Market} \times 0.10)$$

- **Opportunity Score Formula:**
  $$\text{OppScore} = (\text{Income} \times 0.25) + (\text{Growth} \times 0.20) + (\text{Learning} \times 0.15) + (\text{Freedom} \times 0.15) + (\text{Demand} \times 0.15) + (\text{Networking} \times 0.10)$$

- **Decision Score Formula:**
  $$\text{DecisionScore} = (\text{GoalFit} \times 0.35) + (\text{OpportunityScore} \times 0.35) - (\text{RiskScore} \times 0.30)$$

---

## License

Proprietary & Confidential - Future Engine © 2026.
