import { HiddenFlag } from "@/app/types/result";

export function mergeFlags(
  aiFlags: HiddenFlag[],
  localFlags: any[]
): HiddenFlag[] {

  const aiTitles = aiFlags.map(
    f => f.title.toLowerCase()
  );

  const extraFlags = localFlags
    .filter(
      f =>
        !aiTitles.some(t =>
          t.includes(
            f.label.toLowerCase().split(" ")[0]
          )
        )
    )
    .map(f => ({
      title: f.label,
      detail: "Pattern detected in JD text.",
      severity: f.severity,
    }));

  return [...aiFlags, ...extraFlags].slice(0, 5);
}