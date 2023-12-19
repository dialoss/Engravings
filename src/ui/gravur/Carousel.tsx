//@ts-nocheck
import React from 'react';
import {Navigation, Pagination, Scrollbar, A11y, Mousewheel} from 'swiper/modules';
import SwiperCore from "swiper/core";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "./Carousel.scss";

SwiperCore.use([Mousewheel]);

const Slides = ({items, element, reversed=false}) => {
    return (
        <div className={'carousel'}>
            <Swiper
                autoplay={{
                    delay: 0,
                    disableOnInteraction: true,
                    reverseDirection: true,
                }}
                spaceBetween={0}
                slidesPerView={3}
                pagination={{
                    dynamicBullets: true,
                }}
                mousewheel
                modules={[Pagination, Navigation]}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
            >
                {
                    items && items.map((img,i) =>
                        <SwiperSlide key={img.id}>
                            {React.createElement(element, {data: img})}
                        </SwiperSlide>)
                }
            </Swiper>
        </div>
    );
};

export default Slides;