//@ts-nocheck
import React, {useEffect, useRef, useState} from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import "./ImageViewer.scss";
declare global {
    interface Window {
        imageViewer: any;
    }
}

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

    const [images, setImages] = useState([]);

    window.imageViewer = (items) => {
        setImages(items);
    }

    const ref = useRef();

    useEffect(() => {
        if (images.length) ref.current.click();
    }, [images]);

    return (
        <div className="pswp-gallery" id={'test'}>
            {images.map((image, index) => (
                <a
                    href={image.url}
                    data-pswp-width={300}
                    // data-pswp-height={500}
                    key={'test-' + index}
                    target="_blank"
                    rel="noreferrer"
                    ref={ref}
                >
                    <img src={image.url} alt="" />
                </a>
            ))}
        </div>
    );
}
