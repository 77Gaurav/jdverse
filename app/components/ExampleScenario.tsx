'use client';
import { useEffect, useState } from 'react';
import { ResultData } from '@/app/types/result';
import VerdictCard from '@/app/components/result/VerdictCard';
import ActualIntent from '@/app/components/result/ActualIntent';
import MustHaveCard from '@/app/components/result/MustHaveCard';
import NiceToHaveCard from '@/app/components/result/NiceToHaveCard';
import SkillMatchCard from '@/app/components/result/SkillMatchCard';
import RedFlagsCard from '@/app/components/result/RedFlagsCard';

const GOOD_SKILLS = [
  'Python', 'Java', 'JavaScript', 'TypeScript', 'C++',
  'Data Structures', 'Algorithms', 'OOP',
  'React', 'Tailwind CSS', 'Node.js',
  'Firebase', 'GCP', 'Git', 'Docker', 'Linux',
];

const GOOD_RESULT: ResultData = {
  verdict_score: 8,
  verdict_short: 'Strong match for this internship — core skills align well with requirements.',
  what_they_actually_want:
    'They want a CS student with strong fundamentals in data structures, algorithms, and OOP who can write clean code in Java, C++, or Python. Bonus points for React/TypeScript web experience and exposure to cloud or database platforms.',
  must_haves: [
    'Java', 'C++', 'Python', 'JavaScript', 'TypeScript',
    'Data Structures', 'Algorithms', 'OOP',
  ],
  nice_to_haves: ['React', 'Tailwind CSS', 'Firebase', 'GCP'],
  hidden_flags: [
    { title: 'Vague compensation', detail: 'No stipend or salary mentioned in the description.', severity: 'critical' },
    { title: 'Fake deadline urgency', detail: 'Uses "rolling basis" language that pressures early application.', severity: 'warn' },
  ],
  skill_match_score: 82,
  skill_match_details: [
    { skill: 'Python', matched: true, source: 'must_have', note: 'Explicitly listed as a core language.' },
    { skill: 'Java', matched: true, source: 'must_have', note: 'Listed as a primary programming language.' },
    { skill: 'JavaScript', matched: true, source: 'must_have', note: 'Mentioned as a required language.' },
    { skill: 'TypeScript', matched: true, source: 'must_have', note: 'Listed alongside JavaScript.' },
    { skill: 'C++', matched: true, source: 'must_have', note: 'Explicitly listed as a core language.' },
    { skill: 'Data Structures', matched: true, source: 'must_have', note: 'Core CS fundamental required.' },
    { skill: 'Algorithms', matched: true, source: 'must_have', note: 'Core CS fundamental required.' },
    { skill: 'OOP', matched: true, source: 'must_have', note: 'Listed as a core requirement.' },
    { skill: 'React', matched: true, source: 'nice_to_have', note: 'Mentioned as a preferred modern web framework.' },
    { skill: 'Tailwind CSS', matched: true, source: 'nice_to_have', note: 'Listed under preferred UI stack.' },
    { skill: 'Node.js', matched: false, source: null, note: 'Not explicitly mentioned in the JD.' },
    { skill: 'Firebase', matched: true, source: 'nice_to_have', note: 'Mentioned as a preferred backend platform.' },
    { skill: 'GCP', matched: false, source: null, note: 'Not explicitly called out.' },
    { skill: 'Git', matched: false, source: null, note: 'Not explicitly mentioned in the JD.' },
    { skill: 'Docker', matched: false, source: null, note: 'Not listed in requirements.' },
    { skill: 'Linux', matched: false, source: null, note: 'Not explicitly mentioned.' },
  ],
};

const POOR_SKILLS = ['HTML', 'CSS', 'C', 'Python Basics'];

const POOR_JD =
  'TechStartup is hiring a Full Stack Intern! No stipend for 5 months. Performance based stipend after 5 months. Bring your own laptop. Must know MERN stack, AI/ML, have 3+ years experience, and wear many hats. Fast-paced environment, apply immediately.';

const POOR_RESULT: ResultData = {
  verdict_score: 2,
  verdict_short: 'Poor match — underqualified candidate meets a predatory listing.',
  what_they_actually_want:
    'They want an experienced full stack developer with AI/ML knowledge but refuse to pay for 5 months. This is likely unpaid trial labour disguised as an internship.',
  must_haves: ['MERN Stack', 'AI/ML', '3+ Years Exp'],
  nice_to_haves: ['DevOps', 'Cloud', 'System Design'],
  hidden_flags: [
    { title: 'No stipend', detail: 'No stipend for 5 months — free labour with a promise of future pay.', severity: 'critical' },
    { title: 'Performance based', detail: '"Performance based stipend" is vague and often means no pay at all.', severity: 'critical' },
    { title: 'Bring your own laptop', detail: 'Candidate must provide their own equipment for an unpaid role.', severity: 'critical' },
    { title: 'Overqualified requirements', detail: 'Asks for 3+ years experience and AI/ML knowledge for an internship.', severity: 'warn' },
    { title: 'Scope inflation', detail: '"Wear many hats" signals undefined responsibilities and scope creep.', severity: 'warn' },
    { title: 'Fake urgency', detail: '"Apply immediately" pressures candidates into rushing.', severity: 'warn' },
  ],
  skill_match_score: 12,
  skill_match_details: [
    { skill: 'HTML', matched: true, source: null, note: 'Basic web skill, not explicitly requested.' },
    { skill: 'CSS', matched: true, source: null, note: 'Basic web skill, not explicitly requested.' },
    { skill: 'C', matched: false, source: null, note: 'Not mentioned in the JD at all.' },
    { skill: 'Python Basics', matched: false, source: null, note: 'Advanced Python/AI/ML knowledge is required, not basics.' },
  ],
};

