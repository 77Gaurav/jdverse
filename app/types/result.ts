export type Severity = 'critical' | 'warn';

export interface HiddenFlag {
  title: string;
  detail: string;
  severity: Severity;
}

export interface AiSkillMatchDetail {
  skill: string;
  matched: boolean;
  source: "must_have" | "nice_to_have" | "mentioned" | null;
  note?: string;
}

export interface ResultData {
  verdict_score: number;
  verdict_short: string;
  what_they_actually_want?: string;
  must_haves: string[];
  nice_to_haves: string[];
  hidden_flags: HiddenFlag[];
  skill_match_score?: number;
  skill_match_details?: AiSkillMatchDetail[];
}