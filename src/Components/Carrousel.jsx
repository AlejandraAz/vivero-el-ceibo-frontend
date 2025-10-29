import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade,Navigation, Autoplay } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import floresBanner from '../assets/ImgsCarrousel/floresBanner.png';
import suculentas from "../assets/ImgsCarrousel/suculentas.png";
import violetas from "../assets/ImgsCarrousel/violetas.png";
import vivero from "../assets/ImgsCarrousel/vivero.png";
const images = [
  {src:floresBanner,text:'15% de descuento en efectivo'},
  {src:violetas,text:'entrega a domicilio'},
  {src:vivero,text:'Vení a visitarnos'},
  {src:suculentas,text:'novedades'}
];

const Carrousel= () => {
  return (
    <Swiper
    modules={[EffectFade,Navigation, Autoplay]}
      effect="fade"
      loop={true}
      autoplay={{
    delay: 3000, 
    disableOnInteraction: false,
  }}

      spaceBetween={50}
      slidesPerView={1}
      navigation
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    > 
      {images.map(({ src, text }, index) => (
  <SwiperSlide key={index}>
    <div className="relative w-full h-screen">
      <img
        src={src}
        alt={`Slide ${index + 1}`}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gray  bg-opacity-10 flex items-center justify-center">
        <h2 className="text-white text-2xl md:text-4xl lg:text-7xl uppercase font-bold font-['Roboto_Condensed'] text-center px-4">
          {text}
        </h2>
      </div>
    </div>
  </SwiperSlide>
))}

    </Swiper>
  );
};
export default Carrousel