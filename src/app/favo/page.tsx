'use client'
import React, { useState, useEffect, CSSProperties} from 'react';
import { supabase } from "@/lib/api";
import Link from 'next/link';
import Head from 'next/head';
import useUserStore from '@/lib/useUserStore';
import styled from '@emotion/styled';
import Image from 'next/image';
import { link } from 'fs';


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
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 3, 15, 0.29); /* 半透明白色覆盖层 */
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

//半透明框父容器
const CenteredContainer = styled.div`
  display: flex; /* 使用Flexbox布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 22vh; /* 调整白色半透明容器之间的距离(宽度比例) */
  margin-bottom: -2rem;
`;

//白色半透明框（链接版）
const FormContainer = styled.a`
  background: rgba(255, 255, 255, 0.90);
  padding: 2rem;
  border-radius: 25px;
  border: 2px solid #000;
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.55);
  display: flex; /* 修改为flex布局 */
  flex-direction: column; /* 子元素垂直排列 */
  justify-content: center; /* 子元素在容器中垂直居中 */
  align-items: flex-start; /* 子元素在容器中水平居左 */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
  height: 76%; /* This might need to be adjusted based on the parent container's height */
  width: 92%; /* Adjust to the desired width */
  max-height: 200px; /* Adjust to the desired max height */
  max-width: 6000px; /* Adjust to the desired max width */
  animation: slideUp 0.6s ease-out forwards;
  margin-bottom: 2rem;  /*useless?*/
  transition: transform 0.3s ease; /*smoothness of clicking*/

  &:last-child {
    margin-bottom: 0;
  }     

  &:hover {
    transform: scale(1.02);
  }
`;

// 调整FormContainer内的子元素
const FlexContainer = styled.div`
  display: flex; /* 使用Flexbox布局 */
  flex-direction: column; /* 子元素垂直排列 */
  justify-content: center; /* 子元素在容器中垂直居中 */
  gap: 1rem; /* 子元素之间的间距 */
  transform: translateY(-2px); /*半透明容器内部元素相对容器的垂直偏移*/
  width: 100%; // 宽度填满父容器
  height: 100%; // 高度填满父容器
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
    <button onClick={onClick} style={{
      border: 'none',
      background: 'none',
      position: 'relative', // 设置相对定位
      top: '7px', // 假设红框的顶部距离是50px
      right: '0',
      // transform: 'translateX(724px)',
      cursor: 'ns-resize' // 确保鼠标悬停时显示为指针
    }}>
      <img src="butt.png" alt="Image Button" style={{ width: '25px', height: '40px' }} />
    </button>
  );
};

//灰色实线(竖线)
const LineComponent = () => {
  const lineStyle = {
    width: '3px', // 线条宽度
    height: '80px', // 线条长度
    backgroundColor: '#A9A9A9', // 深灰色
    margin: '0 10px', // 调整为左右外边距
    display: 'inline-block', // 确保div以行内块元素显示
  };

  return <div style={lineStyle} />;
};

//传图接口
interface CustomElementProps {
  imageUrl: string;
  buttonStyleUrl: string;
}

//标号
const Label = ({ text, style }) => {
  return (
    <div className="label" style={style}>
      {text}
    </div>
  );
};


const CustomElement: React.FC<CustomElementProps> = ({ imageUrl, buttonStyleUrl }) => {
  // const [imageStyle, setImageStyle] = useState<React.CSSProperties>({});
  // const [buttonStyle, setButtonStyle] = useState<React.CSSProperties>({});
  const { user, logout} = useUserStore()

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
        <CenteredContainer>
            <FormContainer href="/login">
              <FlexContainer>
                <div className="flex items-center">
                  <div className="mr-2">
                    <Label text="1" style={{ margin: '0 10px 0 0' }} />
                  </div>
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
              </FlexContainer>
            </FormContainer>
          </CenteredContainer>                  

          <CenteredContainer>
            <FormContainer href="/login">
              <FlexContainer>
                <div className="flex items-center">
                  <div className="mr-2">
                    <Label text="2" style={{ margin: '0 10px 0 0' }} />
                  </div>
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
              </FlexContainer>
            </FormContainer>
          </CenteredContainer> 

          <CenteredContainer>
            <FormContainer href="/login">
              <FlexContainer>
                <div className="flex items-center">
                  <div className="mr-2">
                    <Label text="3" style={{ margin: '0 10px 0 0' }} />
                  </div>
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
              </FlexContainer>
            </FormContainer>
          </CenteredContainer> 

          <CenteredContainer>
            <FormContainer href="/login">
              <FlexContainer>
                <div className="flex items-center">
                  <div className="mr-2">
                    <Label text="4" style={{ margin: '0 10px 0 0' }} />
                  </div>
                  <div className="mr-7">
                    <img src="fengmian2.jpg" alt="Image" style={{ width: '250px', height: '100px' }} />
                  </div>
                  <div className='mr-6'><LineComponent /></div>
                  <div className="flex-1">
                    <h2>好好好</h2>
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
              </FlexContainer>
            </FormContainer>
          </CenteredContainer> 
        </div>
      </BackgroundDiv>
  );
};

export default CustomElement;
