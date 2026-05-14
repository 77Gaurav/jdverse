import { useState, useRef, useEffect } from "react";

const SAMPLE_JD = `Frontend Developer Intern (Remote)

We are looking for passionate frontend developers to join our growing team. This is an exciting opportunity to work on cutting-edge products.

Requirements:
- 3+ years experience in React (for a fresher internship)
- Experience with Node.js, GraphQL, Docker, Kubernetes
- Strong knowledge of system design
- Excellent communication skills
- Ability to work in a fast-paced environment
- Must be a team player and self-starter
- Experience with AWS/GCP preferred
- Available to work across time zones

Responsibilities:
- Build and maintain frontend components
- Collaborate with cross-functional teams
- Other duties as assigned

Compensation: Competitive (based on performance)
Duration: Flexible (3-6 months)
Location: Remote (but must attend office when required)

Apply by: 2 days from now. Only shortlisted candidates will be contacted.`;

const FLAG_RULES = [
  { id: "unpaid", label: "Unpaid / No stipend", severity: "critical", patterns: ["no stipend", "unpaid", "not stipend", "certificate only", "placement support", "hands-on experience"] },
  { id: "scope_creep", label: "Scope inflation", severity: "warn", patterns: ["other duties as assigned", "and more", "as needed", "various tasks"] },
  { id: "fake_urgency", label: "Fake deadline urgency", severity: "warn", patterns: ["apply immediately", "urgent", "asap", "rolling basis", "apply by", "today"] },
  { id: "overspec", label: "Overqualified requirements", severity: "warn", patterns: ["3+ years", "5+ years", "senior", "lead", "architect"] },
  { id: "vague_comp", label: "Vague compensation", severity: "critical", patterns: ["competitive", "based on performance", "as per industry", "market rate", "negotiable"] },
  { id: "vague_duration", label: "Vague duration", severity: "warn", patterns: ["flexible", "tbd", "as needed", "depending on", "3-6 months"] },
  { id: "toxic_culture", label: "Culture red flags", severity: "warn", patterns: ["fast-paced", "wear many hats", "self-starter", "hustle", "rockstar", "ninja", "10x"] },
  { id: "ghosting", label: "Likely to ghost", severity: "warn", patterns: ["only shortlisted", "will be contacted", "due to volume"] },
];

function detectFlags(text) {
  const lower = text.toLowerCase();
  return FLAG_RULES.filter(rule => rule.patterns.some(p => lower.includes(p)));
}

