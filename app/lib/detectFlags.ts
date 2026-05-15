import { FLAG_RULES } from "@/app/constants/flagRules";

export function detectFlags(text: string) {
  const lower = text.toLowerCase();

  return FLAG_RULES.filter(rule =>
    rule.patterns.some(p => lower.includes(p))
  );
}