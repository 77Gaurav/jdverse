export const FLAG_RULES = [
  { id: "unpaid", label: "Unpaid / No stipend", severity: "critical", patterns: ["no stipend", "unpaid", "not stipend", "certificate only", "placement support", "hands-on experience"] },
  { id: "scope_creep", label: "Scope inflation", severity: "warn", patterns: ["other duties as assigned", "and more", "as needed", "various tasks"] },
  { id: "fake_urgency", label: "Fake deadline urgency", severity: "warn", patterns: ["apply immediately", "urgent", "asap", "rolling basis", "apply by", "today"] },
  { id: "overspec", label: "Overqualified requirements", severity: "warn", patterns: ["3+ years", "5+ years", "senior", "lead", "architect"] },
  { id: "vague_comp", label: "Vague compensation", severity: "critical", patterns: ["competitive", "based on performance", "as per industry", "market rate", "negotiable"] },
  { id: "vague_duration", label: "Vague duration", severity: "warn", patterns: ["flexible", "tbd", "as needed", "depending on", "3-6 months"] },
  { id: "toxic_culture", label: "Culture red flags", severity: "warn", patterns: ["fast-paced", "wear many hats", "self-starter", "hustle", "rockstar", "ninja", "10x"] },
  { id: "ghosting", label: "Likely to ghost", severity: "warn", patterns: ["only shortlisted", "will be contacted", "due to volume"] },
];