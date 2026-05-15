import { HiddenFlag } from "@/app/types/result";

interface Props {
  flags: HiddenFlag[];
  theme: 'dark' | 'light';
}

export default function RedFlagsCard({
  flags,
  theme
}: Props) {

  return (
    <div className="bg-background border border-red-200 rounded-2xl p-5 sm:col-span-2 lg:col-span-1">

      <div className="flex justify-between items-center mb-4">

        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-600" />

          <span className="text-[11px] font-mono tracking-widest uppercase">
            Red flags
          </span>
        </div>

        <span className="text-[11px] text-[#aaa] font-mono">
          {String(flags?.length || 0).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-col gap-2.5 font-['Inter']">

        {(flags || []).map((flag, index) => (

          <div
            key={index}
            className={
              index < flags.length - 1
                ? "border-b border-red-50 pb-2.5"
                : ""
            }
          >

            <p
              className={`text-[13px] font-semibold mb-0.5 ${
                flag.severity === "critical"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {flag.title}
            </p>

            <p
              className={`text-xs ${
                theme === "dark"
                  ? "text-neutral-200"
                  : "text-neutral-600"
              } font-medium leading-relaxed`}
            >
              {flag.detail}
            </p>

          </div>
        ))}

        {(!flags || flags.length === 0) && (
          <p className="text-[13px] text-green-600 font-['Inter']">
            No obvious red flags found.
          </p>
        )}

      </div>

    </div>
  );
}