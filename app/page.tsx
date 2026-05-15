'use client';

import { useEffect, useRef, useState } from "react";

import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import JDTextarea from "@/app/components/JDTextarea";
import JDToolbar from "@/app/components/JDToolbar";
import SubmitBar from "@/app/components/SubmitBar";
import Footer from "@/app/components/Footer";

import VerdictCard from "@/app/components/result/VerdictCard";
import MustHaveCard from "@/app/components/result/MustHaveCard";
import NiceToHaveCard from "@/app/components/result/NiceToHaveCard";
import RedFlagsCard from "@/app/components/result/RedFlagsCard";
import ActualIntent from "@/app/components/result/ActualIntent";

import { SAMPLE_JD } from "@/app/constants/sampleJD";

import { detectFlags } from "@/app/lib/detectFlags";
import { mergeFlags } from "@/app/lib/mergeFlags";

import { ResultData } from "@/app/types/result";

export default function Home() {

  const [jd, setjd] = useState("");
  const [phase, setPhase] = useState("input");
  const [result, setResult] =
    useState<ResultData | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [theme, setTheme] =
    useState<'dark' | 'light'>('light');

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const charCount = jd.length;

  async function runCheck() {

    const localFlags = detectFlags(jd);

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ jd }),
    });

    const parsed = await response.json();

    parsed.hidden_flags = mergeFlags(
      parsed.hidden_flags,
      localFlags
    );

    setResult(parsed);
    setPhase("result");
  }

  function reset() {
    setjd("");
    setResult(null);
    setPhase("input");
  }

  useEffect(() => {

    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

  }, [theme]);

  return (
    <div className="font-['Syne'] bg-background text-foreground min-h-screen">

      <div className='w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto font-syne px-4'>

        <Navbar
          theme={theme}
          toggleTheme={() =>
            setTheme(prev =>
              prev === "dark"
                ? "light"
                : "dark"
            )
          }
        />

        {phase === "input" && (
          <>
            <Hero />

            <JDToolbar loadSample={()=>{setjd(SAMPLE_JD)}}/>


            <JDTextarea
              jd={jd}
              setjd={setjd}
              charCount={charCount}
              textareaRef={textareaRef}
            />

            <SubmitBar
              charCount={charCount}
              loading={loading}
              onSubmit={runCheck}
            />
          </>
        )}

        {phase === "result" && result && (
          <>
            <VerdictCard result={result} />

            <ActualIntent
              text={result.what_they_actually_want}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

              <MustHaveCard
                items={result.must_haves}
              />

              <NiceToHaveCard
                items={result.nice_to_haves}
              />

              <RedFlagsCard
                flags={result.hidden_flags}
                theme={theme}
              />

            </div>
            <Footer reset={reset} theme={theme}/>
          </>
        )}
      </div>
    </div>
  );
}