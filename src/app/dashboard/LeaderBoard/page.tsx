"use client";
import Link from 'next/link';
import useUserStore from "@/lib/useUserStore";
import useGameStore from "@/lib/useGameStore";
import styled from '@emotion/styled';
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/api";
import { useRouter } from 'next/navigation'; // 从 next/navigation 导入 useRouter

export default function Home() {
    const { user, logout } = useUserStore();  /* 用户状态 */
    const { game, setGame, exit } = useGameStore();  /* 游戏状态 */
    const [rankingTitle, setRankingTitle] = useState("高分榜");
    const [activeButton, setActiveButton] = useState("玩家评分");
    const [games, setGames] = useState([]); // 存储游戏数据
    const [loading, setLoading] = useState(false);  // 是否正在加载
    const [isHydrated, setIsHydrated] = useState(false); // 用于确保客户端渲染和服务端渲染一致
    const router = useRouter(); // 使用 useRouter 钩子

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


    const fetchGames = async (orderBy) => {
        setLoading(true);
        let { data: gamesData, error } = await supabase
            .from('game')
            .select('*');

        if (error) {
            console.error('Error fetching games:', error);
            setLoading(false);
            return;
        }

        const { data: ratingsData, error: ratingsError } = await supabase
            .from('game')
            .select('g_id, avg_rating');

        if (ratingsError) {
            console.error('Error fetching ratings:', ratingsError);
            setLoading(false);
            return;
        }

        const mergedData = gamesData.map(game => {
            const rating = ratingsData.find(r => r.g_id === game.g_id)?.avg_rating || 0;
            return { ...game, rating, tags: game.style ? game.style.split('，') : [] }; // 分割标签
        });

        if (orderBy === 'rating') {
            mergedData.sort((a, b) => b.rating - a.rating);
        } else if (orderBy === 'g_time') {
            mergedData.sort((a, b) => new Date(b.g_time).getTime() - new Date(a.g_time).getTime());
        }

        setGames(mergedData);
        setLoading(false);
    };

    useEffect(() => {
        setIsHydrated(true);
        fetchGames('rating'); // 默认按评分排序
    }, []);

    const handleTitleChange = (title, button) => {
        setRankingTitle(title);
        setActiveButton(button);
        if (button === '玩家评分') {
            fetchGames('rating');
        } else if (button === '发售时间') {
            fetchGames('g_time');
        }
    };

    const handleClick = (game) => {
        return () => {
            setLoading(true);
            setGame(game); // 将点击的游戏设置为全局游戏状态
            router.push('/dashboard/GameDetail'); // 使用 useRouter 进行导航，传递游戏 ID
            console.log('被点击了:', game); // 输出更新后的游戏对象
        };
    };

    if (!isHydrated) {
        return null; // 确保组件在客户端渲染
    }

    return (
        <BackgroundDiv>
            <div className="text-x text-gray-900">
                {/* 导航栏 */}
                <nav className="flex items-center px-4 py-5 bg-gray-900 justify-between">
                    <div className="text-white flex items-center space-x-4 text-base font-normal">
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
                    <div className="flex flex-col justify-center space-y-2 text-base font-normal">
                        <label htmlFor="#" className="text-xl text-white px-2">{user?.name}</label>
                        <a href="/login"
                              className="upgrade-btn active-nav-link text-white text-base px-2 hover:text-blue-500 hover:underline"
                              onClick={() => logout()}>退出账户</a>
                    </div>
                </nav>
            </div>

            <div className="container mx-auto my-10 flex-1 rounded items-center justify-center text-lg font-bold">
                <div className="text-x text-gray-900">
                    {/* 子导航栏 */}
                    <div className="flex items-center px-4 py-3 bg-gray-600 justify-between text-base font-normal">
                        <ul className="flex items-center space-x-6">
                            <li>
                                <a href="#"
                                   className='flex flex-row w-full hover:text-gray-400 text-white text-base leading-5'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="white" className="size-5 w-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"/>
                                    </svg>
                                    您的商店
                                </a>
                            </li>
                            <li>
                                <a href="#"
                                   className='flex flex-row w-full hover:text-gray-400 text-white text-base leading-5'>
                                    新鲜推荐
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
                {/* 边栏和排行榜 */}
                <div className="flex mt-10">
                    <aside className="w-1/5 p-4 bg-gray-700 text-white h-full overflow-y-auto mr-6">
                        <ul>
                            <li className={`py-2 px-4 mb-2 hover:bg-gray-500 cursor-pointer ${activeButton === '玩家评分' ? 'bg-gray-600 text-xl font-bold' : 'text-base font-normal'}`} onClick={() => handleTitleChange("高分榜", "玩家评分")}>玩家评分</li>
                            <li className={`py-2 px-4 hover:bg-gray-500 cursor-pointer ${activeButton === '发售时间' ? 'bg-gray-600 text-xl font-bold' : 'text-base font-normal'}`} onClick={() => handleTitleChange("最新上线", "发售时间")}>发售时间</li>
                        </ul>
                    </aside>
                    <main className="w-4/5 p-4 bg-gray-800 bg-opacity-80 text-white">
                        <div className="flex justify-between mb-4 px-4 items-center text-base font-normal">
                            <h2 className="text-xl flex-1">{rankingTitle}</h2>
                            <div className="w-1/6 text-right" style={{ marginRight: '-2rem' }}>
                                <span>发售时间</span>
                            </div>
                            <div className="w-1/6 text-right" style={{ marginRight: '0.5rem' }}>
                                <span>评分</span>
                            </div>
                        </div>
                        <ul>
                            {loading ? (
                                <li className="flex justify-center items-center py-2 px-4">
                                    <p className="text-white">加载中...</p>
                                </li>
                            ) : (
                                games.map((game, index) => (
                                    <li key={index} className="flex items-center justify-between py-2 px-4 bg-gray-700 bg-opacity-80 rounded mb-2 hover:bg-gray-600 hover:bg-opacity-80 transition duration-300 cursor-pointer" onClick={handleClick(game)}>
                                        <span className="w-8 text-left text-base font-normal">{index + 1}</span>
                                        <div className="w-48 h-24 mr-4 flex-shrink-0">
                                            <img src={game.face_img} alt={game.g_name} className="w-full h-full object-cover"
                                                onClick={handleClick(game)} 
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <span className="text-xl font-bold mb-1">{game.g_name}</span>
                                            <div className="flex flex-wrap">
                                                {game.tags.map((tag, tagIndex) => (
                                                    <span key={tagIndex} className="text-sm text-gray-400 bg-gray-900 bg-opacity-50 rounded px-2 py-1 mr-2 mt-1">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="w-1/6 text-center" style={{ marginRight: '-5.5rem' }}> {/* 调整 marginLeft */}
                                            <span className="text-base font-normal">{new Date(game.g_time).toLocaleDateString()}</span>
                                        </div>
                                        <div className="w-1/6 text-right" style={{ marginRight: '1rem' }}> {/* 调整 marginRight */}
                                            <span className="text-base font-normal">{game.avg_rating ? game.avg_rating : 0}</span>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </main>
                </div>
            </div> {/* end container */}
        </BackgroundDiv>
    );
}
