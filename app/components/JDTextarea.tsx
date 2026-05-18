import { RefObject, useState, useEffect } from "react";

interface Props {
  jd: string;
  setjd: (value: string) => void;
  charCount: number;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  theme: "dark" | "light";
}

export default function JDTextarea({
  jd,
  setjd,
  charCount,
  textareaRef,
  theme,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const t = theme === 'dark';
  const scrollbarClasses =
    `[&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-neutral-400 [&::-webkit-scrollbar-thumb]:to-neutral-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-content hover:[&::-webkit-scrollbar-thumb]:from-neutral-500 hover:[&::-webkit-scrollbar-thumb]:to-neutral-400 ${t ? '[&::-webkit-scrollbar-thumb]:from-neutral-600 [&::-webkit-scrollbar-thumb]:to-neutral-700 hover:[&::-webkit-scrollbar-thumb]:from-neutral-500 hover:[&::-webkit-scrollbar-thumb]:to-neutral-600' : ''}`;

  return (
    <div className="input flex justify-center mt-5 relative max-w-full overflow-x-hidden">
      <textarea
        className={`w-full border-3 ${t ? 'border-neutral-700 shadow-black/40 hover:border-neutral-600 hover:bg-neutral-800/50 placeholder:text-neutral-500 shadow-[0_8px_30px_rgb(0,0,0,0.35)]' : 'border-neutral-200/80 shadow-black/5 hover:bg-neutral-50 placeholder:text-neutral-400'} shadow-lg h-40 sm:h-50 p-4 sm:p-5 rounded-xl text-sm sm:text-base font-['Inter'] overflow-y-auto resize-none transition-colors duration-2000 ${scrollbarClasses}`}
        placeholder="Paste the full job description here : Hiring for FullStack Engineer who understands React, NextJS ..."
        onChange={(e) => setjd(e.target.value)}
        ref={textareaRef}
        value={jd}
      />

      <button
        onClick={() => setExpanded(true)}
        className={`absolute top-2 right-5 w-7 h-7 flex items-center justify-center rounded-lg ${t ? 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700'} transition-all cursor-pointer`}
        title="Expand"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />
          <path d="M11 13l9 -9" />
          <path d="M15 4h5v5" />
        </svg>
      </button>

      <div className="absolute bottom-2 flex justify-end gap-3 right-10 ">
        <div
          className={`text-sm sm:text-base font-['Inter'] ml-4 ${charCount < 50 ? "text-red-500" : "text-green-500"}`}
        >
          {charCount < 50 ? "Needs more text" : "Ready"}
        </div>

        <div className={t ? 'text-white' : 'text-neutral-400'}>
          {charCount} chars
        </div>
      </div>

      {/* ── Modal ── */}
      {expanded && (
        <>
          <div className={`fixed inset-0 ${t ? 'bg-black/30' : 'bg-black/5'} backdrop-blur-sm z-40`} onClick={() => setExpanded(false)} />
          <div className={`fixed inset-0 m-auto w-[90vw] sm:w-[60vw] h-[85vh] max-w-full overflow-x-hidden ${t ? 'bg-neutral-900/90 border-neutral-700/80 shadow-black/40' : 'bg-white/95 border-neutral-200/80 shadow-black/10'} backdrop-blur-2xl rounded-2xl shadow-2xl border p-5 z-50 popIn font-['Inter']`}>
            <div className={`flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b ${t ? 'border-neutral-700' : 'border-neutral-200'}`}>
              <h3 className={`text-lg font-semibold ${t ? 'text-white' : 'text-neutral-800'} tracking-wide`}>Job Description</h3>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${t ? 'bg-neutral-800' : 'bg-neutral-100'} ${charCount < 50 ? 'text-red-500' : 'text-green-600'}`}>{charCount} chars</span>
                <button onClick={() => setExpanded(false)} className={`text-sm font-bold px-3 py-1.5 rounded-lg ${t ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border-neutral-600' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-800 border-neutral-300'} transition-all cursor-pointer border shadow-sm`}>ESC</button>
              </div>
            </div>
            <textarea
              className={`w-full h-[calc(100%-60px)] p-4 rounded-xl text-sm font-['Inter'] overflow-y-auto resize-none border ${t ? 'border-neutral-700 bg-neutral-800 text-neutral-100 placeholder:text-neutral-500' : 'border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400'} ${scrollbarClasses}`}
              placeholder="Paste the full job description here ..."
              onChange={(e) => setjd(e.target.value)}
              value={jd}
              autoFocus
            />
          </div>
          <style>{`
            @keyframes popIn {
              0% { opacity: 0; transform: scale(0.85); }
              100% { opacity: 1; transform: scale(1); }
            }
            .popIn {
              animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>
        </>
      )}
    </div>
  );
}
