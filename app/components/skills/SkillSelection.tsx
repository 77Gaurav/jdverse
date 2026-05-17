'use client';
import React, {useState, useEffect, useRef} from 'react';
import allSkills,{Skill} from "@/app/constants/allSkills"

interface Props{
    skill: string;
    selected : string[];
    setSelected : React.Dispatch<React.SetStateAction<string[]>>;
    theme : "dark" | "light";
};

const meta: Record<string, { iconBg: string; iconColor: string; activeBorder: string; activeRing: string; activeBg: string; darkIconBg: string; darkIconColor: string }> = {
  programming: { iconBg: "bg-purple-100", iconColor: "text-purple-600", activeBorder: "border-purple-400", activeRing: "ring-purple-100", activeBg: "bg-purple-50/30", darkIconBg: "bg-purple-900/40", darkIconColor: "text-purple-300" },
  frontend:    { iconBg: "bg-blue-100",    iconColor: "text-blue-600",    activeBorder: "border-blue-400",    activeRing: "ring-blue-100",    activeBg: "bg-blue-50/30",    darkIconBg: "bg-blue-900/40",    darkIconColor: "text-blue-300" },
  backend:     { iconBg: "bg-emerald-100", iconColor: "text-emerald-600", activeBorder: "border-emerald-400", activeRing: "ring-emerald-100", activeBg: "bg-emerald-50/30", darkIconBg: "bg-emerald-900/40", darkIconColor: "text-emerald-300" },
  database:    { iconBg: "bg-amber-100",   iconColor: "text-amber-600",   activeBorder: "border-amber-400",   activeRing: "ring-amber-100",   activeBg: "bg-amber-50/30",   darkIconBg: "bg-amber-900/40",   darkIconColor: "text-amber-300" },
  cloud:       { iconBg: "bg-sky-100",     iconColor: "text-sky-600",     activeBorder: "border-sky-400",     activeRing: "ring-sky-100",     activeBg: "bg-sky-50/30",     darkIconBg: "bg-sky-900/40",     darkIconColor: "text-sky-300" },
  tools:       { iconBg: "bg-gray-100",    iconColor: "text-gray-600",    activeBorder: "border-gray-400",    activeRing: "ring-gray-100",    activeBg: "bg-gray-50/30",    darkIconBg: "bg-gray-700",       darkIconColor: "text-gray-300" },
};

function CardIcon({ category, className }: { category: string; className: string }) {
  switch (category) {
    case "programming":
      return (
        <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
      );
    case "frontend":
      return (
        <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      );
    case "backend":
      return (
        <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 18.75z" />
        </svg>
      );
    case "database":
      return (
        <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        </svg>
      );
    case "cloud":
      return (
        <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
        </svg>
      );
    case "tools":
      return (
        <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-4.29 4.29a2.12 2.12 0 01-3-3l4.29-4.29m5.66-5.66l4.29-4.29a2.12 2.12 0 013 3l-4.29 4.29m-2.83 2.83a6 6 0 11-8.49-8.49 6 6 0 018.49 8.49z" />
        </svg>
      );
    default:
      return null;
  }
}

const CategoryIcon = React.memo(CardIcon);

