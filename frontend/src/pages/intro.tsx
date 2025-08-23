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
    <div className=" w-full h-full flex flex-col gap-5 bg-[#0385c2] fixed">
      <div className="h-[69%] rounded-b-4xl overflow-hidden">
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
                className="w-full h-full object-cover object-center"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className=" w-full h-1/4 flex flex-col justify-around items-center gap-7">
        <div className=" h-1/2 w-10/12">
          <p className="text-2xl inter-bold text-white">
            Welcome to the Snap World
          </p>
          <p className="text-white inter-light">
            Here you can fix your issues with just as easy as snap
          </p>
        </div>

        <button
          className="bg-white w-10/12 h-14 rounded-xl cursor-pointer select-none  transform transition ease-in-out duration-300 hover:scale-95 active:scale-90"
          onClick={() => navigate("/signup")}
        >
          <p className="text-xl inter-bold">Continue</p>
        </button>
      </div>
    </div>
  );
}

export default Intro;
