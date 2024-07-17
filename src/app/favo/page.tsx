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
  overflow: hidden;
`;
//白色半透明框
const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.90); /* Semi-transparent white background */
  padding: 2rem;
  border-radius: 25px;
  border: 2px solid #000; 
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.55);
  height: 100%
  width: 100%; /* Adjust to the desired width */
  max-height: 200px;
  max-width: 5000px; /* Adjust to the desired max width */
  animation: slideUp 0.6s ease-out forwards;
  margin-bottom: 2rem; /* Add vertical space between containers */
  overflow: hidden;
  
  &:last-child {
    margin-bottom: 5; /* Remove margin from the last container */
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

//图片缩放
const imaStyle: CSSProperties = {
  width: '200px', // 设置图片的宽度
  height: 'auto', // 保持图片的高度自动调整
  objectFit: 'cover' // 保持图片的比例
};

interface CustomElementProps {
  imageUrl: string;
  buttonStyleUrl: string;
}

const CustomElement: React.FC<CustomElementProps> = ({ imageUrl, buttonStyleUrl }) => {
  const [imageStyle, setImageStyle] = useState<React.CSSProperties>({});
  const [buttonStyle, setButtonStyle] = useState<React.CSSProperties>({});
  const { user, logout} = useUserStore()

  useEffect(() => {
    fetch(imageUrl)
      .then(response => response.json())
      .then(data => setImageStyle(data));
    
    fetch(buttonStyleUrl)
      .then(response => response.json())
      .then(data => setButtonStyle(data));
  }, [imageUrl, buttonStyleUrl]);

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
              <div className="mr-4">
                <img src="fengmian1.jpg" alt="Image" style={imaStyle}  />
              </div>
              <div className="flex-1">
                <input type="text" placeholder="Enter text here" />
              </div>
              <div className="ml-4">
                <button style={buttonStyle}>Button</button>
              </div>
              
            </div>
          </FormContainer>

          <FormContainer>
            <div className="flex items-center">
              <div className="mr-4">
                <img src="fengmian1.jpg" alt="Image" style={imaStyle} />
              </div>
              <div className="flex-1">
                <input type="text" placeholder="Enter text here" />
              </div>
              <div className="ml-4">
                <button style={buttonStyle}>Button</button>
              </div>
              
            </div>
          </FormContainer>

          <FormContainer>
            <div className="flex items-center">
              <div className="mr-4">
                <img src="fengmian1.jpg" alt="Image" style={imaStyle} />
              </div>
              <div className="flex-1">
                <input type="text" placeholder="Enter text here" />
              </div>
              <div className="ml-4">
                <button style={buttonStyle}>Button</button>
              </div>
              
            </div>
          </FormContainer>
        </div>



      </BackgroundDiv>
  );
};

export default CustomElement;


// export default function Wishlist() {

//   const { user, logout} = useUserStore()  /* 用户状态 */

  // return (
  //   <BackgroundDiv>
  //       <div className="text-x text-gray-900 w-full">
  //         {/* 导航栏 */}
  //         <nav className="flex items-center px-4 py-5 bg-gray-900 justify-between w-full">   {/* 导航栏 */}
  //             <div className="text-white flex items-center space-x-4">
  //                 <a href="#">
  //                     <img src="https://store.akamai.steamstatic.com/public/shared/images/header/logo_steam.svg?t=962016" width="176" height="44" alt="Steam 主页链接"/>
  //                 </a>
  //                 <ul className="flex items-center space-x-6">
  //                     <li>
  //                         <a href="#" className="hover:text-gray-400 text-white">商店</a>
  //                     </li>
  //                     {/* <li>
  //                         <a href="#" className="hover:text-gray-400 text-white">库</a>
  //                     </li> */}
  //                     <li>
  //                         <a href="#" className="hover:text-gray-400 text-white">username</a>
  //                     </li>
  //                     <li>
  //                         <a href="#" className="hover:text-gray-400 text-white">收藏</a>
  //                     </li>
  //                     <li>
  //                         <a href="#" className="hover:text-gray-400 text-white">排行榜</a>
  //                     </li>
  //                 </ul>
  //             </div>
                    
  //             <div className="flex flex-col justify-center space-y-2">
  //                 <label htmlFor="#" className="text-xl text-white px-2">username</label>
  //                 <Link href="/login" className="upgrade-btn active-nav-link text-white text-sm px-2 hover:text-blue-500 hover:underline" onClick={() => logout()}>退出账户</Link>
  //             </div>
  //         </nav>
  //       </div>

  //       <div className="container mx-auto my-10 flex-1 rounded items-center justify-between w-full">
  //         <FormContainer>
  //         {/* 在这里书写你的代码 */}
  //         </FormContainer>
  //       </div>



  //     </BackgroundDiv>

//   );
//   }
