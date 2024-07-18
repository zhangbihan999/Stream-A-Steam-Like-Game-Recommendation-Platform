"use client"
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import useUserStore from "@/lib/useUserStore";
import useGameStore from "@/lib/useGameStore";
import styled from '@emotion/styled';
import { supabase } from "@/lib/api";
import { useRouter } from 'next/navigation';

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

type StarsProps = {
    hoverRating: number;
    currentRating: number;
    handleMouseOver: (index: number) => void;
    handleMouseLeave: () => void;
    handleClick: (index: number) => void;
};

const Stars: React.FC<StarsProps> = React.memo(({ hoverRating, currentRating, handleMouseOver, handleMouseLeave, handleClick }) => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
        stars.push(
            <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                fill={i <= (hoverRating || currentRating) ? 'yellow' : 'none'}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 cursor-pointer"
                onMouseOver={() => handleMouseOver(i)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(i)}
                style={{ width: '24px', height: '24px' }}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
        );
    }
    return stars;
});

Stars.displayName = 'Stars';

function GameDetail() {
    const { user, setUser, logout } = useUserStore();  /* 用户状态 */
    const { game, setGame, exit } = useGameStore();  /* 游戏状态 */
    const [isHydrated, setIsHydrated] = useState(false); // 用于确保客户端渲染和服务端渲染一致
    const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0)
    const [currentMedia, setCurrentMedia] = useState({src: null, type: null});
    const [currentRating, setCurrentRating] = useState(0); // 当前评分
    const [hoverRating, setHoverRating] = useState(0); // 鼠标悬停评分
    const [isModalOpen, setIsModalOpen] = useState(false); // 控制放大查看图像的状态
    const [isPaused, setIsPaused] = useState(false); // 控制轮播图的暂停状态
    const [pauseDueToHover, setPauseDueToHover] = useState(false);   // 是否因为鼠标悬停而暂停轮播
    const [videoPlay, setVideoPlay] = useState(false)
    const [videoEnded, setVideoEnded] = useState(false)   // 视频是否结束
    const [comment, setComment] = useState(''); // 评论状态
    const [comments, setComments] = useState([]); // 评论列表状态
    const [isFavorite, setIsFavorite] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();
    const renderFavoriteButton = () => {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isFavorite || isHovered ? 'red' : 'none'}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 cursor-pointer"
                onClick={() => setIsFavorite(!isFavorite)}
                onMouseOver={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ width: '24px', height: '24px' }}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
            </svg>
        );
    };

    const handleThumbnailClick = (index: number) => {
        setCurrentThumbnailIndex(index);
    };

    const handleMouseOver = useCallback((index: number) => {
        setHoverRating(index);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoverRating(0);
    }, []);

    const handleClick = useCallback((index: number) => {
        setCurrentRating(index);
    }, []);

    const handleImageClick = () => {
        setIsModalOpen(true);
        setIsPaused(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsPaused(false);
    };

    // 鼠标进入展示区域
    const handleMouseEnterMainImage = () => {
        setPauseDueToHover(true); // 标记由于鼠标悬停而暂停
    };

    // 鼠标离开展示区域
    const handleMouseLeaveMainImage = () => {
        setPauseDueToHover(false); // 清除鼠标悬停暂停标记
    };

    // 视频播放开始
    const handleVideoPlay = () => {
        /* if (currentMedia.type === 'video') {
            setIsPaused(false); // 当视频结束时恢复轮播，不受鼠标悬停影响
        } */
       /* setIsPaused(true) */
       setVideoPlay(true)
       setVideoEnded(false)
    };

    // 视频播放结束
    const handleVideoEnded = () => {
        /* if (currentMedia.type === 'video') {
            setIsPaused(false); // 当视频结束时恢复轮播，不受鼠标悬停影响
        } */
       /* setIsPaused(false) */
       setVideoEnded(true)
       setVideoPlay(false)
    };

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

    const recommendedGames = [
        { title: '推荐游戏1', image: '/fengmian1.jpg' },
        { title: '推荐游戏2', image: '/fengmian2.jpg' },
        { title: '推荐游戏3', image: '/fengmian1.jpg' },
        { title: '推荐游戏4', image: '/fengmian2.jpg' }
    ];

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
        /* fetchGame() */
    }, [setUser]);

    useEffect(() => {
        // 页面加载时自动滚动到顶部
        window.scrollTo(0, 0);
    }, [router]);

    const thumbnails = [
        { src: game && game.img1, alt: '小图1', type: 'image' },
        { src: game && game.img2, alt: '小图2', type: 'image' },
        { src: game && game.img3, alt: '小图3', type: 'image' },
        { src: game && game.img4, alt: '小图4', type: 'image' },
        { src: game && game.video, alt: '视频', type: 'video' }
    ]; // 小图数组
    const [mainImage, setMainImage] = useState(thumbnails[0].src); // 初始主展示图设为第1个小窗图

    useEffect(() => {
        if (!isPaused) {
            const interval = setInterval(() => {
                setCurrentThumbnailIndex((prevIndex) => (prevIndex + 1) % thumbnails.length);
            }, 3000); // 每3秒轮播一次

            return () => clearInterval(interval);
        }
    }, [thumbnails.length, isPaused]);

    useEffect(() => {
        setCurrentMedia({
            src: thumbnails[currentThumbnailIndex].src,
            type: thumbnails[currentThumbnailIndex].type
        });
        if (currentMedia.type !== 'video') {
            setVideoPlay(false)
            setVideoEnded(false)
        }
    }, [currentThumbnailIndex, thumbnails]); 
    
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
    }, [currentMedia])

    useEffect(() => {
        setMainImage(thumbnails[currentThumbnailIndex].src);
    }, [currentThumbnailIndex, thumbnails]);

    if (!isHydrated) {
        // 避免客户端和服务端渲染结果不一致的问题
        return null;
    }

    

    return (
        <BackgroundDiv>
            <div className="text-x text-gray-900">
                {/* 导航栏 */}
                <nav className="flex items-center px-4 py-5 bg-gray-900 justify-between">
                    <div className="text-white flex items-center space-x-4">
                        <a href="#">
                        <img src="/game new.svg" width="80" height="35" alt="Steam 主页链接"/>
                        </a>
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
                        <Link href="/login" className="upgrade-btn active-nav-link text-white text-sm px-2 hover:text-blue-500 hover:underline" onClick={() => logout()}>退出账户</Link>
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

                <div className="flex container mx-auto space-x-6 items-stretch">
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
                                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">发布</button>
                            </form>
                            <div className="mt-12">
                                <h3 className="text-xl font-bold mb-4">评论</h3>
                                <ul className="text-gray-300">
                                    {comments.map((comment, index) => (
                                        <li key={index} className="mb-2">
                                            {comment}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 右侧信息部分 */}
                    <div className="w-1/3 flex flex-col justify-between bg-gray-800 p-4 rounded-lg text-white" style={{ height: '60%' }}>
                        <img src={game?.face_img} alt="宣传图" className="w-full object-cover mb-4" style={{height: '200px'}}/>
                        <div className="text-sm flex-1">
                            <p className="mb-2">{game?.Description}</p>
                            <div className="mb-2">
                                <span className="font-bold">发行时间：</span> {game?.g_time}
                            </div>
                            <div className="mb-2">
                                <span className="font-bold">用户评分：</span> 8.5
                            </div>
                            <div className="mb-2">
                                <span className="font-bold">总体评价：</span> 特别好评 (584)
                            </div>
                            <div className="mb-2">
                                <span className="font-bold">定位标签：</span> {game?.style}
                            </div>
                            <div className="mt-4 flex items-center space-x-2">
                                <div className="flex space-x-1">
                                    <Stars
                                        hoverRating={hoverRating}
                                        currentRating={currentRating}
                                        handleMouseOver={handleMouseOver}
                                        handleMouseLeave={handleMouseLeave}
                                        handleClick={handleClick}
                                    />
                                </div>
                                <div className="text-white">
                                     {hoverRating ? hoverRating.toFixed(1) : (currentRating ? currentRating.toFixed(1) : '0.0')}
                                </div>
                                {renderFavoriteButton()}
                            </div>
                        </div>

                        {/* 推荐游戏部分 */}
                        <div className="mt-14">
                            <h3 className="text-xl font-bold mb-4">你可能还喜欢：</h3>
                            <div className="space-y-4">
                                {recommendedGames.map((game, index) => (
                                    <div key={index} className="flex items-center space-x-4">
                                        <img src={game.image} alt={game.title} className="w-16 h-16 object-cover"/>
                                        <span>{game.title}</span>
                                    </div>
                                ))}
                            </div>
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
    );
}

GameDetail.displayName = 'GameDetail';

export default GameDetail;
