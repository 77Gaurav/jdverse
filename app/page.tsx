"use client";

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
import SkillMatchCard from "@/app/components/result/SkillMatchCard";

import SkillCategoryTabs from "@/app/components/skills/SkillCategoryTabs";

import { SAMPLE_JD } from "@/app/constants/sampleJD";

import { detectFlags } from "@/app/lib/detectFlags";
import { mergeFlags } from "@/app/lib/mergeFlags";

import { ResultData } from "@/app/types/result";

export default function Home() {
  const [jd, setjd] = useState("");
  const [phase, setPhase] = useState("input");
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("light");

  const [selected, setSelected] = useState<string[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = jd.length;

  async function runCheck() {
    setPhase("result");
    setLoading(true);

    const localFlags = detectFlags(jd);

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jd, selectedSkills: selected }),
    });

    const parsed = await response.json();

    parsed.hidden_flags = mergeFlags(parsed.hidden_flags, localFlags);

    setResult(parsed);
    setLoading(false);
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
    <div className="font-['Inter'] bg-background text-foreground min-h-screen">
      <div className="w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-4">
        <Navbar
          theme={theme}
          toggleTheme={() =>
            setTheme((prev) => (prev === "dark" ? "light" : "dark"))
          }
        />

        {phase === "input" && (
          <>
            <Hero />

            <SkillCategoryTabs selected={selected} setSelected={setSelected} theme={theme} />

            <JDToolbar
              loadSample={() => {
                setjd(SAMPLE_JD);
              }}
            />

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

            <div className="w-full h-10"></div>
          </>
        )}

        {phase === "result" && (
          <>
            <VerdictCard result={result || undefined} loading={loading} />

            <ActualIntent
              text={result?.what_they_actually_want}
              loading={loading}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MustHaveCard items={result?.must_haves} loading={loading} />

              <NiceToHaveCard items={result?.nice_to_haves} loading={loading} />

              <SkillMatchCard result={result || undefined} loading={loading} />

              <RedFlagsCard
                flags={result?.hidden_flags}
                theme={theme}
                loading={loading}
              />
            </div>
            <Footer reset={reset} theme={theme} />
            <div className="w-full h-5"></div>
          </>
        )}
      </div>
    </div>
  );
}
