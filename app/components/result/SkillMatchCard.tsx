import { ResultData } from "@/app/types/result";
import { FaCheck, FaXmark } from "react-icons/fa6";

interface Props {
  result?: ResultData;
  loading?: boolean;
}

function scoreColor(score: number | null | undefined): string {
  if (score === null || score === undefined) return "text-neutral-400";
  if (score >= 70) return "text-green-600";
  if (score >= 40) return "text-yellow-600";
  return "text-red-600";
}

function scoreRingColor(score: number | null | undefined): string {
  if (score === null || score === undefined) return "border-neutral-300";
  if (score >= 70) return "border-green-600";
  if (score >= 40) return "border-yellow-600";
  return "border-red-600";
}

function sourceLabel(source: string): string {
  switch (source) {
    case "must_have": return "must-have";
    case "nice_to_have": return "nice-to-have";
    case "mentioned": return "mentioned in JD";
    default: return "";
  }
}

export default function SkillMatchCard({ result, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-background border border-[#e5e2da] rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-[11px] font-mono tracking-widest uppercase">
              Skill Match
            </span>
          </div>
          <span className="text-[11px] text-[#aaa] font-mono">—</span>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-neutral-100" />
            <div className="flex-1 space-y-1">
              <div className="w-full h-3 bg-neutral-100 rounded" />
              <div className="w-3/4 h-3 bg-neutral-100 rounded" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-neutral-100 rounded" />
              <div className="w-24 h-3 bg-neutral-100 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-neutral-100 rounded" />
              <div className="w-20 h-3 bg-neutral-100 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-neutral-100 rounded" />
              <div className="w-28 h-3 bg-neutral-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const { skill_match_score, skill_match_details } = result;

  if (!skill_match_details || skill_match_details.length === 0) {
    return (
      <div className="bg-background border border-[#e5e2da] rounded-2xl p-5">
        <div className="flex items-center gap-1.5 mb-4">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-[11px] font-mono tracking-widest uppercase">
            Skill Match
          </span>
        </div>
        <p className="text-xs text-neutral-400 font-['Inter']">
          No skills selected for matching.
        </p>
      </div>
    );
  }

  const matchedCount = skill_match_details.filter(d => d.matched).length;
  const totalCount = skill_match_details.length;

  return (
    <div className="bg-background border border-[#e5e2da] rounded-2xl p-5">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-[11px] font-mono tracking-widest uppercase">
            Skill Match
          </span>
        </div>
        <span className="text-[11px] text-[#aaa] font-mono">
          {String(matchedCount).padStart(2, "0")}/{String(totalCount).padStart(2, "0")}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold font-['Inter'] ${scoreRingColor(skill_match_score)} ${scoreColor(skill_match_score)}`}
        >
          {skill_match_score !== null && skill_match_score !== undefined ? `${skill_match_score}%` : "—"}
        </div>
        <div className="text-xs text-neutral-500 font-['Inter'] leading-relaxed">
          {skill_match_score !== null && skill_match_score !== undefined
            ? `${matchedCount} of ${totalCount} selected skills found in the JD.`
            : `${matchedCount} of ${totalCount} selected skills found in the JD.`}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {skill_match_details.map((d, i) => (
          <div
            key={d.skill + i}
            className="flex items-center gap-2 text-xs font-['Inter']"
          >
            {d.matched ? (
              <FaCheck className="text-green-600 shrink-0" size={10} />
            ) : (
              <FaXmark className="text-red-500 shrink-0" size={12} />
            )}
            <span
              className={
                d.matched
                  ? "text-foreground font-medium"
                  : "text-neutral-400"
              }
            >
              {d.skill}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
