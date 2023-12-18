//@ts-nocheck
import React, { useEffect } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

const images = [
    {
        url: 'https://drive.google.com/uc?id=1ylvZt3AnfeMEcdxHprYsuPosDxYOjSXV',
        width: 400,
        height: 400,
    },
    // {
    //     url: 'https://drive.google.com/uc?id=1ylvZt3AnfeMEcdxHprYsuPosDxYOjSXV',
    //     width: 400,
    //     height: 400,
    // },
    // {
    //     url: 'https://drive.google.com/uc?id=1ylvZt3AnfeMEcdxHprYsuPosDxYOjSXV',
    //     width: 400,
    //     height: 400,
    // },
]

export default function ImageViewer() {
    useEffect(() => {
        let lightbox = new PhotoSwipeLightbox({
            gallery: '#test',
            children: 'a',
            pswpModule: () => import('photoswipe'),
        });
        lightbox.init();

        return () => {
            lightbox.destroy();
            lightbox = null;
        };
    }, []);

    return (
        <div>
        <div className="pswp-gallery" id={'test'} >
            {images.map((image, index) => (
                <a
                    href={image.url}
                    data-pswp-width={image.width}
                    data-pswp-height={image.height}
                    key={'test-' + index}
                    target="_blank"
                    rel="noreferrer"
                >
                    <img src={image.url} alt="" />
                </a>
            ))}
        </div>
        </div>
    );
}
