"use client"
import Link from 'next/link';
import useUserStore from "@/lib/useStore";
import styled from '@emotion/styled';
import Carousel from '@/components/carousel/Carousel';
import Scroll from '@/components/scroll/Scroll'

export default function Home() {
    const { user, logout} = useUserStore()  /* 用户状态 */

    // 将 SVG 内容嵌入 styled-component
    const BackgroundDiv = styled.div`
    background-image: url('fengmian2.jpg');
    background-size: cover;
    background-position: center;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    `;


    return (
      <BackgroundDiv>
        <div className="text-x text-gray-900">
          {/* 导航栏 */}
          <nav className="flex items-center px-4 py-5 bg-gray-900 justify-between ">   {/* 导航栏 */}
              <div className="text-white flex items-center space-x-4">
                <div className='flex flex-row items-center pr-4'>
                  <a href="#">
                      <img src="/game new.svg" width="80" height="35" alt="Steam 主页链接"/>
                  </a>
                  <label htmlFor="#" className='text-2xl'>STREAM</label>
                </div>
                  
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" className="size-5 w-6">
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
                </ul>
              
                <div className="relative">
                    <input type="text" className="rounded bg-white-900 border border-gray-600 placeholder-gray-400 w-60 px-3 py-1" placeholder="搜索"/>
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 flex items-center px-2">
                        <img src="./search.png" className='w-5 ' />
                    </div>
                </div>
            </div>
          </div> 

          <div className="flex container items-center justify-center pt-16 pb-0">
            <Carousel></Carousel>
          </div>

          <div className='pb-20'>
            <Scroll></Scroll>           
          </div>
          
          <div className='w-11/12 grid grid-cols-3 gap-4 mx-auto'>
            <div>
                <img src="/fengmian1.jpg" alt="" />
            </div>
            <div>
                <img src="/fengmian1.jpg" alt="" />
            </div>
            <div>
                <img src="/fengmian1.jpg" alt="" />
            </div>
          </div>
        </div> {/* end container */}
      </BackgroundDiv>
    )
  }