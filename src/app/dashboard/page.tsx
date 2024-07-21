"use client"
import useUserStore from "@/lib/useUserStore";
import useGameStore from "@/lib/useGameStore";
import styled from '@emotion/styled';
import Carousel from '@/components/carousel/Carousel';
import Scroll from '@/components/scroll/Scroll'
import React, { useEffect, useState } from 'react';
import { supabase } from "@/lib/api";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { LoadingOverlay } from "@/components/loading";

export default function Home() {
    // 将 SVG 内容嵌入 styled-component
    const BackgroundDiv = styled.div`
    background-image: url('/fengmian2.jpg');
    background-size: cover;
    background-attachment: fixed; /* 保持背景图位置固定 */
    background-position: center;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    `;

    const { user, setUser, logout } = useUserStore();  /* 用户状态 */
    const { game, setGame, exit } = useGameStore();  /* 游戏状态 */
    const [isHydrated, setIsHydrated] = useState(false); // 用于确保客户端渲染和服务端渲染一致
    const [games, setGames] = useState([]); // 存储游戏数据
    const router = useRouter();
    const [loading, setLoading] = useState(false);  // 是否正在加载

    // 从 Supabase 获取游戏数据
    const fetchGames = async () => {
        const { data, error } = await supabase
            .from('game')
            .select('*')
            .in('g_id', [2,4,5,9,11,14,15,16,18,20,21,22,25,26,27,28,29,30])
        if (error) {
            console.error('Error fetching games:', error);
        } else {
            setGames(data);
        }
    };

    const handleClick = (game) => {
        return () => {
            setLoading(true)
            setTimeout(() => {
                setGame(game); // 更新游戏状态
                router.push('/dashboard/GameDetail'); // 跳转到详细页面
            }, 300); // 给予300毫秒的延迟确保加载覆盖层显示
        };
    };

    useEffect(() => {
        // 确保组件在客户端渲染
        setIsHydrated(true);
        // 检查 localStorage 中是否有用户数据
        const storedUserString = localStorage.getItem('user-storage');
        if (storedUserString) {
            const storedUser = JSON.parse(storedUserString);
            if (storedUser && storedUser.state && storedUser.state.user) {
                setUser(storedUser.state.user);
            }
        }
        // 获取游戏数据
        fetchGames();
    }, [setUser]);

    if (!isHydrated) {
        // 避免客户端和服务端渲染结果不一致的问题
        return null;
    }

    const SearchContainer = styled.a`
        display: flex;
        flex-direction: row;
        align-items: center;
        color: white; /* 设置搜索文字的颜色为白色 */
        // text-base;
        line-height: 1.25;
        background: rgba(192, 192, 192, 0.5); /* 灰色虚化背景，可以亮一点 */
        padding: 0.25rem 0.5rem;
        border-radius: 0.375rem; /* 圆角 */
        transition: background 0.3s ease; /* 过渡效果 */
        &:hover {
            background: rgba(192, 192, 192, 0.8); /* 悬停时变亮 */
        }
    `;


    return (
        <BackgroundDiv>
            {loading && (
                <LoadingOverlay>
                    <div className="loader">Loading...</div>
                </LoadingOverlay>
            )}
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
                                <a href="/dashboard" className="hover:text-gray-400 text-white">商店</a>
                            </li>
                            <li>
                                <a href="/dashboard/favo" className="hover:text-gray-400 text-white">个人中心</a>
                            </li>
                            <li>
                                <a href="/dashboard/LeaderBoard" className="hover:text-gray-400 text-white">排行榜</a>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col justify-center space-y-2">
                        <label htmlFor="#" className="text-xl text-white px-2">{user?.name}</label>
                        <Link href="/login"
                              className="upgrade-btn active-nav-link text-white text-sm px-2 hover:text-blue-500 hover:underline"
                              onClick={() => logout()}>退出账户</Link>
                    </div>
                </nav>
            </div>

            <div className="container mx-auto my-10 flex-1 rounded items-center justify-center">
                <div className="text-x text-gray-900">
                    {/* 子导航栏 */}
                    <div className="flex items-center px-4 py-3 bg-gray-600 justify-between text-base font-normal">
                        <ul className="flex items-center space-x-6">
                            <li>
                                <a href="/dashboard/StreamAI"
                                   className='flex items-center w-full hover:text-gray-400 text-white text-base leading-5'>
                                    <img src="/aislogo.png" width="40" height="40" alt="Steam 主页链接"
                                         className="mr-2"/>
                                    <span>STREAM AI</span>
                                </a>
                            </li>
                        </ul>
                        <div className="relative flex items-center">
                            <SearchContainer href="/dashboard/Search">
                                <span>搜索</span>
                                <img src="/search.png" className="w-5 ml-2"/>
                            </SearchContainer>
                        </div>
                    </div>
                </div>

                <div className="flex container items-center justify-center pt-16 pb-0">
                    <Carousel></Carousel>
                </div>

                <div className='pt-4 pb-20'>
                    <Scroll></Scroll>

                </div>

                {/* 展示区域 */}
                <div className='w-11/12 grid grid-cols-3 gap-4 mx-auto'>
                    {games.map((game, index) => (
                        game.face_img ? (
                            <div key={index} className='w-full'>
                                <img src={game?.face_img} alt={`Game ${index}`}
                                     className='w-full h-48 object-cover hover:cursor-pointer hover:opacity-75'
                                     onClick={handleClick(game)}
                                />
                            </div>
                        ) : null
                    ))}
                </div>
            </div> {/* end container */}
        </BackgroundDiv>
    )
}
