interface Props {
  text?: string;
  loading?: boolean;
}

export default function ActualIntent({
  text,
  loading
}: Props) {

  if (loading) {
    return (
      <div className="border border-neutral-200 border-l-4 border-l-neutral-300 rounded-r-xl px-5 py-4 mb-4 animate-pulse">
        <div className="w-48 h-3 bg-neutral-100 rounded mb-2" />
        <div className="w-full h-4 bg-neutral-100 rounded" />
        <div className="w-3/4 h-4 bg-neutral-100 rounded mt-1" />
      </div>
    );
  }

  if (!text) return null;

  return (
    <div className="bg-background border border-foreground border-l-4 border-l-foreground rounded-r-xl px-4 sm:px-5 py-4 mb-4">

      <p className="font-['Inter'] text-[0.78rem] font-bold tracking-widest uppercase mb-1">
        What they actually want
      </p>

      <p className="font-['Inter'] text-sm leading-relaxed">
        {text}
      </p>

    </div>
  );
}
