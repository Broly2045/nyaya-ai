# ⚖️ Nyaya-AI

Nyaya-AI is a next-generation Legal Document Analysis platform built to democratize high-level legal insights. By leveraging the immense reasoning capabilities of **Llama 3.3** (via Groq), Nyaya-AI securely ingests legal documents, strictly isolates high-risk liabilities, and provides an interactive localized Chat Interface allowing users to interrogate clauses and cross-reference Indian Legal Codes (like BNS and CPC).

It boasts a gorgeous, highly-responsive Tailwind CSS interface engineered for zero-friction user-experience. 

## ✨ Key Features
* **AI-Powered Clause Extraction**: Automatically unpacks complex legal PDFs and DOCX files into readable chunks.
* **Risk & Liability Scoring**: Every document receives a comprehensive Risk Score with specific 'Key Findings' categorizing risks by High, Medium, or Low severity.
* **Document Chat Engine (LPU)**: Stop skimming pages. Ask the embedded AI chat-bot exact legal questions about the document and receive contextual, localized legal feedback instantly.
* **Premium Dashboard UI**: Manage your Vault, analyze your API usage limits, and delete documents with beautiful glassmorphic micro-animations.

## 🛠 Tech Stack
* **Framework**: Next.js 14 (App Router)
* **Design/UI**: Tailwind CSS, Lucide React Icons
* **Authentication**: NextAuth.js (Google / Credentials)
* **Database & Caching**: MongoDB Atlas (Storage) & Redis / Upstash (Usage Rate Limiting)
* **AI Engine**: Groq SDK (`llama-3.3-70b-versatile`)
* **Infrastructure**: Pre-configured for both Docker & Vercel deployment

---

## 🚀 Getting Started Locally

### 1. Prerequisites
Ensure you have **Node.js 18+** installed. You'll also need connections to MongoDB and Upstash Redis (or you can run them locally via Docker).

### 2. Clone and Install
```bash
git clone https://github.com/Broly2045/nyaya-ai.git
cd nyaya-ai
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root of the project. You must supply the following exact keys:

```env
# Authentication
NEXTAUTH_SECRET=your_super_secret_string
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret

# AI Engine
GROQ_API_KEY=your_groq_api_key

# Databases
MONGODB_URI=your_mongodb_atlas_connection_string
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

### 4. Run the Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) and start uploading legal documents!

---

## 🐳 Docker Support
If you'd prefer not to use cloud databases for local development, Nyaya-AI includes a fully configured containerized environment. 
This bypasses Atlas and Upstash by spinning up local `mongo` and `redis` containers in addition to the `.next` app container.

```bash
docker-compose up --build
```
*(A local database-inspector UI will also boot up sequentially on port `8081`)*

---

## 🌐 Production Deployment (Vercel)
Nyaya-AI is strictly optimized for **Vercel** serverless environments. 

1. Install the Vercel CLI or link your GitHub repo directly on the Vercel Dashboard.
2. Ensure you map **all** `.env.local` variables directly into Vercel's `Settings -> Environment Variables` panel. 
3. Click "Deploy". The platform utilizes Next.js robust caching inherently, so it will deploy smoothly in under 2 minutes.