function ResultDialog({
  label,
  skills,
  result,
  theme,
  onClose,
}: {
  label: string;
  skills: string[];
  result: ResultData;
  theme: string;
  onClose: () => void;
}) {
  const t = theme === 'dark';

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-[95vw] sm:w-[85vw] h-[90vh] sm:h-[85vh] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-content ${t ? '[&::-webkit-scrollbar-thumb]:bg-neutral-700 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600' : '[&::-webkit-scrollbar-thumb]:bg-neutral-300 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400'} ${t ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-neutral-200'} rounded-2xl shadow-xl border p-4 sm:p-6 z-10`}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${label === 'Good Match' ? 'bg-green-500' : 'bg-red-500'}`} />
            <h3 className={`text-lg font-semibold ${t ? 'text-white' : 'text-neutral-800'}`}>{label}</h3>
          </div>
          <button
            onClick={onClose}
            className={`text-sm font-bold px-3 py-1.5 rounded-lg ${t ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-600' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600 border-neutral-300'} transition-all cursor-pointer border shadow-sm`}
          >
            ESC
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className={`text-xs font-mono tracking-widest uppercase mb-2 ${t ? 'text-neutral-500' : 'text-neutral-400'}`}>
              Skills selected ({skills.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                    t ? 'bg-blue-900/20 text-blue-300 border-blue-800' : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className={`text-xs font-mono tracking-widest uppercase mb-2 ${t ? 'text-neutral-500' : 'text-neutral-400'}`}>
              JD used
            </p>
            <p className={`text-xs sm:text-sm leading-relaxed ${t ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {label === 'Good Match'
                ? 'Google is hiring Software Engineering Interns. Looking for engineers with strong CS fundamentals, experience in Java, C++, Python, JavaScript, or TypeScript, and familiarity with modern web frameworks like React...'
                : POOR_JD}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <VerdictCard result={result} loading={false} />
            </div>
            <div className="flex-1">
              <ActualIntent text={result.what_they_actually_want} loading={false} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MustHaveCard items={result.must_haves} loading={false} />
            <NiceToHaveCard items={result.nice_to_haves} loading={false} />
            <SkillMatchCard result={result} loading={false} />
            <RedFlagsCard flags={result.hidden_flags} theme={theme as 'dark' | 'light'} loading={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewCard({
  label,
  accent,
  score,
  skillCount,
  description,
  onClick,
  theme,
}: {
  label: string;
  accent: string;
  score: number;
  skillCount: number;
  description: string;
  onClick: () => void;
  theme: string;
}) {
  const t = theme === 'dark';

  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-0 text-left p-4 sm:p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
        t
          ? 'border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 hover:border-neutral-500'
          : 'border-neutral-200 bg-neutral-50 hover:bg-white hover:border-neutral-300'
      } hover:shadow-md active:scale-[0.98]`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-2 h-2 rounded-full shrink-0 ${accent}`} />
        <span className={`font-semibold text-sm sm:text-base ${t ? 'text-white' : 'text-neutral-900'}`}>{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className={`text-2xl font-bold ${accent === 'bg-green-500' ? 'text-green-600' : 'text-red-600'}`}>{score}</span>
        <span className={`text-xs ${t ? 'text-neutral-500' : 'text-neutral-400'}`}>/ 10</span>
      </div>
      <p className={`text-xs leading-relaxed mb-2 ${t ? 'text-neutral-400' : 'text-neutral-500'}`}>{description}</p>
      <span className={`text-xs font-medium ${t ? 'text-neutral-500' : 'text-neutral-400'}`}>
        {skillCount} skills &middot; Click to expand
      </span>
    </button>
  );
}

interface Props {
  theme: 'dark' | 'light';
}

export default function ExampleScenario({ theme }: Props) {
  const [dialog, setDialog] = useState<'good' | 'poor' | null>(null);
  const t = theme === 'dark';

  return (
    <div className="mt-8">
      <div className={`border-t pt-6 ${t ? 'border-neutral-700' : 'border-neutral-200'}`}>
        <p className={`text-xs font-mono tracking-widest uppercase mb-3 ${t ? 'text-neutral-500' : 'text-neutral-400'}`}>
          Example Analysis
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <PreviewCard
            label="Good Match"
            accent="bg-green-500"
            score={GOOD_RESULT.verdict_score}
            skillCount={GOOD_SKILLS.length}
            description={GOOD_RESULT.verdict_short}
            onClick={() => setDialog('good')}
            theme={theme}
          />
          <PreviewCard
            label="Poor Match"
            accent="bg-red-500"
            score={POOR_RESULT.verdict_score}
            skillCount={POOR_SKILLS.length}
            description={POOR_RESULT.verdict_short}
            onClick={() => setDialog('poor')}
            theme={theme}
          />
        </div>
      </div>

      {dialog === 'good' && (
        <ResultDialog
          label="Good Match"
          skills={GOOD_SKILLS}
          result={GOOD_RESULT}
          theme={theme}
          onClose={() => setDialog(null)}
        />
      )}

      {dialog === 'poor' && (
        <ResultDialog
          label="Poor Match"
          skills={POOR_SKILLS}
          result={POOR_RESULT}
          theme={theme}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}
