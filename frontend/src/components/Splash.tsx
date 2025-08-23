function Splash({ fadeOut }: { fadeOut: boolean }) {
  return (
    <div
      className={`splash fixed  bg-[#0385c2] inset-0  w-full h-full flex items-center z-50 transition-opacity duration-700  ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full h-full flex flex-col justify-center items-center relative">
        <img src="/images/logo.png" alt="Logo" className="w-72" />
        {/* <p className="text-white relative bottom-6">
          Fix your problem with just snap
        </p> */}
      </div>
    </div>
  );
}

export default Splash;
