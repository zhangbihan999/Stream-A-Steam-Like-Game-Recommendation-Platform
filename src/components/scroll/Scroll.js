import { useState, useEffect } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import './scroll.css';
import { DiVim } from "react-icons/di";

export default function Scroll() {
  const [isPaused, setIsPaused] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(30); // 默认滚动速度
  const [animationDirection, setAnimationDirection] = useState('normal');

  const images = [
    '/fengmian1.jpg',
    '/fengmian2.jpg',
    '/fengmian1.jpg',
    '/fengmian1.jpg',
    // 添加更多图片路径
  ];

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleLeftArrowEnter = () => {
    setScrollSpeed(10); // 设置加速速度
    setAnimationDirection('normal'); // 设置动画方向为正常
  };

  const handleRightArrowEnter = () => {
    setScrollSpeed(10); // 设置加速速度
    setAnimationDirection('reverse'); // 设置动画方向为反向
  };

  const handleArrowLeave = () => {
    setScrollSpeed(30); // 恢复默认速度
    setAnimationDirection('normal'); // 恢复正常方向
  };

  return (
    <div className="relative w-11/12 mx-auto">
      <div 
        className={`wrapper container flex h-40 relative overflow-hidden ${isPaused ? 'paused' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {images.map((image, index) => (
          <div key={index} className={`item  ${animationDirection}`}
            style={{
              animationDelay: `calc(${7 * (images.length - (index + 1))}s * -1)`,
              animationDuration: `${7 * images.length}s` 
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img src={image} alt={`slide ${index}`} className="w-full h-full object-cover hover:cursor-pointer hover:opacity-75"/>
          </div>
        ))}
      </div>
      {/* <div className="arrow-container">
        <AiOutlineLeft 
          className="absolute top-1/2 left-0 transform -translate-y-1/2 cursor-pointer text-gray-400"
          size={30}
          onMouseEnter={handleLeftArrowEnter}
          onMouseLeave={handleArrowLeave}
        />
        <AiOutlineRight 
          className="absolute top-1/2 right-0 transform -translate-y-1/2 cursor-pointer text-gray-400"
          size={30}
          onMouseEnter={handleRightArrowEnter}
          onMouseLeave={handleArrowLeave}
        />
      </div> */}
    </div>
  );
}