export default function JDVerse() {
  const [jd, setJd] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [charCount, setCharCount] = useState(0);

  const [phase, setPhase] = useState("input"); // input | result
  const [streamText, setStreamText] = useState("");
  const textareaRef = useRef(null);
  const resultRef = useRef(null);

  useEffect(() => {
    setCharCount(jd.length);
  }, [jd]);

  function loadSample() {
    setJd(SAMPLE_JD);
  }

  async function runCheck() {
    if (!jd.trim() || jd.trim().length < 50) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setStreamText("");

    const localFlags = detectFlags(jd);

    const prompt = `You are a brutally honest career advisor. Analyze this job description and return ONLY a JSON object with these exact keys:

{
  "must_haves": ["skill1", "skill2", ...],  // actual hard requirements (max 6)
  "nice_to_haves": ["thing1", ...],          // genuinely optional (max 4)
  "hidden_flags": [                           // things the JD doesn't say but implies
    { "title": "Flag Title", "detail": "one sentence plain English explanation", "severity": "critical|warn" }
  ],
  "verdict_short": "8-12 word blunt verdict",
  "verdict_score": 1-10,  // 10 = apply immediately, 1 = run away
  "what_they_actually_want": "2 sentences max. What is the real ask behind the polished language?"
}

Return ONLY the JSON. No markdown, no explanation. Be direct. Flag salary vagueness, overspecification, culture issues.

JD:
${jd}`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const raw = data.content?.map(b => b.text || "").join("") || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      // merge local flag detection with AI flags
      const aiFlags = parsed.hidden_flags || [];
      const aiTitles = aiFlags.map(f => f.title.toLowerCase());
      const extraFlags = localFlags
        .filter(f => !aiTitles.some(t => t.includes(f.label.toLowerCase().split(" ")[0])))
        .map(f => ({ title: f.label, detail: "Pattern detected in JD text.", severity: f.severity }));

      parsed.hidden_flags = [...aiFlags, ...extraFlags].slice(0, 5);
      setResult(parsed);
      setPhase("result");
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) {
      setError("Something went wrong parsing the response. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setJd("");
    setResult(null);
    setPhase("input");
    setError(null);
    setStreamText("");
    setTimeout(() => textareaRef.current?.focus(), 100);
  }

  const scoreColor = result
    ? result.verdict_score >= 7 ? "#16a34a"
    : result.verdict_score >= 4 ? "#ca8a04"
    : "#dc2626"
    : "#888";

  const scoreLabel = result
    ? result.verdict_score >= 7 ? "Worth applying"
    : result.verdict_score >= 4 ? "Apply cautiously"
    : "Skip this one"
    : "";

  return (
    <div style={{ minHeight: "100vh", background: "#f9f8f5", fontFamily: "'Georgia', serif" }}>
      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 2rem", height: "56px",
        background: "#f9f8f5", borderBottom: "1px solid #e5e2da",
        position: "sticky", top: 0, zIndex: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 32, height: 32, background: "#1a1a1a", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "monospace", color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: "-1px"
          }}>JD</div>
          <span style={{ fontFamily: "'Georgia', serif", fontWeight: 600, fontSize: 16, color: "#1a1a1a", letterSpacing: "-0.3px" }}>JD Verse</span>
          <span style={{
            fontSize: 11, color: "#888", background: "#ede9e0",
            padding: "2px 8px", borderRadius: 20, fontFamily: "monospace", letterSpacing: "0.5px"
          }}>REALITY CHECKER</span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {phase === "result" && (
            <button onClick={reset} style={{
              fontSize: 13, color: "#444", background: "transparent", border: "1px solid #d4d0c8",
              borderRadius: 20, padding: "4px 14px", cursor: "pointer", fontFamily: "inherit"
            }}>← New check</button>
          )}
        </div>
      </nav>

      <main style={{ maxWidth: 780, margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>

        {/* Hero */}
        {phase === "input" && (
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={{ fontSize: 12, color: "#888", letterSpacing: "2px", fontFamily: "monospace", marginBottom: "0.75rem", textTransform: "uppercase" }}>Job Description Decoder</p>
            <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 3.5rem)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 1rem", lineHeight: 1.1, letterSpacing: "-2px", fontFamily: "'Georgia', serif" }}>
              What does this<br />JD <em style={{ fontStyle: "italic", color: "#555" }}>actually</em> want?
            </h1>
            <p style={{ fontSize: "1.05rem", color: "#666", maxWidth: 480, lineHeight: 1.7, fontFamily: "system-ui, sans-serif", fontWeight: 400 }}>
              Paste any job description. Get the real skills required, the filler you can ignore, and the red flags they buried in corporate speak.
            </p>
          </div>
        )}

        {/* Input area */}
        {phase === "input" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <label style={{ fontSize: 12, color: "#888", fontFamily: "monospace", letterSpacing: "1px", textTransform: "uppercase" }}>Job Description</label>
              <button onClick={loadSample} style={{
                fontSize: 12, color: "#666", background: "transparent", border: "none",
                cursor: "pointer", fontFamily: "monospace", letterSpacing: "0.5px", textDecoration: "underline"
              }}>load sample →</button>
            </div>
            <div style={{ position: "relative" }}>
              <textarea
                ref={textareaRef}
                value={jd}
                onChange={e => setJd(e.target.value)}
                placeholder="Paste the full job description here — the more text, the better the analysis..."
                style={{
                  width: "100%", minHeight: 260, padding: "1.25rem",
                  fontFamily: "system-ui, sans-serif", fontSize: 14, lineHeight: 1.7, color: "#2a2a2a",
                  background: "#fff", border: "1.5px solid #d4d0c8", borderRadius: 12,
                  resize: "vertical", outline: "none", boxSizing: "border-box",
                  transition: "border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "#1a1a1a"}
                onBlur={e => e.target.style.borderColor = "#d4d0c8"}
              />
              <div style={{
                position: "absolute", bottom: 12, right: 14,
                fontSize: 12, color: charCount > 200 ? "#16a34a" : "#aaa",
                fontFamily: "monospace"
              }}>{charCount} chars</div>
            </div>

            {error && <p style={{ color: "#dc2626", fontSize: 13, marginTop: "0.5rem", fontFamily: "system-ui" }}>{error}</p>}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem" }}>
              <p style={{ fontSize: 12, color: "#aaa", fontFamily: "monospace" }}>
                {charCount < 50 ? "Needs more text" : `Ready · ${charCount} chars`}
              </p>
              <button
                onClick={runCheck}
                disabled={loading || jd.trim().length < 50}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  background: jd.trim().length >= 50 ? "#1a1a1a" : "#ccc",
                  color: "#fff", border: "none", borderRadius: 30,
                  padding: "10px 24px", fontSize: 14, fontWeight: 600,
                  cursor: jd.trim().length >= 50 ? "pointer" : "not-allowed",
                  fontFamily: "system-ui, sans-serif", letterSpacing: "-0.3px",
                  transition: "background 0.2s, transform 0.1s"
                }}
                onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
                onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
              >
                {loading ? (
                  <>
                    <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                    Analyzing...
                  </>
                ) : "Run reality check →"}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {phase === "result" && result && (
          <div ref={resultRef}>
            {/* Score + Verdict */}
            <div style={{
              display: "flex", alignItems: "flex-start", gap: "1.5rem",
              background: "#fff", border: "1.5px solid #e5e2da", borderRadius: 16,
              padding: "1.5rem 2rem", marginBottom: "1.5rem"
            }}>
              <div style={{ textAlign: "center", minWidth: 72 }}>
                <div style={{
                  fontSize: 48, fontWeight: 700, color: scoreColor,
                  lineHeight: 1, fontFamily: "'Georgia', serif", letterSpacing: "-3px"
                }}>{result.verdict_score}</div>
                <div style={{ fontSize: 11, color: "#888", fontFamily: "monospace", letterSpacing: "0.5px", marginTop: 2 }}>/10</div>
              </div>
              <div style={{ borderLeft: "1px solid #e5e2da", paddingLeft: "1.5rem", flex: 1 }}>
                <p style={{ fontSize: 11, color: "#888", fontFamily: "monospace", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 6px" }}>Verdict</p>
                <p style={{ fontSize: "1.15rem", fontWeight: 600, color: "#1a1a1a", margin: "0 0 4px", letterSpacing: "-0.3px", lineHeight: 1.4 }}>
                  {result.verdict_short}
                </p>
                <span style={{
                  fontSize: 12, color: scoreColor,
                  background: result.verdict_score >= 7 ? "#f0fdf4" : result.verdict_score >= 4 ? "#fefce8" : "#fef2f2",
                  padding: "2px 10px", borderRadius: 20, fontFamily: "monospace"
                }}>{scoreLabel}</span>
              </div>
            </div>

            {/* What they actually want */}
            {result.what_they_actually_want && (
              <div style={{
                background: "#faf7f0", border: "1px solid #e8e3d5",
                borderLeft: "3px solid #1a1a1a", borderRadius: "0 12px 12px 0",
                padding: "1rem 1.25rem", marginBottom: "1.5rem"
              }}>
                <p style={{ fontSize: 11, color: "#888", fontFamily: "monospace", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 6px" }}>What they actually want</p>
                <p style={{ fontSize: 14, color: "#333", lineHeight: 1.7, margin: 0, fontFamily: "system-ui, sans-serif" }}>{result.what_they_actually_want}</p>
              </div>
            )}

            {/* Three columns */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>

              {/* Must-haves */}
              <div style={{ background: "#fff", border: "1.5px solid #e5e2da", borderRadius: 14, padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a" }} />
                    <span style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: "1px", textTransform: "uppercase", color: "#444" }}>Must-haves</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#aaa", fontFamily: "monospace" }}>{String(result.must_haves?.length || 0).padStart(2, "0")}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {(result.must_haves || []).map((s, i) => (
                    <span key={i} style={{
                      fontSize: 12, padding: "4px 10px", background: "#f0fdf4",
                      color: "#166534", borderRadius: 20, fontFamily: "monospace", fontWeight: 500
                    }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Nice-to-haves */}
              <div style={{ background: "#fff", border: "1.5px solid #e5e2da", borderRadius: 14, padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6" }} />
                    <span style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: "1px", textTransform: "uppercase", color: "#444" }}>Nice-to-haves</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#aaa", fontFamily: "monospace" }}>{String(result.nice_to_haves?.length || 0).padStart(2, "0")}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {(result.nice_to_haves || []).map((s, i) => (
                    <span key={i} style={{
                      fontSize: 12, padding: "4px 10px", background: "#eff6ff",
                      color: "#1e40af", borderRadius: 20, fontFamily: "monospace"
                    }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Red flags */}
              <div style={{ background: "#fff", border: "1.5px solid #fecaca", borderRadius: 14, padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#dc2626" }} />
                    <span style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: "1px", textTransform: "uppercase", color: "#444" }}>Red flags</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#aaa", fontFamily: "monospace" }}>{String(result.hidden_flags?.length || 0).padStart(2, "0")}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {(result.hidden_flags || []).map((f, i) => (
                    <div key={i} style={{ borderBottom: i < result.hidden_flags.length - 1 ? "1px solid #fef2f2" : "none", paddingBottom: i < result.hidden_flags.length - 1 ? "10px" : 0 }}>
                      <p style={{
                        fontSize: 13, fontWeight: 600, margin: "0 0 3px",
                        color: f.severity === "critical" ? "#dc2626" : "#ca8a04",
                        fontFamily: "system-ui, sans-serif"
                      }}>{f.title}</p>
                      <p style={{ fontSize: 12, color: "#666", margin: 0, lineHeight: 1.5, fontFamily: "system-ui, sans-serif" }}>{f.detail}</p>
                    </div>
                  ))}
                  {(!result.hidden_flags || result.hidden_flags.length === 0) && (
                    <p style={{ fontSize: 13, color: "#16a34a", fontFamily: "system-ui" }}>No obvious red flags found.</p>
                  )}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem" }}>
              <button onClick={reset} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "transparent", border: "1.5px solid #d4d0c8",
                borderRadius: 30, padding: "9px 20px", fontSize: 13, cursor: "pointer",
                fontFamily: "system-ui, sans-serif", color: "#333"
              }}>← Check another JD</button>
              <p style={{ fontSize: 12, color: "#bbb", fontFamily: "monospace" }}>No accounts. Nothing stored.</p>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        textarea::placeholder { color: #bbb; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}