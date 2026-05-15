'use client';
import { useState, useEffect, useRef } from 'react';
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { LuMoon } from "react-icons/lu";
import { LuSun } from "react-icons/lu";

// Adding interfaces
type Severity = 'critical' | 'warn'; // USed to show redflags

interface HiddenFlag{
  title:string;
  detail : string;
  severity : Severity;
}

interface ResultData {
  verdict_score : number;
  verdict_short : string;
  what_they_actually_want?: string;
  must_haves : string[];
  nice_to_haves : string[];
  hidden_flags:HiddenFlag[];

}


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

Apply by: 2 days from now. Only shortlisted candidates will be contacted.
`;

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

function detectFlags(text: string) {
  const lower = text.toLowerCase();
  return FLAG_RULES.filter(rule => rule.patterns.some(p => lower.includes(p)));
}

export default function Home() {
  const [jd, setjd] = useState<string>("");
  const charCount = jd.length;
  const [phase, setPhase] = useState<string>('input');
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [theme,setTheme] = useState<'dark' | 'light'> (()=>{
    if(typeof window === 'undefined') return 'light';
    return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const loadSample = () => {
    setjd(SAMPLE_JD);
  };

  async function runCheck(): Promise<ResultData | void> {
    if (!jd.trim() || jd.trim().length < 50) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const localFlags = detectFlags(jd);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze JD");
      }

      const parsed = await response.json();

      const aiFlags = parsed.hidden_flags || [];
      const aiTitles = aiFlags.map((f: HiddenFlag) => f.title.toLowerCase());
      const extraFlags = localFlags
        .filter(f => !aiTitles.some((t: string) => t.includes(f.label.toLowerCase().split(" ")[0])))
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

  function reset(): void {
    setjd('');
    setResult(null);
    setPhase('input');
    setError(null);
    setTimeout(() => (textareaRef.current)?.focus(), 100);
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

  useEffect(() => {
  const root = document.documentElement;

  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  
  localStorage.setItem('theme',theme);

  }, [theme]);

  return (
    <div className="font-['Syne'] bg-background text-foreground min-h-screen">
      <div className='w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto font-syne px-4'>
        <nav className='mt-5 flex items-center justify-between'>
          <h1 className="font-['Inter'] font-bold text-2xl sm:text-3xl lg:text-4xl">JDverse</h1>
          <div>
            <button onClick={()=>{setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));}} className='p-2 cursor-pointer rounded-full border border-foreground'>
              {theme === 'dark' ? (<LuMoon />):(<LuSun />)}
            </button>
          </div>
        </nav>
        <div className="w-full h-px bg-foreground my-5"></div>

        {phase === 'input' && (
          <>
            <div className="hero">
              <div className="banner font-['Syne'] my-5 text-lg sm:text-xl lg:text-2xl">Decode your Job Description</div>
              <div className="title">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight font-['Syne']">
                  What does this JD <span className="font-['Inter'] italic">actually</span> want?
                </h2>
              </div>
              <p className="w-full sm:w-[70%] lg:w-120 my-6 sm:my-8 lg:my-10 text-base sm:text-lg font-[Syne]" >
                Paste any job description. Get the real skills required, the filler you can ignore, and the red flags they buried in corporate speak.
              </p>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-sm sm:text-base font-['Syne']">JOB DESCRIPTION</div>
              <button className="load flex items-center gap-2 cursor-pointer text-sm sm:text-base font-['Syne']" onClick={loadSample}>
                Load <FaArrowRightLong />
              </button>
            </div>

            <div className="input flex justify-center mt-5 relative">
              <textarea
                className="w-full border h-40 sm:h-50 p-4 sm:p-5 rounded-xl text-sm sm:text-base font-['Syne']"
                placeholder="Paste the full job description here: Hiring for Frontend Engineer who understands NextJS and React..."
                onChange={(e) => { setjd(e.target.value) }}
                ref={textareaRef}
                value={jd}
              />
              <div className="absolute bottom-2 sm:bottom-1 right-4 sm:right-10 text-xs sm:text-sm text-neutral-400">
                {charCount} chars
              </div>
            </div>

            {error && <p className='text-red-500 text-base sm:text-xl my-2'>{error}</p>}

            <div className="submit-action mt-5 flex items-center justify-between flex-wrap gap-3">
              <div className="text-sm sm:text-base font-['Syne']">{charCount < 50 ? "Needs more text" : `Ready · ${charCount} chars`}</div>
              <button
                className='px-4 py-2 border rounded-full cursor-pointer text-sm sm:text-base shadow-md'
                onClick={runCheck}
                disabled={loading || jd.trim().length < 50}
              >
                {loading ? (
                  <span className="w-5 h-3 border border-neutral-300 rounded-lg mx-auto font-['Inter']">Analysing...</span>
                ) : (
                  <div className='flex justify-center items-center gap-2 sm:gap-4'>
                    <span className="font-['Inter'] font-medium">Run Reality check</span> <FaArrowRightLong />
                  </div>
                )}
              </button>
            </div>
          </>
        )}

        {phase === 'result' && result && (
          <div ref={resultRef}>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 border-2 rounded-lg px-3 py-2 mb-2'>
              <div className="text-center max-w-xl mx-auto sm:mx-2">
                <div className="text-2xl font-bold" style={{ color: scoreColor }}>
                  {result.verdict_score}
                </div>
                <div className="text-sm mt-2">/10</div>
              </div>
              <div className="mt-2 sm:mt-0 sm:mx-4">
                <p className="font-bold text-lg font-['Inter'] text-center leading-relaxed mb-3">Verdict</p>
                <p className="font-['Syne']">{result.verdict_short}</p>
                <span className={`font-['Syne'] italic ${
                  result.verdict_score < 5 ? 'text-red-500' :
                  result.verdict_score < 8 ? 'text-green-400' :
                  'text-green-700'
                }`}>Suggestion : " {scoreLabel} "</span>
              </div>
            </div>

            {result.what_they_actually_want && (
              <div className=" bg-background border border-foreground border-l-4 border-l-foreground rounded-r-xl px-4 sm:px-5 py-4 mb-4">
                <p className="font['Syne'] text-[0.78rem] font-bold tracking-widest uppercase mb-1">What they actually want</p>
                <p className="font['Syne'] text-sm leading-relaxed">{result.what_they_actually_want}</p>
              </div>
            )}

            {/* Three-column result grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

              {/* Must-haves */}
              <div className="bg-background border border-[#e5e2da] rounded-2xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-600" />
                    <span className="text-[11px] font-mono tracking-widest uppercase">Must-haves</span>
                  </div>
                  <span className="text-[11px] text-[#aaa] font-mono">{String(result.must_haves?.length || 0).padStart(2, "0")}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(result.must_haves || []).map((s: string, i: number) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-green-50 text-green-800 rounded-full font-['Inter'] font-medium border-2 border-green-700">{s}</span>
                  ))}
                </div>
              </div>

              {/* Nice-to-haves */}
              <div className="bg-background border border-[#e5e2da] rounded-2xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[11px] font-mono tracking-widest uppercase">Nice-to-haves</span>
                  </div>
                  <span className="text-[11px] text-[#aaa] font-mono">{String(result.nice_to_haves?.length || 0).padStart(2, "0")}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(result.nice_to_haves || []).map((s: string, i: number) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-blue-50 text-blue-800 rounded-full font-['Inter'] font-medium border-2 border-blue-700">{s}</span>
                  ))}
                </div>
              </div>

              {/* Red flags */}
              <div className="bg-background border border-red-200 rounded-2xl p-5 sm:col-span-2 lg:col-span-1">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-600" />
                    <span className="text-[11px] font-mono tracking-widest uppercase">Red flags</span>
                  </div>
                  <span className="text-[11px] text-[#aaa] font-mono">{String(result.hidden_flags?.length || 0).padStart(2, "0")}</span>
                </div>
                <div className="flex flex-col gap-2.5 font-['Inter']">
                  {(result.hidden_flags || []).map((f: HiddenFlag, i: number) => (
                    <div key={i} className={i < result.hidden_flags.length - 1 ? "border-b border-red-50 pb-2.5" : ""}>
                      <p className={`text-[13px] font-semibold mb-0.5 ${f.severity === "critical" ? "text-red-600" : "text-yellow-600"}`}>{f.title}</p>
                      <p className={`text-xs ${theme==='dark'?'text-neutral-200' :'text-neutral-600'} font-medium leading-relaxed`}>{f.detail}</p>
                    </div>
                  ))}
                  {(!result.hidden_flags || result.hidden_flags.length === 0) && (
                    <p className="text-[13px] text-green-600 font-['Inter']">No obvious red flags found.</p>
                  )}
                </div>
              </div>

            </div>

            <div className="navback mt-5 flex items-center justify-between flex-wrap gap-3">
              <button onClick={reset} className="border rounded-full px-4 py-2 cursor-pointer text-sm sm:text-base flex justify-center items-center gap-4">
                <FaArrowLeftLong /> Check another JD
              </button>
              <p className={`text-xs sm:text-sm ${theme==='dark'?'text-neutral-200' :'text-neutral-600'}`}>No Account Logins required</p>
            </div>
          <div className="w-full h-5"></div>
          </div>
        )}

      </div>
      
    </div>
  );
}