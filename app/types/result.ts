export type Severity = 'critical' | 'warn';

export interface HiddenFlag {
  title: string;
  detail: string;
  severity: Severity;
}

export interface ResultData {
  verdict_score: number;
  verdict_short: string;
  what_they_actually_want?: string;
  must_haves: string[];
  nice_to_haves: string[];
  hidden_flags: HiddenFlag[];
}