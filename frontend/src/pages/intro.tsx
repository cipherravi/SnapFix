import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";

function Intro() {
  const navigate = useNavigate();

  const imagesPath = [
    "/images/problem.png",
    "/images/plumber.png",
    "/images/fix.png",
  ];

  return (
    <div className="w-full min-h-screen flex flex-col gap-5 bg-[#0385c2]">
      {/* Swiper */}
      <div className="w-full h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] rounded-b-4xl overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="w-full h-full"
        >
          {imagesPath.map((src, index) => (
            <SwiperSlide key={index}>
              <img
                src={src}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover md:object-contain object-center bg-[#0385c2]"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Text & Button */}
      <div className="w-full flex flex-col justify-center items-center gap-7 px-4 sm:px-6 md:px-10">
        <div className="w-full max-w-xl text-center">
          <p className="text-2xl sm:text-3xl md:text-4xl inter-bold text-white">
            Welcome to the Snap World
          </p>
          <p className="text-white inter-light mt-2 sm:mt-3">
            Here you can fix your issues as easily as a snap
          </p>
        </div>

        <button
          className="bg-white w-10/12 sm:w-64 h-14 rounded-xl cursor-pointer select-none transform transition ease-in-out duration-300 hover:scale-95 active:scale-90"
          onClick={() => navigate("/login")}
        >
          <p className="text-xl sm:text-2xl inter-bold">Continue</p>
        </button>
      </div>
    </div>
  );
}

export default Intro;
