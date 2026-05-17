'use client';
import { useState, useEffect } from 'react';
import SkillSelection from "@/app/components/skills/SkillSelection"
import allSkills from "@/app/constants/allSkills"

interface Props{
    selected : string[];
    setSelected : React.Dispatch<React.SetStateAction<string[]>>;
}

export default function SkillCategoryTabs({selected,setSelected}:Props){
  const [loading, setLoading] = useState(true);
  const categories:string[] = ["programming","frontend","backend","database","cloud","tools"];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const removeSkill = (label: string) => {
    setSelected(selected.filter(s => s !== label));
  };

  return (
    <div className="w-full">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">What are your skills?</h2>
            <p className="text-sm text-gray-500 mt-1">Select the skills you have experience with. We&apos;ll help match you to the right opportunities.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-50 border border-green-200 shrink-0">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full bg-green-500 rounded-full opacity-75 animate-ping" />
            <span className="relative inline-flex w-2 h-2 bg-green-500 rounded-full" />
          </span>
          <span className="text-sm font-medium text-green-700">{selected.length} skills selected</span>
        </div>
      </div>

      {/* ── Category Cards (Bento Grid) ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-neutral-200 bg-white p-4 pb-10 animate-pulse">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 mb-3" />
                <div className="h-4 w-24 bg-neutral-100 rounded mb-3" />
                <div className="flex gap-1.5">
                  <div className="h-5 w-14 bg-neutral-100 rounded-md" />
                  <div className="h-5 w-16 bg-neutral-100 rounded-md" />
                </div>
                <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-neutral-100" />
              </div>
            ))
          : categories.map((category) => (
              <SkillSelection key={category} skill={category} selected={selected} setSelected={setSelected} />
            ))
        }
      </div>

      {/* ── Selected Skills ── */}
      {selected.length > 0 && (
        <div className="my-6 p-5 rounded-xl border border-gray-200 bg-white/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Your Selected Skills</h3>
            <button
              onClick={() => setSelected([])}
              className="group inline-flex items-center border rounded-full px-3 py-1.5 gap-1.5 text-sm cursor-pointer font-medium text-red-500 border-red-200  hover:text-red-700 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selected.map((label) => {
              const skill = allSkills.find(s => s.label === label);
              return (
                <div
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm"
                >
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  <button
                    onClick={() => removeSkill(label)}
                    className="w-4 h-4 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    aria-label={`Remove ${label}`}
                  >
                    <svg className="w-2.5 h-2.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  )
}
