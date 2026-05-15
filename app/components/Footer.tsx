import {FaArrowLeftLong} from 'react-icons/fa6';
interface Props{
    reset: () =>void;
    theme: 'dark' | 'light';
}
export default function Footer({reset,theme}:Props){
  return (

        <div className="navback mt-5 flex items-center justify-between flex-wrap gap-3">
        <button onClick={reset} className="border rounded-full px-4 py-2 cursor-pointer text-sm sm:text-base flex justify-center items-center gap-4">
                    <FaArrowLeftLong /> Check another JD
        </button>
        
        <p className={`text-xs sm:text-sm ${theme==='dark'?'text-neutral-200' :'text-neutral-600'}`}>No Account Logins required</p>
    </div>
  )
}
