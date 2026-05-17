import {FaArrowRightLong} from 'react-icons/fa6';

interface Props {
    loadSample : ()=> void;
}

export default function JdToolbar({loadSample}:Props){
  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="text-sm sm:text-base font-['Inter']">
          JOB DESCRIPTION
        </div>
        <button
          className="load flex items-center gap-2 cursor-pointer text-sm sm:text-base font-['Inter']"
          onClick={loadSample}
        >
          Load <FaArrowRightLong />
        </button>
      </div>
  )
}
