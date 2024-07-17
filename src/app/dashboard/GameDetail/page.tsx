"use client"
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import useUserStore from "@/lib/useStore";
import styled from '@emotion/styled';

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

const Stars = React.memo(({ hoverRating, currentRating, handleMouseOver, handleMouseLeave, handleClick }) => {
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
    const { user, logout } = useUserStore();  /* 用户状态 */

    const thumbnails = [
        { src: '/fengmian1.jpg', alt: '小图1' },
        { src: '/fengmian2.jpg', alt: '小图2' },
        { src: '/fengmian1.jpg', alt: '小图3' },
        { src: '/fengmian2.jpg', alt: '小图4' }
    ]; // 小图数组

    const [mainImage, setMainImage] = useState(thumbnails[0].src); // 初始主展示图设为第一个小窗图
    const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0); // 当前轮播图索引
    const [currentRating, setCurrentRating] = useState(0); // 当前评分
    const [hoverRating, setHoverRating] = useState(0); // 鼠标悬停评分
    const [isModalOpen, setIsModalOpen] = useState(false); // 控制放大查看图像的状态
    const [isPaused, setIsPaused] = useState(false); // 控制轮播图的暂停状态
    const [comment, setComment] = useState(''); // 评论状态
    const [comments, setComments] = useState([]); // 评论列表状态
    const [isFavorite, setIsFavorite] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

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


    useEffect(() => {
        if (!isPaused) {
            const interval = setInterval(() => {
                setCurrentThumbnailIndex((prevIndex) => (prevIndex + 1) % thumbnails.length);
            }, 3000); // 每3秒轮播一次

            return () => clearInterval(interval);
        }
    }, [thumbnails.length, isPaused]);

    useEffect(() => {
        setMainImage(thumbnails[currentThumbnailIndex].src);
    }, [currentThumbnailIndex, thumbnails]);

    const handleThumbnailClick = (index) => {
        setCurrentThumbnailIndex(index);
    };

    const handleMouseOver = useCallback((index) => {
        setHoverRating(index);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoverRating(0);
    }, []);

    const handleClick = useCallback((index) => {
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

    return (
        <BackgroundDiv>
            <div className="text-x text-gray-900">
                {/* 导航栏 */}
                <nav className="flex items-center px-4 py-5 bg-gray-900 justify-between">
                    <div className="text-white flex items-center space-x-4">
                        <a href="#">
                            <img src="https://store.akamai.steamstatic.com/public/shared/images/header/logo_steam.svg?t=962016" width="176" height="44" alt="Steam 主页链接" />
                        </a>
                        <ul className="flex items-center space-x-6">
                            <li>
                                <a href="#" className="hover:text-gray-400 text-white">商店</a>
                            </li>
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
                            <input type="text" className="rounded bg-white-900 border border-gray-600 placeholder-gray-400 w-60 px-3 py-1 text-gray-900" placeholder="搜索" />
                            <div className="absolute top-1/2 right-0 -translate-y-1/2 flex items-center px-2">
                                <img src="/search.png" className='w-5 ' alt="搜索图标" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ml-16 mt-8 mb-4">
                    <h2 className="text-2xl font-bold text-white">游戏名称</h2>
                </div>

                <div className="flex container mx-auto space-x-6 items-stretch">
                    {/* 左侧大框和小框 */}
                    <div className="w-2/3 flex flex-col">
                        <div className="flex-1 border border-gray-600 relative" style={{ height: '60%' }}>
                            <img src={mainImage} alt="主展示图" className="w-full h-full object-cover cursor-pointer" onClick={handleImageClick} />
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 flex justify-center py-2 space-x-2">
                                {thumbnails.map((thumbnail, index) => (
                                    <div key={index} className={`w-16 h-16 border border-gray-600 cursor-pointer ${index === currentThumbnailIndex ? 'border-yellow-400' : ''}`} onClick={() => handleThumbnailClick(index)}>
                                        <img src={thumbnail.src} alt={thumbnail.alt} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 评论输入栏 */}
                        <div className="mt-6 bg-gray-800 p-4 rounded-lg text-white">
                            <h3 className="text-xl font-bold mb-4">发表评论</h3>
                            <form onSubmit={handleCommentSubmit}>
                                <textarea
                                    className="w-full p-2 mb-4 border border-gray-600 rounded-lg text-gray-900"
                                    rows="2"
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
                        <img src="/fengmian2.jpg" alt="宣传图" className="w-full h-1/2 object-cover mb-4" />
                        <div className="text-sm flex-1">
                            <p className="mb-2">游戏简介内容。游戏简介内容。游戏简介内容。游戏简介内容。游戏简介内容。游戏简介内容。</p>
                            <div className="mb-2">
                                <span className="font-bold">发行时间：</span> 2024年7月16日
                            </div>
                            <div className="mb-2">
                                <span className="font-bold">用户评分：</span> 8.5
                            </div>
                            <div className="mb-2">
                                <span className="font-bold">总体评价：</span> 特别好评 (584)
                            </div>
                            <div className="mb-2">
                                <span className="font-bold">定位标签：</span> 动作, Rogue, 像素图形
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
                        <img src={mainImage} alt="放大展示图" className="max-w-full max-h-full" onClick={(e) => e.stopPropagation()} />
                    </div>
                </div>
            )}
        </BackgroundDiv>
    );
}

GameDetail.displayName = 'GameDetail';

export default GameDetail;
