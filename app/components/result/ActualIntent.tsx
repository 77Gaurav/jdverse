interface Props {
  text?: string;
}

export default function ActualIntent({
  text
}: Props) {

  if (!text) return null;

  return (
    <div className="bg-background border border-foreground border-l-4 border-l-foreground rounded-r-xl px-4 sm:px-5 py-4 mb-4">

      <p className="font-['Syne'] text-[0.78rem] font-bold tracking-widest uppercase mb-1">
        What they actually want
      </p>

      <p className="font-['Syne'] text-sm leading-relaxed">
        {text}
      </p>

    </div>
  );
}