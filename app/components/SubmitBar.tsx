import { FaArrowRightLong } from "react-icons/fa6";

interface Props {
  charCount: number;
  loading: boolean;
  onSubmit: () => void;
  theme?: "dark" | "light";
}

export default function SubmitBar({
  charCount,
  loading,
  onSubmit,
  theme = "light"
}: Props) {
  return (
    <div className="submit-action mt-5 flex items-center justify-end flex-wrap gap-3">

      <button
        className={`group px-4 py-2 border rounded-full cursor-pointer text-sm sm:text-base shadow-md transition-all duration-500 ease-out hover:scale-[1.03] active:scale-95 active:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md disabled:active:scale-100 ${theme === "dark" ? "border-neutral-600 bg-neutral-800 text-neutral-100 hover:bg-neutral-700 hover:border-neutral-500 disabled:bg-neutral-800 disabled:border-neutral-700" : "border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 hover:border-neutral-400 disabled:bg-neutral-50 disabled:border-neutral-200"}`}
        onClick={onSubmit}
        disabled={loading || charCount < 50}
      >
        {loading ? (
          <span className="animate-pulse">Analysing...</span>
        ) : (
          <div className='flex justify-center items-center gap-2 sm:gap-4'>
            <span className="font-['Inter'] font-medium">
              Run Reality check
            </span>

            <FaArrowRightLong className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        )}
      </button>
    </div>
  );
}