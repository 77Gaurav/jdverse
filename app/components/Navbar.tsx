import { LuMoon, LuSun } from "react-icons/lu";

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export default function Navbar({
  theme,
  toggleTheme
}: NavbarProps) {
  return (
    <>
      <nav className='mt-5 flex items-center justify-between'>
        <h1 className="font-['Inter'] font-bold text-2xl sm:text-3xl lg:text-4xl">
          JDverse
        </h1>

        <button
          onClick={toggleTheme}
          className='p-2 cursor-pointer rounded-full border border-foreground'
        >
          {theme === 'dark'
            ? <LuMoon />
            : <LuSun />
          }
        </button>
      </nav>

      <div className="w-full h-px bg-foreground my-5"></div>
    </>
  );
}