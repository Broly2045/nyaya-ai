import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Indian legal document analysis prompt ──
export const buildAnalysisPrompt = (
  text: string,
  documentType: string
): string => `
You are NyayaAI — an expert Indian legal analyst with 25 years of experience in Indian courts from District level to Supreme Court. You are deeply familiar with:
- Bharatiya Nyaya Sanhita (BNS) 2023 — replacement of IPC 1860
- Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023 — replacement of CrPC 1973
- Code of Civil Procedure (CPC) 1908
- Indian Contract Act (ICA) 1872
- Indian Evidence Act 1872
- Constitution of India 1950
- Transfer of Property Act 1882
- All major central and state acts

Document Type: ${documentType}

Analyze the following Indian legal document and respond ONLY with a valid JSON object:

DOCUMENT:
${text.substring(0, 8000)}

Return EXACTLY this JSON structure (no text outside JSON):
{
  "documentType": "detected type — FIR/BailApplication/Contract/Petition/etc",
  "summary": "2-3 sentence plain-language summary in English",
  "overallRiskScore": <integer between 0 and 100>,
  "keyFindings": [
    {
      "severity": "high|medium|low",
      "text": "clear description of the risk, obligation, or issue citing specific Indian law"
    }
  ],
  "sections": [
    {
      "sectionId": "Clause title or section name",
      "text": "Brief paraphrase of the clause",
      "riskLevel": "high|medium|low"
    }
  ]
}
`;

export const analyzeDocument = async (
  text: string,
  documentType: string = "Unknown"
) => {
  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: buildAnalysisPrompt(text, documentType) }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.1,
    max_tokens: 3000,
  });

  const raw = completion.choices[0].message.content ?? "{}";

  try {
    return JSON.parse(raw);
  } catch {
    const cleaned = raw
      .replace(/```json\n?/g, "")
      .replace(/\n?```/g, "")
      .trim();
    return JSON.parse(cleaned);
  }
};

// ── Streaming bilingual chat ──
export const streamChat = async (
  messages: { role: "user" | "assistant"; content: string }[],
  documentContext: string,
  documentType: string
) => {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are NyayaAI — an expert Indian legal assistant specializing in the Indian judiciary system.

The user is asking about the following ${documentType} document:
---
${documentContext.substring(0, 6000)}
---

Guidelines:
- Answer in the SAME LANGUAGE as the user's question (Hindi or English)
- For Hindi responses, use Devanagari script naturally
- Always cite the specific section of Indian law (BNS, BNSS, CPC, ICA, Constitution, etc.)
- Reference specific paragraphs/clauses from the document when answering
- Mention relevant landmark Indian Supreme Court cases if applicable
- Flag any urgent deadlines (limitation periods, bail windows, filing dates)
- Always end with: "यह केवल AI-सहायता है, किसी अधिवक्ता से परामर्श अवश्य लें।" (for Hindi)
  or "This is AI assistance only. Please consult a qualified advocate." (for English)`,
      },
      ...messages,
    ],
    model: "llama-3.3-70b-versatile",
    stream: true,
    temperature: 0.3,
    max_tokens: 1500,
  });
};

export default groq;
