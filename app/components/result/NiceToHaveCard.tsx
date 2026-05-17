interface Props {
  items?: string[];
  loading?: boolean;
}

export default function NiceToHaveCard({
  items,
  loading
}: Props) {

  return (
    <div className="bg-background border border-[#e5e2da] rounded-2xl p-5">

      <div className="flex justify-between items-center mb-4">

        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-500" />

          <span className="text-[11px] font-mono tracking-widest uppercase">
            Nice-to-haves
          </span>
        </div>

        <span className="text-[11px] text-[#aaa] font-mono">
          {loading ? "—" : String(items?.length || 0).padStart(2, "0")}
        </span>
      </div>

      {loading ? (
        <div className="flex flex-wrap gap-1.5 animate-pulse">
          <div className="w-20 h-6 bg-neutral-100 rounded-full" />
          <div className="w-16 h-6 bg-neutral-100 rounded-full" />
          <div className="w-24 h-6 bg-neutral-100 rounded-full" />
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {(items || []).map((item, index) => (
            <span
              key={index}
              className="text-xs px-2.5 py-1 bg-blue-50 text-blue-800 rounded-full font-['Inter'] font-medium border-2 border-blue-700"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
