'use client'
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
  border-radius: 15px;
  box-shadow: 0 0 25px rgba(255, 255, 255, 155);
  width: 100%; /* Adjust to the desired width */
  max-width: 450px; /* Adjust to the desired max width */
  animation: slideUp 0.6s ease-out forwards;
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

export default function Wishlist() {

  const { user, logout} = useUserStore()  /* 用户状态 */

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

        <div className="container mx-auto my-10 flex-1 rounded items-center justify-center">
          <div className="text-x text-gray-900">
            {/* 子导航栏 */}
            <div className="flex items-center px-4 py-3 bg-gray-600 justify-between">
                <ul className="flex items-center space-x-6">
                    <li>
                        <a href="#" className='flex flex-row w-full hover:text-gray-400 text-white text-sm leading-5'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 1024 1024" stroke-width="1.5" stroke="white" className="size-5 w-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                            </svg>
                            您的商店
                        </a>
                    </li>
                    <li>
                        <a href="#" className='flex flex-row w-full hover:text-gray-400 text-white text-sm leading-5'>
                            新鲜推荐
                        </a>
                    </li>
                    <li>
                        <a href="#" className='flex flex-row w-full hover:text-gray-400 text-white text-sm leading-5'>
                            类别
                        </a>
                    </li>
                    <li>
                        <a href="#" className='flex flex-row w-full hover:text-gray-400 text-white text-sm leading-5'>
                            点数商店
                        </a>
                    </li>
                    <li>
                        <a href="#" className='flex flex-row w-full hover:text-gray-400 text-white text-sm leading-5'>
                            新闻
                      </a>
                    </li>
                    <li>
                        <a href="#" className='flex flex-row w-full hover:text-gray-400 text-white text-sm leading-5'>
                            实验室
                        </a>
                    </li>
                </ul>
              
                <div className="relative">
                    <input type="text" className="rounded bg-white-900 border border-gray-600 placeholder-gray-400 w-60 px-3 py-1" placeholder="搜索"/>
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 flex items-center px-2">
                        <img src="./search.png" className='w-5 ' />
                    </div>
                </div>
            </div>
          </div> 

          
        </div> {/* end container */}



      </BackgroundDiv>


    // <BackgroundDiv>
      
      
    //   <FormContainer>
      //   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      //     <Head>
      //       <title>愿望单 - WNZHENG1125</title>
      //       <link rel="icon" href="/favicon.ico" />
      //     </Head>

      //     <main style={{ maxWidth: '800px', width: '100%' }}>
      //       <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>WNZHENG1125 的愿望单</h1>
      //       <input type="text" placeholder="按名称或标签搜索" style={{ width: '100%', padding: '10px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '5px' }} />

      //       {/* 游戏列表 */}
      //       <div style={{ width: '100%' }}>
      //         {/* 游戏项 */}
      //         <div style={{ border: '1px solid #eee', padding: '15px', marginBottom: '20px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      //           <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Counter-Strike 2</h2>
      //           <p>特别好评</p>
      //           <p>￥ 103.00</p>
      //           <p>第一人称射击 射击 多人 竞技 动作</p>
      //           <p>发行日期：2012年8月22日</p>
      //           <button style={{ padding: '10px 20px', border: 'none', borderRadius: '5px', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', fontSize: '16px' }}>添加至购物车</button>
      //           <p style={{ marginTop: '10px' }}>添加日期：2024/7/17 (移除)</p>
      //         </div>
      //         {/* 其他游戏项... */}
      //       </div>
      //     </main>

      //     {/* 页脚 */}
      //     <footer style={{ marginTop: '20px', textAlign: 'center', padding: '10px', backgroundColor: '#f7f7f7', color: '#333' }}>
      //       © 2024 WNZHENG1125. All rights reserved.
      //     </footer>
      //   </div>
      // </FormContainer>
    // </BackgroundDiv>
  );
  }
