import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Keyboard } from 'swiper/modules';
import Card from './Card';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/mousewheel';

interface SimpleSliderProps {
  items: any[];
}

export default function SimpleSlider({ items }: Readonly<SimpleSliderProps>) {
  return (
    <div className="relative">
      <Swiper
        modules={[Mousewheel, Keyboard]}
        spaceBetween={32}
        slidesPerView="auto"
        mousewheel
        keyboard
        className="!overflow-visible"
        wrapperClass="!items-stretch"
      >
        {Array.isArray(items) && items.map((item) => (
          <SwiperSlide key={item.id} className="!w-auto">
            <Card {...item} isSlider={true} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
