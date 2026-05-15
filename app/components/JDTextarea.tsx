import { RefObject } from "react";

interface Props {
  jd: string;
  setjd: (value: string) => void;
  charCount: number;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
}

export default function JDTextarea({
  jd,
  setjd,
  charCount,
  textareaRef
}: Props) {
  return (
    <div className="input flex justify-center mt-5 relative">
      <textarea
        className="w-full border h-40 sm:h-50 p-4 sm:p-5 rounded-xl text-sm sm:text-base font-['Syne']"
        placeholder="Paste the full job description here : Hiring for FullStack Engineer who understands React, NextJS ..."
        onChange={(e) => setjd(e.target.value)}
        ref={textareaRef}
        value={jd}
      />

      <div className="absolute bottom-2 sm:bottom-1 right-4 sm:right-10 text-xs sm:text-sm text-neutral-400">
        {charCount} chars
      </div>
    </div>
  );
}