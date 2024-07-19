"use client"
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import useUserStore from "@/lib/useUserStore";
import useGameStore from "@/lib/useGameStore";
import styled from '@emotion/styled';
import { supabase } from "@/lib/api";
import { useRouter } from 'next/navigation';

export default function Home() { 
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
    const [isPaused, setIsPaused] = useState(false); // 控制轮播图的暂停状态
    const [pauseDueToHover, setPauseDueToHover] = useState(false);   // 是否因为鼠标悬停而暂停轮播
    const [currentMedia, setCurrentMedia] = useState({src: null, type: null});
    const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false); // 控制放大查看图像的状态
    const [videoPlay, setVideoPlay] = useState(false)
    const [videoEnded, setVideoEnded] = useState(false)   // 视频是否结束
    const [comment, setComment] = useState(''); // 评论状态
    const [comments, setComments] = useState([]); // 评论列表状态

    const router = useRouter();

    const thumbnails = [
        { src: game && game.img1, alt: '小图1', type: 'image' },
        { src: game && game.img2, alt: '小图2', type: 'image' },
        { src: game && game.img3, alt: '小图3', type: 'image' },
        { src: game && game.img4, alt: '小图4', type: 'image' },
        { src: game && game.video, alt: '视频', type: 'video' }
    ]; // 小图数组
    const [mainImage, setMainImage] = useState(thumbnails[0].src); // 初始主展示图设为第1个小窗图

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
    }, [setUser]);

    useEffect(() => {
        // 页面加载时自动滚动到顶部
        window.scrollTo(0, 0);
    }, [router]);

    useEffect(() => {
        setCurrentMedia({
            src: thumbnails[currentThumbnailIndex].src,
            type: thumbnails[currentThumbnailIndex].type
        });
        if (currentMedia.type !== 'video') {
            setVideoPlay(false)
            setVideoEnded(true)
        }
    }, [currentThumbnailIndex])

    // 视频播放开始
    const handleVideoPlay = () => {
        setVideoPlay(true)
        setVideoEnded(false)
     };
 
     // 视频播放结束
     const handleVideoEnded = () => {
        setVideoEnded(true)
        setVideoPlay(false)
     };

    useEffect(() => {
        if (videoPlay){
            setIsPaused(true); // 当视频不是开始也不是结束，但展示视频时停止轮播
        } else if (pauseDueToHover){
            setIsPaused(true)
        } else if (videoEnded){
            setIsPaused(false)
        } else if (isModalOpen){
            setIsPaused(true)
        } else {
            setIsPaused(false)
        }
    }, [isModalOpen, videoPlay, videoEnded, pauseDueToHover])
    

    useEffect(() => {
        if (!isPaused) {
            const interval = setInterval(() => {
                setCurrentThumbnailIndex((prevIndex) => (prevIndex + 1) % thumbnails.length);
            }, 3000); // 每3秒轮播一次

            return () => clearInterval(interval);
        }
    }, [isPaused]);

    const handleCommentChange = useCallback((e) => {
        setComment(e.target.value);
    }, []); // 空依赖数组意味着这个回调只会在组件挂载时创建一次

    const handleCommentSubmit = useCallback((e) => {
        e.preventDefault();
        if (comment.trim() !== '') {
            setComments(prevComments => [...prevComments, comment]); // 使用函数形式的更新，确保不会受到闭包的影响
            setComment(''); // 清空评论输入框
        }
    }, [comment]);

    const test = () => {
        console.log("我被电了")
    }

    // 鼠标进入展示区域
    const handleMouseEnterMainImage = () => {
        setPauseDueToHover(true); // 标记由于鼠标悬停而暂停
    };

    // 鼠标离开展示区域
    const handleMouseLeaveMainImage = () => {
        setPauseDueToHover(false); // 清除鼠标悬停暂停标记
    };

    const handleThumbnailClick = (index: number) => {
        setCurrentThumbnailIndex(index);
    };

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if (!isHydrated) {
        // 避免客户端和服务端渲染结果不一致的问题
        return null;
    }

    return (
        <BackgroundDiv>
            <div className="text-x text-gray-900">
                {/* 导航栏 */}
                <nav className="flex items-center px-4 py-5 bg-gray-900 justify-between ">
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
                                <a href="#" className="hover:text-gray-400 text-white">{user?.name}</a>
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
                        <label htmlFor="#" className="text-xl text-white px-2">{user?.name}</label>
                        <a href="/login" className="upgrade-btn active-nav-link text-white text-sm px-2 hover:text-blue-500 hover:underline" onClick={() => logout()}>退出账户</a>
                    </div>
                </nav>
            </div>

            <div className="container mx-auto mt-12 mb-10 flex-1 rounded items-center justify-center overflow-hidden text-white">
                <div className="text-x text-gray-900">
                    {/* 子导航栏 */}
                    <div className="flex items-center px-4 py-3 bg-gray-600 justify-between text-white">
                        <ul className="flex items-center space-x-6">
                            <li>
                                <a href="#" className='flex flex-row w-full hover:text-gray-400 text-white text-sm leading-5'>
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
                            <input type="text" className="rounded bg-white-900 border border-gray-600 placeholder-gray-400 w-60 px-3 py-1 text-gray-900" placeholder="搜索" />
                            <div className="absolute top-1/2 right-0 -translate-y-1/2 flex items-center px-2">
                                <img src="/search.png" className='w-5 ' alt="搜索图标" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ml-16 mt-8 mb-4">
                    <h2 className="text-4xl font-bold text-white">{game?.g_name}</h2>
                </div>

                <div className='flex container mx-auto space-x-6 items-stretch'>
                    <div className="w-2/3 flex flex-col">
                        {/* 左侧大框和小框 */}
                        <div className="relative border border-gray-600 w-full" style={{height: '500px'}}
                            onMouseEnter={handleMouseEnterMainImage}
                            onMouseLeave={handleMouseLeaveMainImage}
                        >
                            {currentMedia.type === 'video' ? (
                                <video
                                    src={currentMedia.src}
                                    controls autoPlay
                                    className="w-full h-96 object-cover cursor-pointer"
                                    onPlay={handleVideoPlay}
                                    onEnded={handleVideoEnded}
                                    style={{height: '500px'}}
                                />
                            ) : (
                                <img
                                    src={currentMedia.src}
                                    alt="主展示图"
                                    className="w-full object-cover cursor-pointer" style={{height: '500px'}}
                                    onClick={handleImageClick}
                                    
                                />
                            )}
                            <div className="absolute bottom left-0 right-0  bg-opacity-50 flex justify-center py-2 space-x-2">
                                {thumbnails.map((thumbnail, index) => (
                                    <div
                                        key={index}
                                        className={`w-16 h-16 border border-gray-600 cursor-pointer ${index === currentThumbnailIndex ? 'border-yellow-400' : ''}`}
                                        onClick={() => handleThumbnailClick(index)}
                                    >
                                        {thumbnail.type === 'video' ? (
                                            <video src={thumbnail.src} className="w-full h-full">
                                                Your browser does not support the video tag.
                                            </video>
                                        ) : (
                                            <img src={thumbnail.src} alt={thumbnail.alt} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='h-16'></div> 

                        {/* 评论输入栏 */}
                        <div className="mt-6 bg-gray-800 p-4 rounded-lg text-white">
                            <h3 className="text-xl font-bold mb-4">发表评论</h3>
                            <form onSubmit={handleCommentSubmit}>
                                <textarea
                                    className="w-full p-2 mb-4 border border-gray-600 rounded-lg text-gray-900"
                                    rows={2}
                                    placeholder="写下你的评论..."
                                    value={comment}
                                    onChange={handleCommentChange}
                                ></textarea>
                                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={test}>发布</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={handleCloseModal}>
                    <div className="relative" style={{ width: '80%', height: '80%' }}>
                        <img src={mainImage} alt="放大展示图" className="w-full h-full" onClick={(e) => e.stopPropagation()} />
                    </div>
                </div>
            )}
        </BackgroundDiv>
    )
}