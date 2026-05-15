import { FaArrowRightLong } from "react-icons/fa6";

interface Props {
  charCount: number;
  loading: boolean;
  onSubmit: () => void;
}

export default function SubmitBar({
  charCount,
  loading,
  onSubmit
}: Props) {
  return (
    <div className="submit-action mt-5 flex items-center justify-between flex-wrap gap-3">

      <div className={`text-sm sm:text-base font-['Syne'] ml-4 ${charCount < 50 ? "text-red-500" : "text-green-500"}`}>
        {charCount < 50
          ? "Needs more text"
          : `Ready · ${charCount} chars`}
      </div>

      <button
        className='px-4 py-2 border rounded-full cursor-pointer text-sm sm:text-base shadow-md'
        onClick={onSubmit}
        disabled={loading || charCount < 50}
      >
        {loading ? (
          <span>Analysing...</span>
        ) : (
          <div className='flex justify-center items-center gap-2 sm:gap-4'>
            <span className="font-['Inter'] font-medium">
              Run Reality check
            </span>

            <FaArrowRightLong />
          </div>
        )}
      </button>
    </div>
  );
}