export default function SkillSelection({skill,selected,setSelected,theme}:Props){

  const [open,setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  const filteredSkills = allSkills.filter(
    (item : {category:string})=>item.category === skill
  );
  const selectedInCategory = selected.filter((label: string) =>
    filteredSkills.some((s: Skill) => s.label === label)
  );
  const previewChips = selectedInCategory.slice(0, 3);
  const remaining = selectedInCategory.length - 3;
  const m = meta[skill] || meta.tools;

  const toggleSkill = (label : string) =>{
    if(selected.includes(label)){
      setSelected(selected.filter((e)=>e !== label));
    }
    else{
      setSelected([...selected,label]);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="flex-1 min-w-[180px]" ref={ref}>
      {/* ── Card Trigger ── */}
      <div
        onClick={()=>{setOpen(!open)}}
        className={`relative p-4 pb-10 rounded-xl border cursor-pointer transition-all duration-200 ${
          open
            ? `${m.activeBorder} ${m.activeRing} ring-2 ${m.activeBg} shadow-md`
            : `${theme==='dark' ? 'border-gray-700 bg-neutral-800 hover:border-gray-500' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}`
        }`}
      >
        <div className={`w-10 h-10 rounded-lg ${theme==='dark' ? m.darkIconBg : m.iconBg} flex items-center justify-center mb-3`}>
          <CategoryIcon category={skill} className={theme==='dark' ? m.darkIconColor : m.iconColor} />
        </div>

        <div className="flex items-center justify-between mb-2">
          <h4 className={`text-sm font-semibold ${theme==='dark' ? 'text-white' : 'text-gray-900'} capitalize`}>{skill}</h4>
          <span className={`text-xs ${theme==='dark' ? 'text-gray-500' : 'text-gray-400'}`}>{selectedInCategory.length} selected</span>
        </div>

        <div className="flex items-center gap-1.5 h-6 overflow-hidden">
          {previewChips.map((label: string) => (
            <span key={label} className={`inline-flex px-2 py-0.5 text-xs rounded-md ${theme==='dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} font-medium whitespace-nowrap`}>
              {label}
            </span>
          ))}
          {remaining > 0 && (
            <span className={`inline-flex px-2 py-0.5 text-xs rounded-md ${theme==='dark' ? 'bg-gray-800 text-gray-500' : 'bg-gray-50 text-gray-400'} font-medium whitespace-nowrap shrink-0`}>
              +{remaining}
            </span>
          )}
        </div>

        <div className={`absolute bottom-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
          open ? "bg-purple-100" : `${theme==='dark' ? 'bg-gray-700' : 'bg-gray-100'}`
        }`}>
          <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180 text-purple-600" : `${theme==='dark' ? 'text-gray-500' : 'text-gray-400'}`}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* ── Modal ── */}
      {open && (
        <>
        <div className={`fixed inset-0 ${theme==='dark' ? 'bg-black/30' : 'bg-black/5'} backdrop-blur-sm z-40`} onClick={() => setOpen(false)} />
        <div className={`fixed inset-0 m-auto w-[60vw] max-h-[60vh] overflow-y-auto ${theme==='dark' ? 'bg-gray-900/90 border-gray-700' : 'bg-white/15 border-white/30'} backdrop-blur-2xl rounded-2xl shadow-2xl border p-5 z-50 popIn font-['Inter']`}>
          <div className={`flex justify-between items-center mb-4 pb-3 border-b ${theme==='dark' ? 'border-gray-700' : 'border-white/20'}`}>
            <h3 className={`text-xl font-semibold capitalize ${theme==='dark' ? 'text-white' : 'text-gray-800'} tracking-wide`}>{skill} Skills</h3>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${theme==='dark' ? 'bg-gray-800 text-gray-300' : 'bg-white/40 text-gray-700'}`}>{selectedInCategory.length} selected</span>
              <button onClick={() => setOpen(false)} className={`text-sm font-bold px-3 py-1.5 rounded-lg ${theme==='dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600' : 'bg-neutral-100 hover:bg-white/50 text-gray-600 border-neutral-300'} transition-all cursor-pointer border shadow-sm`}>ESC</button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {filteredSkills.map((item:Skill)=>{
              const isSelected = selected.includes(item.label);
              return(
                <button
                key={item.id}
                onClick={()=>{toggleSkill(item.label)}}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-100 cursor-pointer ${
                  isSelected
                    ? `${theme==='dark' ? 'bg-blue-900/30 text-blue-300 ring-blue-700' : 'bg-white/20 text-blue-700 ring-white/40'} ring-1 shadow-sm`
                    : `${theme==='dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white' : 'bg-white/20 text-gray-700 hover:bg-white/40 hover:text-gray-900'} hover:shadow-sm active:scale-[0.98]`
                }`}
                >
                  {isSelected ? (
                    <svg className={`w-4 h-4 ${theme==='dark' ? 'text-blue-300' : 'text-blue-600'} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="w-4 shrink-0" />
                  )}
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
        <style>{`
          @keyframes popIn {
            0% { opacity: 0; transform: scale(0.85); }
            100% { opacity: 1; transform: scale(1); }
          }
          .popIn {
            animation: popIn 0.8  s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
        </>
      )}
    </div>
  )
}
