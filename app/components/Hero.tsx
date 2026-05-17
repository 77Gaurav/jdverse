
export default function Hero() {
  return (
    <div className="hero">
      <div className="banner font-['Inter'] my-5 text-lg sm:text-xl lg:text-2xl">
        Decode your Job Description
      </div>

      <div className="title">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight font-['Inter']">
          What does this JD
          <span className="font-['Inter'] italic "> actually </span>
          want?
        </h2>
      </div>

      <p className="w-full sm:w-[70%] lg:w-120 my-6 sm:my-8 lg:my-10 text-base sm:text-lg font-['Inter']">
        Paste any job description. Get the real skills required, the filler you can ignore, and the red flags they buried in corporate speak.
      </p>
    </div>
  );
}
