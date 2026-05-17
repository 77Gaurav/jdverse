import { ResultData } from "@/app/types/result";

interface Props {
  result?: ResultData;
  loading?: boolean;
}

export default function VerdictCard({
  result,
  loading
}: Props) {

  if (loading || !result) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 border-2 border-neutral-200 rounded-lg px-3 py-2 mb-2 animate-pulse">
        <div className="flex items-center gap-2 mx-auto sm:mx-2">
          <div className="w-16 h-10 bg-neutral-100 rounded" />
          <div className="w-8 h-4 bg-neutral-100 rounded" />
        </div>
        <div className="sm:mx-4 flex-1 space-y-2 w-full">
          <div className="w-16 h-5 bg-neutral-100 rounded mx-auto sm:mx-0" />
          <div className="w-full h-4 bg-neutral-100 rounded" />
          <div className="w-48 h-4 bg-neutral-100 rounded" />
        </div>
      </div>
    );
  }

  const scoreColor =
    result.verdict_score >= 7
      ? "#16a34a"
      : result.verdict_score >= 4
      ? "#ca8a04"
      : "#dc2626";

  const scoreLabel =
    result.verdict_score >= 7
      ? "Worth applying"
      : result.verdict_score >= 4
      ? "Apply cautiously"
      : "Skip this one";

  return (
    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 border-2 rounded-lg px-3 py-2 mb-2'>

      <div className="text-center flex justify-center items-center gap-2 max-w-xl mx-auto sm:mx-2">
        <div
          className="text-3xl font-bold"
          style={{ color: scoreColor }}
        >
          {result.verdict_score}
        </div>

        <div className="text-lg mt-2">/ 10</div>
      </div>

      <div className="mt-2 sm:mt-0 sm:mx-4">
        <p className="font-bold text-lg font-['Inter'] text-center leading-relaxed mb-3">
          Verdict
        </p>

        <p>{result.verdict_short}</p>

        <span className="italic">
          Suggestion : {scoreLabel}
        </span>
      </div>
    </div>
  );
}
