"use client";

import { useEffect } from "react";
import Link from "next/link";
import "./landing.css";

export default function LandingPage() {
  useEffect(() => {
    const nav = document.getElementById("nav");
    const onScroll = () => {
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll("[data-fade]").forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <div className="landing-page">
      {/* Atmospheric background */}
      <div className="chakra-bg"></div>
      <div className="chakra-wheel">
        <svg viewBox="0 0 900 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ashoka Chakra-inspired pattern — 24 spokes */}
          <circle cx="450" cy="450" r="420" stroke="#E87213" strokeWidth="0.5" strokeDasharray="4 8" />
          <circle cx="450" cy="450" r="300" stroke="#E87213" strokeWidth="0.5" />
          <circle cx="450" cy="450" r="180" stroke="#E87213" strokeWidth="0.5" />
          <circle cx="450" cy="450" r="60" stroke="#E87213" strokeWidth="1" />
          <line x1="450" y1="30" x2="450" y2="870" stroke="#E87213" strokeWidth="0.4" />
          <line x1="30" y1="450" x2="870" y2="450" stroke="#E87213" strokeWidth="0.4" />
          <line x1="157" y1="157" x2="743" y2="743" stroke="#E87213" strokeWidth="0.4" />
          <line x1="743" y1="157" x2="157" y2="743" stroke="#E87213" strokeWidth="0.4" />
          <line x1="450" y1="30" x2="450" y2="870" stroke="#E87213" strokeWidth="0.4" transform="rotate(15 450 450)" />
          <line x1="450" y1="30" x2="450" y2="870" stroke="#E87213" strokeWidth="0.4" transform="rotate(30 450 450)" />
          <line x1="450" y1="30" x2="450" y2="870" stroke="#E87213" strokeWidth="0.4" transform="rotate(45 450 450)" />
          <line x1="450" y1="30" x2="450" y2="870" stroke="#E87213" strokeWidth="0.4" transform="rotate(60 450 450)" />
          <line x1="450" y1="30" x2="450" y2="870" stroke="#E87213" strokeWidth="0.4" transform="rotate(75 450 450)" />
          <line x1="450" y1="30" x2="450" y2="870" stroke="#E87213" strokeWidth="0.4" transform="rotate(90 450 450)" />
          <line x1="450" y1="30" x2="450" y2="870" stroke="#E87213" strokeWidth="0.4" transform="rotate(105 450 450)" />
          <line x1="450" y1="30" x2="450" y2="870" stroke="#E87213" strokeWidth="0.4" transform="rotate(120 450 450)" />
          <line x1="450" y1="30" x2="450" y2="870" stroke="#E87213" strokeWidth="0.4" transform="rotate(135 450 450)" />
          <line x1="450" y1="30" x2="450" y2="870" stroke="#E87213" strokeWidth="0.4" transform="rotate(150 450 450)" />
          <line x1="450" y1="30" x2="450" y2="870" stroke="#E87213" strokeWidth="0.4" transform="rotate(165 450 450)" />
        </svg>
      </div>

      {/* ═══ NAV ═══ */}
      <nav id="nav">
        <Link href="/" className="logo">
          <div className="logo-emblem">
            <div className="logo-chakra"></div>
          </div>
          <div>
            <div className="logo-text"><em>Nyaya</em>AI</div>
            <span className="logo-sub">Indian Legal Intelligence</span>
          </div>
        </Link>
        <ul className="nav-links">
          <li><a href="#docs">Document Types</a></li>
          <li><a href="#how">How It Works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>
        <Link href="/login" className="nav-cta">Log In / Try Free</Link>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-orb"></div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="hero-tag">
            <div className="tag-dot"><div className="tag-dot-inner"></div></div>
            <span>Powered by AI · Built for Indian Courts · v1.0</span>
          </div>

          <h1 className="hero-heading">
            India&apos;s AI<br />Legal Counsel
            <span className="line-hindi">न्याय — Now Instant.</span>
            <span className="line-light">From FIR to Supreme Court.</span>
          </h1>

          <p className="hero-sub">
            Upload any Indian legal document — FIR, bail application, vakalatnama, writ petition, or contract. NyayaAI reads every clause against IPC, BNS, BNSS, CPC, and the Constitution. Get a plain-language brief in seconds, or let our AI autonomously draft new court-ready legal documents for you.
          </p>

          <div className="hero-actions">
            <Link href="/register" className="btn-saffron">Analyze your first document free</Link>
            <a href="#how" className="btn-outline">See how it works <span className="arrow">→</span></a>
          </div>

          <div className="trust-bar">
            <div className="trust-item">
              <div className="trust-icon">✓</div>
              <span>IPC / BNS 2023</span>
            </div>
            <div className="trust-item">
              <div className="trust-icon">✓</div>
              <span>CrPC / BNSS 2023</span>
            </div>
            <div className="trust-item">
              <div className="trust-icon">✓</div>
              <span>eCourts Compatible</span>
            </div>
            <div className="trust-item">
              <div className="trust-icon">✓</div>
              <span>24 High Courts Covered</span>
            </div>
          </div>
        </div>

        <div className="doc-visual">
          <div className="court-seal">
            <div className="court-seal-inner">Supreme<br />Court<br />of India</div>
          </div>

          <div className="doc-card scan-wrap">
            <div className="scan-line"></div>
            <div className="doc-topbar">
              <div className="doc-topbar-left">
                <div className="doc-filename">Bail Application — CrPC § 437.pdf</div>
                <div className="doc-meta">CNR: DLHC-01-000234-2025 · Sessions Court, Delhi</div>
              </div>
              <div className="status-badge status-analyzing">Analyzing</div>
            </div>
            <div className="doc-content" style={{ position: "relative" }}>
              <div className="doc-watermark">CONFIDENTIAL</div>

              <div className="section-label">Bail Grounds</div>
              <div className="clause-block">
                <div className="clause-title">Ground I — Parity of Co-Accused</div>
                <div className="clause-text">The applicant herein is similarly placed as co-accused Ramesh Verma who was granted regular bail by this Hon&apos;ble Court vide order dated 12.03.2025 in Bail Application No. 445/2025...</div>
              </div>

              <div className="doc-rule thick"></div>

              <div className="section-label">Prior Custody Record</div>
              <div className="clause-block">
                <div className="clause-title">Section 437(1) CrPC — Applicability</div>
                <div className="clause-text">The applicant is not accused of an offence punishable with death or imprisonment for life and is therefore entitled to the benefit of the first proviso to Section 437(1) of the Code...</div>
              </div>

              <div className="doc-rule"></div>
              <div className="clause-block">
                <div className="clause-title">Section 167 BNSS — Charge-sheet Status</div>
                <div className="clause-text">The statutory period of 60 days has elapsed without submission of charge-sheet, thereby triggering the indefeasible right of the applicant to default bail...</div>
              </div>
            </div>

            <div className="ai-analysis">
              <div className="ai-header">
                <div className="ai-title">
                  <div className="ai-pulse"></div>
                  NyayaAI Analysis
                </div>
                <div className="score-pill score-medium">Risk: Medium</div>
              </div>
              <div className="findings">
                <div className="finding">
                  <span className="finding-badge f-critical">CRITICAL</span>
                  <p>Default bail right under §167 BNSS is <em>indefeasible</em> — court cannot deny if charge-sheet not filed within 60 days. File immediately.</p>
                </div>
                <div className="finding">
                  <span className="finding-badge f-review">REVIEW</span>
                  <p>Parity argument (Ground I) requires verification — confirm co-accused Ramesh Verma&apos;s bail order date and IPC sections charged.</p>
                </div>
                <div className="finding">
                  <span className="finding-badge f-ok">OK</span>
                  <p>§437(1) first proviso applicability is correctly stated — offence is non-capital and non-life imprisonment.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS TICKER ═══ */}
      <div className="stats-ticker">
        <div className="ticker-inner">
          <div className="ticker-item"><span className="ticker-num">4.7Cr+</span><span className="ticker-label">Pending cases in India</span></div>
          <div className="ticker-divider">·</div>
          <div className="ticker-item"><span className="ticker-num">12s</span><span className="ticker-label">Avg. NyayaAI analysis time</span></div>
          <div className="ticker-divider">·</div>
          <div className="ticker-item"><span className="ticker-num">740+</span><span className="ticker-label">Indian statutes indexed</span></div>
          <div className="ticker-divider">·</div>
          <div className="ticker-item"><span className="ticker-num">24</span><span className="ticker-label">High Courts covered</span></div>
          <div className="ticker-divider">·</div>
          <div className="ticker-item"><span className="ticker-num">98%</span><span className="ticker-label">Clause detection accuracy</span></div>
          <div className="ticker-divider">·</div>
          <div className="ticker-item"><span className="ticker-num">BNS</span><span className="ticker-label">2023 — Fully indexed</span></div>
          <div className="ticker-divider">·</div>
          {/* Repeat for continuous effect */}
          <div className="ticker-item"><span className="ticker-num">4.7Cr+</span><span className="ticker-label">Pending cases in India</span></div>
          <div className="ticker-divider">·</div>
          <div className="ticker-item"><span className="ticker-num">12s</span><span className="ticker-label">Avg. NyayaAI analysis time</span></div>
          <div className="ticker-divider">·</div>
          <div className="ticker-item"><span className="ticker-num">740+</span><span className="ticker-label">Indian statutes indexed</span></div>
          <div className="ticker-divider">·</div>
          <div className="ticker-item"><span className="ticker-num">24</span><span className="ticker-label">High Courts covered</span></div>
          <div className="ticker-divider">·</div>
          <div className="ticker-item"><span className="ticker-num">98%</span><span className="ticker-label">Clause detection accuracy</span></div>
          <div className="ticker-divider">·</div>
          <div className="ticker-item"><span className="ticker-num">BNS</span><span className="ticker-label">2023 — Fully indexed</span></div>
          <div className="ticker-divider">·</div>
        </div>
      </div>

      {/* ═══ DOCUMENT TYPES ═══ */}
      <section className="section doc-types-section" id="docs">
        <div className="eyebrow" data-fade>Document Types Supported</div>
        <h2 className="section-title" data-fade>Every document in the<br />Indian legal system.</h2>
        <p className="section-sub" data-fade>From a first information report filed at a police station to a writ petition before the Supreme Court — NyayaAI reads, interprets, and flags them all.</p>

        <div className="doc-types-grid" data-fade>
          <div className="doc-type">
            <span className="doc-type-icon">📋</span>
            <div className="doc-type-name">FIR</div>
            <div className="doc-type-desc">First Information Report — extracts accused details, sections charged, cognizability analysis.</div>
            <div className="doc-type-acts">
              <span className="act-pill">BNS 2023</span>
              <span className="act-pill">BNSS 2023</span>
            </div>
          </div>
          <div className="doc-type">
            <span className="doc-type-icon">⚖️</span>
            <div className="doc-type-name">Bail Application</div>
            <div className="doc-type-desc">Checks §437/439 CrPC / BNSS eligibility, default bail triggers, parity grounds.</div>
            <div className="doc-type-acts">
              <span className="act-pill">§437 BNSS</span>
              <span className="act-pill">§167</span>
            </div>
          </div>
          <div className="doc-type">
            <span className="doc-type-icon">📜</span>
            <div className="doc-type-name">Legal Notice</div>
            <div className="doc-type-desc">Validates cause of action, limitation period, proper service under CPC.</div>
            <div className="doc-type-acts">
              <span className="act-pill">CPC</span>
              <span className="act-pill">Limitation Act</span>
            </div>
          </div>
          <div className="doc-type">
            <span className="doc-type-icon">🏛️</span>
            <div className="doc-type-name">Writ Petition</div>
            <div className="doc-type-desc">Article 32/226 — identifies fundamental rights violation, locus standi, maintainability.</div>
            <div className="doc-type-acts">
              <span className="act-pill">Art. 32</span>
              <span className="act-pill">Art. 226</span>
            </div>
          </div>
          <div className="doc-type">
            <span className="doc-type-icon">🤝</span>
            <div className="doc-type-name">Contract</div>
            <div className="doc-type-desc">Full clause analysis under Indian Contract Act — liability caps, termination, force majeure.</div>
            <div className="doc-type-acts">
              <span className="act-pill">ICA 1872</span>
              <span className="act-pill">SOGA</span>
            </div>
          </div>
          <div className="doc-type">
            <span className="doc-type-icon">📝</span>
            <div className="doc-type-name">Vakalatnama</div>
            <div className="doc-type-desc">Validates scope of authority, court name, stamp duty compliance.</div>
            <div className="doc-type-acts">
              <span className="act-pill">CPC O.III</span>
              <span className="act-pill">Stamp Act</span>
            </div>
          </div>
          <div className="doc-type">
            <span className="doc-type-icon">📊</span>
            <div className="doc-type-name">Affidavit</div>
            <div className="doc-type-desc">Checks verification clause, notarisation, admissibility under Evidence Act.</div>
            <div className="doc-type-acts">
              <span className="act-pill">Evidence Act</span>
              <span className="act-pill">CPC O.XIX</span>
            </div>
          </div>
          <div className="doc-type">
            <span className="doc-type-icon">🏠</span>
            <div className="doc-type-name">Rent Agreement</div>
            <div className="doc-type-desc">State-specific rent control compliance, registration under Transfer of Property Act.</div>
            <div className="doc-type-acts">
              <span className="act-pill">TPA 1882</span>
              <span className="act-pill">Rent Control</span>
            </div>
          </div>
          <div className="doc-type">
            <span className="doc-type-icon">⚡</span>
            <div className="doc-type-name">PIL</div>
            <div className="doc-type-desc">Public Interest Litigation — locus standi, public cause identification, prayer analysis.</div>
            <div className="doc-type-acts">
              <span className="act-pill">Art. 32</span>
              <span className="act-pill">Art. 226</span>
            </div>
          </div>
          <div className="doc-type">
            <span className="doc-type-icon">💼</span>
            <div className="doc-type-name">Charge Sheet</div>
            <div className="doc-type-desc">Sections framed, cognizability, schedule offences, evidence summary analysis.</div>
            <div className="doc-type-acts">
              <span className="act-pill">BNSS 2023</span>
              <span className="act-pill">BNS 2023</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="section" id="how">
        <div className="eyebrow" data-fade>Process</div>
        <h2 className="section-title" data-fade>From upload to<br />legal brief in four steps.</h2>

        <div className="how-grid" data-fade>
          <div className="how-step">
            <div className="step-connector">→</div>
            <div className="step-number">01</div>
            <h3>Upload your document</h3>
            <p>Drop any PDF, DOCX, or image of a legal document. We extract text even from scanned court copies using OCR.</p>
          </div>
          <div className="how-step">
            <div className="step-connector">→</div>
            <div className="step-number">02</div>
            <h3>AI identifies document type</h3>
            <p>NyayaAI auto-detects whether it&apos;s an FIR, contract, petition, or affidavit — and loads the relevant Indian statutory framework.</p>
          </div>
          <div className="how-step">
            <div className="step-connector">→</div>
            <div className="step-number">03</div>
            <h3>Clause-by-clause analysis</h3>
            <p>Every paragraph is mapped to the relevant section of BNS, BNSS, ICA, CPC, or the Constitution. Conflicts and violations are flagged instantly.</p>
          </div>
          <div className="how-step">
            <div className="step-number">04</div>
            <h3>Get your brief + chat</h3>
            <p>Download a structured PDF brief. Then ask follow-up questions in plain Hindi or English — cited to exact clauses.</p>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES OVERVIEW ═══ */}
      <section id="features" className="section" style={{ paddingBottom: "2rem" }}>
        <div className="eyebrow" data-fade style={{ textAlign: "center" }}>Platform Capabilities</div>
        <h2 className="section-title" data-fade style={{ textAlign: "center", marginBottom: "3rem" }}>Everything you need<br />to win your case.</h2>
        
        <div className="how-grid" data-fade style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
          <div className="how-step p-8 bg-[#0B162E]/50 rounded-2xl border border-[#152142] hover:border-[#E87213]/50 transition-colors">
            <h3 className="text-[#F5EDD8] text-xl mb-3 font-serif">Deep Liability Extraction</h3>
            <p className="text-[#7A7E96] leading-relaxed text-sm">Instantly parses massive PDFs and DOCX files. Automatically flags legally risky clauses based on BNS, BNSS, and CPC codes.</p>
          </div>
          <div className="how-step p-8 bg-[#0B162E]/50 rounded-2xl border border-[#152142] hover:border-[#E87213]/50 transition-colors">
            <h3 className="text-[#F5EDD8] text-xl mb-3 font-serif">Conversational LPU Chat</h3>
            <p className="text-[#7A7E96] leading-relaxed text-sm">Stop rereading files. Ask our AI direct questions about any uploaded document in Hindi or English to get instant, cited answers.</p>
          </div>
          <div className="how-step p-8 bg-[#152142]/40 rounded-2xl border border-[#E87213]/50 relative overflow-hidden shadow-[0_0_20px_rgba(232,114,19,0.05)]">
             <div className="absolute top-0 right-0 bg-gradient-to-l from-[#E87213] to-[#D0610A] text-white text-[0.65rem] tracking-wider font-bold px-4 py-1.5 rounded-bl-xl shadow-lg">JUST ADDED</div>
            <h3 className="text-[#E87213] text-xl mb-3 font-serif">Autonomous AI Drafter</h3>
            <p className="text-[#C8BDA4] leading-relaxed text-sm">Type the facts of your case and let our specialized LLM auto-generate structured, court-ready Bail Applications and Legal Notices.</p>
          </div>
          <div className="how-step p-8 bg-[#0B162E]/50 rounded-2xl border border-[#152142] hover:border-[#E87213]/50 transition-colors">
            <h3 className="text-[#F5EDD8] text-xl mb-3 font-serif">eCourts Architecture</h3>
            <p className="text-[#7A7E96] leading-relaxed text-sm">Optimized for all 24 Indian High Courts and the Supreme Court with complete BNS 2023 index coverage mapped seamlessly.</p>
          </div>
        </div>
      </section>

      {/* ═══ CHAT DEMO ═══ */}
      <div className="section demo-section" style={{ paddingTop: 0 }}>
        <div className="demo-grid">
          <div className="demo-copy">
            <div className="eyebrow" data-fade>AI Document Chat</div>
            <h2 className="section-title" data-fade style={{ fontSize: "2.5rem" }}>Ask in Hindi.<br />Get answers in seconds.</h2>
            <p style={{ color: "var(--cream2)", lineHeight: 1.8, marginTop: "1rem", fontSize: ".92rem" }} data-fade>
              Stop searching through 60 pages of a writ petition. Type your question and NyayaAI locates the relevant paragraph, explains it in plain language, and flags anything legally risky — all cited to Indian law.
            </p>
            <div className="suggestion-chips" data-fade>
              <span className="chip">&quot;Default bail ka right kab milta hai?&quot;</span>
              <span className="chip">&quot;Section 437 vs 439 difference?&quot;</span>
              <span className="chip">&quot;Limitation period expired hai kya?&quot;</span>
              <span className="chip">&quot;Fundamental rights violation hai?&quot;</span>
            </div>
          </div>

          <div className="chat-window" data-fade>
            <div className="chat-bar">
              <div className="chat-bar-dot" style={{ background: "var(--jade)" }}></div>
              <div className="chat-bar-dot" style={{ background: "var(--warn)", width: "8px", height: "8px", borderRadius: "50%" }}></div>
              <div className="chat-bar-dot" style={{ background: "var(--faint)", width: "8px", height: "8px", borderRadius: "50%" }}></div>
              <span className="chat-bar-title" style={{ marginLeft: ".5rem" }}>Bail_Application_2025.pdf — NyayaAI Chat</span>
            </div>
            <div className="chat-body">
              <div className="msg">
                <div className="avatar u">RM</div>
                <div className="bubble">Default bail ka right kab trigger hota hai is case mein?</div>
              </div>
              <div className="msg">
                <div className="avatar a">न्या</div>
                <div className="bubble ai">
                  Is application mein <em>Section 167(2) BNSS 2023</em> ke under default bail ka right already triggered ho chuka hai.<br /><br />
                  Reason: Charge-sheet 60 days ke andar file nahi hui — aapke document ki Para 3 ke mutabiq arrest date 14 Jan 2025 thi, aur 60 din expire ho chuke hain.<br /><br />
                  Yeh right <em>indefeasible</em> hai — Supreme Court ne <em>Rakesh Kumar Paul v. State of Assam</em> mein confirm kiya hai ki court ise deny nahi kar sakti.<span className="cursor"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ DRAFTER DEMO ═══ */}
      <div className="section demo-section" style={{ background: "linear-gradient(to bottom, transparent, rgba(21, 33, 66, 0.2), transparent)", paddingTop: "2rem" }}>
        <div className="demo-grid" style={{ gridTemplateColumns: "1fr", textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
          <div className="demo-copy">
            <div className="eyebrow" data-fade>Autonomous AI Drafting</div>
            <h2 className="section-title" data-fade style={{ fontSize: "2.5rem" }}>Type the facts.<br />Generate the document.</h2>
            <p style={{ color: "var(--cream2)", lineHeight: 1.8, marginTop: "1rem", fontSize: ".92rem", maxWidth: "600px", margin: "1rem auto 0 auto" }} data-fade>
              Don't just analyze legal documents—create them. Provide NyayaAI with the basic facts of your case, the involved parties, and target jurisdiction. Our AI will instantly stream a fully-formatted, court-ready Bail Application, Legal Notice, or Petition cited appropriately under Indian Law.
            </p>
            <div className="mt-10" data-fade>
               <div className="doc-card" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "left", padding: "1.5rem" }}>
                 <div className="status-badge" style={{ display: "inline-block", marginBottom: "1rem", background: "rgba(232, 114, 19, 0.1)", color: "#E87213" }}>AI Streaming...</div>
                 <div className="clause-title uppercase tracking-widest text-[#7A7E96] text-[0.65rem] mb-4 text-center pb-2 border-b border-[#2A3454]">In the Hon'ble High Court of Delhi at New Delhi</div>
                 <div className="clause-title font-serif text-[#F5EDD8] font-semibold text-center mb-6">Bail Application No. _____ of 2026</div>
                 <div className="clause-text leading-loose text-sm text-[#C8BDA4]"><strong>MAY IT PLEASE YOUR LORDSHIP:</strong><br/><br/>1. That the applicant is a law-abiding citizen with deep roots in society, falsely implicated in FIR No. 45/2026 registered at PS Hauz Khas under sections 378/379 of the Bharatiya Nyaya Sanhita, 2023. <br/><br/>2. That it is respectfully submitted that the ingredients of the alleged offence are squarely not made out from a bare perusal of the FIR...</div>
                 <div className="mt-4 pt-4 border-t border-[#152142] text-center">
                    <span className="text-[#E87213] text-sm animate-pulse font-medium">Drafting continues...</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ CTA ═══ */}
      <section className="cta-section">
        <div className="cta-bg-glow"></div>
        <h2>4.7 crore cases pending.<br /><em>Your client&apos;s</em> shouldn&apos;t wait.</h2>
        <p>Upload your first document free. No credit card. No setup. Just instant legal clarity — in Hindi or English.</p>
        <Link href="/register" className="btn-saffron" style={{ fontSize: ".9rem", padding: ".95rem 2.8rem" }}>Analyze a document free →</Link>
        <p className="cta-legal-note">By signing up you agree to our Terms · Documents are never used for AI training · Encrypted at rest</p>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer>
        <div className="footer-brand">
          <div className="footer-brand-name"><em>Nyaya</em>AI</div>
          <p className="footer-tagline">AI-powered legal intelligence built specifically for the Indian judiciary — from district courts to the Supreme Court.</p>
          <div className="footer-constitution">&quot;Equal Justice Under Law&quot; — Preamble, Constitution of India</div>
        </div>

        <div>
          <div className="footer-col-title">Product</div>
          <ul className="footer-links">
            <li><Link href="/login">Document Analysis</Link></li>
            <li><Link href="/login">AI Legal Chat</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
          </ul>
        </div>

        <div>
          <div className="footer-col-title">Legal Coverage</div>
          <ul className="footer-links">
            <li><a href="#">BNS / BNSS 2023</a></li>
            <li><a href="#">IPC / CrPC</a></li>
            <li><a href="#">Constitution</a></li>
            <li><a href="#">All 24 High Courts</a></li>
          </ul>
        </div>

        <div>
          <div className="footer-col-title">Company</div>
          <ul className="footer-links">
            <li><a href="#">About</a></li>
            <li><a href="#">GitHub</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© 2026 NyayaAI · Built by Ritwik Anand Mishra · KIIT School of Law, Bhubaneswar</p>
          <p className="footer-copy">Made in India 🇮🇳 · न्याय · Justice</p>
        </div>
      </footer>
    </div>
  );
}
