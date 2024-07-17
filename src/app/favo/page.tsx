'use client'
import React, { useState, useEffect, CSSProperties} from 'react';
import { supabase } from "@/lib/api";
import Link from 'next/link';
import Head from 'next/head';
import useUserStore from '@/lib/useStore';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import Image from 'next/image';
import Carousel from '@/components/carousel/Carousel';

//背景
const BackgroundDiv = styled.div`
  background-image: url('fengmian1.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* Center the form container */
  padding: 2rem;
`;
//白色半透明框
const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.90); /* Semi-transparent white background */
  padding: 2rem;
  border-radius: 25px;
  border: 2px solid #000; 
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.55);
  height: 100%;
  width: 90%; /* Adjust to the desired width */
  max-height: 200px;
  max-width: 5000px; /* Adjust to the desired max width */
  animation: slideUp 0.6s ease-out forwards;
  margin-bottom: 2rem; /* Add vertical space between containers */
  transition: transform 0.3s ease; /* Smooth transition for transform */
  
  &:last-child {
    margin-bottom: 0; /* Remove margin from the last container */
  }

  &:hover {
    transform: scale(1.02); /* Scale up to 105% of the original size */
  }
`;

//图片缩放
const imaStyle: CSSProperties = {
  width: '200px', // 设置图片的宽度
  height: 'auto', // 保持图片的高度自动调整
  objectFit: 'cover' // 保持图片的比例
};

//按钮设置
const ImageButton = ({ imageUrl, onClick }) => {
  return (
    <button onClick={onClick} style={{ border: 'none', background: 'none' }}>
      <img src="butt.png" alt="Image Button" style={{ cursor: 'ns-resize',  width: '35px', height: '50px' }} />
    </button>
  );
};

//灰色实线(竖线)
const LineComponent = () => {
  const lineStyle = {
    width: '2px', // 线条宽度，现在是竖线的高度
    height: '100px', // 线条高度，现在是竖线的长度
    backgroundColor: '#A9A9A9', // 深灰色
    margin: '0 10px', // 调整为左右外边距
    display: 'inline-block', // 确保div以行内块元素显示
  };

  return <div style={lineStyle} />;
};

interface CustomElementProps {
  imageUrl: string;
  buttonStyleUrl: string;
}

const CustomElement: React.FC<CustomElementProps> = ({ imageUrl, buttonStyleUrl }) => {
  // const [imageStyle, setImageStyle] = useState<React.CSSProperties>({});
  // const [buttonStyle, setButtonStyle] = useState<React.CSSProperties>({});
  const { user, logout} = useUserStore()

  // useEffect(() => {
  //   fetch(imageUrl)
  //     .then(response => response.json())
  //     .then(data => setImageStyle(data));
    
  //   fetch(buttonStyleUrl)
  //     .then(response => response.json())
  //     .then(data => setButtonStyle(data));
  // }, [imageUrl, buttonStyleUrl]);

  return (
    <BackgroundDiv>
        <div className="text-x text-gray-900 w-full">
          {/* 导航栏 */}
          <nav className="flex items-center px-4 py-5 bg-gray-900 justify-between w-full">   {/* 导航栏 */}
              <div className="text-white flex items-center space-x-4">
                  <a href="#">
                      <img src="https://store.akamai.steamstatic.com/public/shared/images/header/logo_steam.svg?t=962016" width="176" height="44" alt="Steam 主页链接"/>
                  </a>
                  <ul className="flex items-center space-x-6">
                      <li>
                          <a href="#" className="hover:text-gray-400 text-white">商店</a>
                      </li>
                      {/* <li>
                          <a href="#" className="hover:text-gray-400 text-white">库</a>
                      </li> */}
                      <li>
                          <a href="#" className="hover:text-gray-400 text-white">username</a>
                      </li>
                      <li>
                          <a href="#" className="hover:text-gray-400 text-white">收藏</a>
                      </li>
                      <li>
                          <a href="#" className="hover:text-gray-400 text-white">排行榜</a>
                      </li>
                  </ul>
              </div>
                    
              <div className="flex flex-col justify-center space-y-2">
                  <label htmlFor="#" className="text-xl text-white px-2">username</label>
                  <Link href="/login" className="upgrade-btn active-nav-link text-white text-sm px-2 hover:text-blue-500 hover:underline" onClick={() => logout()}>退出账户</Link>
              </div>
          </nav>
        </div>

        <div className="container mx-auto my-10 flex-1 rounded items-center justify-between w-full">
        <FormContainer>
            <div className="flex items-center">
              <div className="mr-7">
                <img src="fengmian1.jpg" alt="Image" style={{ width: '250px', height: '100px' }} />
              </div>
              <div className='mr-6'><LineComponent /></div>
              <div className="flex-1">
                <h2>Counter-Strike 2</h2>
                <div className="tags">
                  <span>第一人称射击</span>
                  <span>射击</span>
                  <span>多人</span>
                  <span>竞技</span>
                  <span>动作</span>
                </div>
                <div className="info">
                  <div className="release-date">
                    <span>发行日期：</span>
                    <span>2012 年 8 月 22 日</span>
                  </div>
                  <div className="rating">
                    <span>总体评价：</span>
                    <span>特别好评</span>
                  </div>
              </div>
              </div>
              <div className="ml-4">
                <ImageButton imageUrl={"/my-image.png"} onClick={CustomElement}/>
              </div>
            </div>
          </FormContainer>

          <FormContainer>
            <div className="flex items-center">
              <div className="mr-7">
                <img src="fengmian2.jpg" alt="Image" style={{ width: '250px', height: '100px' }} />
              </div>
              <div className='mr-6'><LineComponent /></div>
              <div className="flex-1">
                <h2>Counter-Strike 2</h2>
                <div className="tags">
                  <span>第一人称射击</span>
                  <span>射击</span>
                  <span>多人</span>
                  <span>竞技</span>
                  <span>动作</span>
                </div>
                <div className="info">
                  <div className="release-date">
                    <span>发行日期：</span>
                    <span>2012 年 8 月 22 日</span>
                  </div>
                  <div className="rating">
                    <span>总体评价：</span>
                    <span>特别好评</span>
                  </div>
              </div>
              </div>
              <div className="ml-4">
                <ImageButton imageUrl={"/my-image.png"} onClick={CustomElement}/>
              </div>
            </div>
          </FormContainer>

          <FormContainer>
            <div className="flex items-center">
              <div className="mr-7">
                <img src="fengmian1.jpg" alt="Image" style={{ width: '250px', height: '100px' }} />
              </div>
              <div className='mr-6'><LineComponent /></div>
              <div className="flex-1">
                <h2>Counter-Strike 2</h2>
                <div className="tags">
                  <span>第一人称射击</span>
                  <span>射击</span>
                  <span>多人</span>
                  <span>竞技</span>
                  <span>动作</span>
                </div>
                <div className="info">
                  <div className="release-date">
                    <span>发行日期：</span>
                    <span>2012 年 8 月 22 日</span>
                  </div>
                  <div className="rating">
                    <span>总体评价：</span>
                    <span>特别好评</span>
                  </div>
              </div>
              </div>
              <div className="ml-4">
                <ImageButton imageUrl={"/my-image.png"} onClick={CustomElement}/>
              </div>
            </div>
          </FormContainer>

          <FormContainer>
            <div className="flex items-center">
              <div className="mr-7">
                <img src="fengmian2.jpg" alt="Image" style={{ width: '250px', height: '100px' }} />
              </div>
              <div className='mr-6'><LineComponent /></div>
              <div className="flex-1">
                <h2>Counter-Strike 2</h2>
                <div className="tags">
                  <span>第一人称射击</span>
                  <span>射击</span>
                  <span>多人</span>
                  <span>竞技</span>
                  <span>动作</span>
                </div>
                <div className="info">
                  <div className="release-date">
                    <span>发行日期：</span>
                    <span>2012 年 8 月 22 日</span>
                  </div>
                  <div className="rating">
                    <span>总体评价：</span>
                    <span>特别好评</span>
                  </div>
              </div>
              </div>
              <div className="ml-4">
                <ImageButton imageUrl={"/my-image.png"} onClick={CustomElement}/>
              </div>
            </div>
          </FormContainer>
        </div>



      </BackgroundDiv>
  );
};

export default CustomElement;
