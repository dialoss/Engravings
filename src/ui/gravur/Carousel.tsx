//@ts-nocheck
import React from 'react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "./Carousel.scss";
const Slides = ({items, element}) => {
    return (
        <div>
            <Swiper
                spaceBetween={0}
                slidesPerView={3}
                pagination={{
                    dynamicBullets: true,
                }}
                modules={[Pagination, Navigation]}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
            >
                {
                    items && items.map((img,i) =>
                        <SwiperSlide key={i}>
                            {React.createElement(element, {data: img})}
                        </SwiperSlide>)
                }
            </Swiper>
        </div>
    );
};

export default Slides;