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
  textareaRef,
}: Props) {
  return (
    <div className="input flex justify-center mt-5 relative">
      <textarea
        className="w-full border h-40 sm:h-50 p-4 sm:p-5 rounded-xl text-sm sm:text-base font-['Inter']"
        placeholder="Paste the full job description here : Hiring for FullStack Engineer who understands React, NextJS ..."
        onChange={(e) => setjd(e.target.value)}
        ref={textareaRef}
        value={jd}
      />

      <div className="absolute bottom-2 flex justify-end gap-3 right-10 ">
        <div
          className={`text-sm sm:text-base font-['Inter'] ml-4 ${charCount < 50 ? "text-red-500" : "text-green-500"}`}
        >
          {charCount < 50 ? "Needs more text" : `Ready`}
        </div>

        <div className="text-neutral-400 dark:text-white">
          {charCount} chars
        </div>
      </div>
    </div>
  );
}
