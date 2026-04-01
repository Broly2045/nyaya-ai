# ⚖️ Nyaya-AI — Indian Legal Intelligence

Nyaya-AI is a state-of-the-art **Legal Document Intelligence** platform designed to bridge the gap between complex Indian statutes and actionable legal insights. Built for lawyers, researchers, and litigants, it leverages the high-speed reasoning of **Llama 3.3** (via Groq) to analyze documents against the **Bharatiya Nyaya Sanhita (BNS)**, CPC, and the Constitution.


## ✨ Premium Features

*   **🤖 Autonomous Legal Drafter**: Generate court-ready Bail Applications, Legal Notices, and Petitions by simply describing the facts. Our specialized agent ensures proper statutory citations and formal formatting.
*   **🔍 Precision Clause Extraction**: Seamlessly ingest PDFs and DOCX files. Nyaya-AI identifies critical clauses, obligations, and liabilities with high accuracy.
*   **⚖️ Statuatory Mapping**: Automatically cross-references findings with the latest Indian legal codes, providing context for **BNS 2023**, **BNSS 2023**, and classic frameworks like the **IPC** and **CPC**.
*   **💬 Interactive Case Chat**: Interrogate your documents in plain English or Hindi. Ask about limitation periods, default bail eligibility, or case merits with instant, cited responses.
*   **🛡️ Document Management Workspace**: A dedicated dashboard to upload, manage, and track your legal case files and AI analysis history in a clean, professional interface.

## 🛠 Modern Tech Stack

*   **Frontend**: Next.js 15 (App Router), Tailwind CSS (Premium Aesthetics)
*   **Icons & Motion**: Lucide React, Framer Motion transitions
*   **AI Backend**: Groq Inference Engine (`llama-3.3-70b-versatile`)
*   **Database**: MongoDB Atlas (Transactional Data)
*   **Security**: NextAuth.js (Secure JWT-based Authentication)
*   **Performance**: Upstash Redis (Edge-based Rate Limiting)

---

## 🚀 Rapid Setup

### 1. Requirements
Ensure you have **Node.js 20+** and a running MongoDB instance.

### 2. Installation
```bash
git clone https://github.com/Broly2045/nyaya-ai.git
cd nyaya-ai
npm install
```

### 3. Environment Secrets
Create a `.env.local` file and populate it with your credentials:

```env
# Authentication
NEXTAUTH_SECRET=generate_a_random_string
NEXTAUTH_URL=http://localhost:3000

# Providers
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# AI & Database
GROQ_API_KEY=...
MONGODB_URI=...

# Rate Limiting (Upstash)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

### 4. Launch
```bash
npm run dev
```
Navigate to `http://localhost:3000` to begin.

---

## 🐳 Docker (Development)
For a localized development experience including a pre-configured database UI:
```bash
docker-compose up --build
```

## 🌐 Deployment
Nyaya-AI is optimized for high-performance deployment on **Vercel**.
1. Connect your repository to Vercel.
2. Add your `.env.local` variables to the Vercel Dashboard.
3. Deploy. The platform will automatically handle serverless function routing and edge-caching.

---

## 📄 License & Disclaimer
Built for the **Indian Legal System**. 
*Disclaimer: Nyaya-AI is an AI-powered assistant. All generated drafts and analyses should be reviewed by a qualified legal professional before submission to any court of law.*

© 2026 Nyaya-AI · Developed in India 🇮🇳
