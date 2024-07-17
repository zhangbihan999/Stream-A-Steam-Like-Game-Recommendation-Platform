import { useState, useEffect } from "react";
import Swipe from "react-easy-swipe";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import './carousel.css';

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [
    '/fengmian1.jpg',
    '/fengmian2.jpg',
    '/fengmian1.jpg'
    // 添加更多图片路径
  ];

  const handleNextSlide = () => {
    let newSlide = currentSlide === images.length - 1 ? 0 : currentSlide + 1;
    setCurrentSlide(newSlide);
  };

  const handlePrevSlide = () => {
    let newSlide = currentSlide === 0 ? images.length - 1 : currentSlide - 1;
    setCurrentSlide(newSlide);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, 3000); // 每三秒切换一次

    return () => {
      clearInterval(interval);
    };
  }, [currentSlide]);

  return (
    <div className="relative w-11/12 mx-auto">
      <AiOutlineLeft
        onClick={handlePrevSlide}
        className="absolute left-0 m-auto text-5xl inset-y-1/2 cursor-pointer text-gray-400 z-20"
      />
      <div className="w-full h-[50vh] flex overflow-hidden relative m-auto">
        <Swipe
          onSwipeLeft={handleNextSlide}
          onSwipeRight={handlePrevSlide}
          className="relative z-10 w-full h-full"
        >
          {images.map((image, index) => (
            <div
              key={index}
              className={`carousel-item ${index === currentSlide ? 'active' : ''} ${
                index === (currentSlide - 1 + images.length) % images.length ? 'previous' : ''
              } ${index === (currentSlide + 1) % images.length ? 'next' : ''}`}
            >
              <img
                src={image}
                layout="fill"
                objectFit="contain"
                className="animate-fadeIn"
                alt={`slide ${index}`}
              />
            </div>
          ))}
        </Swipe>
      </div>
      <AiOutlineRight
        onClick={handleNextSlide}
        className="absolute right-0 m-auto text-5xl inset-y-1/2 cursor-pointer text-gray-400 z-20"
      />

      <div className="relative flex justify-center p-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={
              index === currentSlide
                ? "h-4 w-6 bg-gray-700 rounded-full mx-2 mb-2 cursor-pointer"
                : "h-4 w-4 bg-gray-300 rounded-full mx-2 mb-2 cursor-pointer"
            }
            onClick={() => {
              setCurrentSlide(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}
