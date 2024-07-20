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
    const [red,setRed] = useState('none')
    const [avg, setAvg] = useState(0.0)
    const [reputation, setReputation] = useState('无')
    const [totalNumber, setTotalNumber] = useState(0)
    const router = useRouter();

    const handleThumbnailClick = (index: number) => {
        setCurrentThumbnailIndex(index);
        const isVideo = thumbnails[index].type === 'video';
        setVideoPlay(isVideo); // 如果是视频，设置 videoPlay 为 true
        if (!isVideo) {
            setIsPaused(false); // 如果不是视频，立即恢复轮播
        }
    };

    const handleMouseOver = useCallback((index: number) => {
        setHoverRating(index);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoverRating(0);
    }, []);

    useEffect(() => {
        if (isFavorite || isHovered) {
            setRed('red')
        } else {
            setRed('none')
        }
    }, [isFavorite, isHovered])

    const handleFavorite = async () => {
        const newFavoriteStatus = !isFavorite;   // 先用一个变量把 isFavorite 存起来，别上来就 setIsFavorite(!isFavorite)，这个操作有延迟，可能向后续判断传输老数据
        
        // 如果 newFavoriteStatus === true
        if (newFavoriteStatus) {
            // 首先查询是否存在相应的记录
            const { data: existing, error: queryError } = await supabase
                .from("collections")
                .select('g_ids')
                .eq('u_id', user.u_id)

            if (queryError) {
                console.error('Error querying existing data:', queryError);
                return;
            } 
            // 如果不存在该用户的 收藏 记录则为他创建
            else if (existing && existing.length === 0){
                const {error: updateError } = await supabase
                    .from('collections')
                    .insert({ 'u_id': user.u_id, 'g_ids': game.g_id + "---"})
                if (updateError) {
                    console.error('Error updating data:', updateError);
                } else {
                    console.log('Data updated successfully');
                }
                console.log("1 不存在用户收藏记录，已创建")
                setIsFavorite(newFavoriteStatus)
            } 
            // 如果存在该用户的 收藏 记录则判断其中是否有当前的 game.g_id
            else if (existing && existing.length > 0) {
                const temp = existing[0].g_ids
                // 如果用户的收藏为空则直接更新 g_ids
                if (temp.length === 0){
                    const {error: updateError} = await supabase
                        .from('collections')
                        .update({"g_ids": game.g_id + "---"})
                        .eq('u_id', user.u_id)
                    if (updateError) {
                        console.error('Error updating data:', updateError);
                    } else {
                        console.log('Data updated successfully');
                    }
                    console.log("2 用户收藏从无到有")
                    setIsFavorite(newFavoriteStatus)
                } 
                // 如果用户收藏不为空则首先判断是否存在该 g_id
                else if (temp.length > 0) {
                    const array = temp.split('---').filter(Boolean)      // 使用 Boolean 来过滤掉空字符串
                    // 如果存在则不操作
                    if (array.includes(String(game.g_id))) {
                        return
                    } 
                    // 如果不存在则在 g_ids 后补充该 g_id
                    else {
                        const {error: updateError} = await supabase
                        .from('collections')
                        .update({"g_ids": temp + game.g_id + "---"})
                        .eq('u_id', user.u_id)
                        if (updateError) {
                            console.error('Error updating data:', updateError);
                        } else {
                            console.log('Data updated successfully');
                        }
                        console.log("3 在已有的收藏记录后补充了新的")
                        setIsFavorite(newFavoriteStatus)
                    }
                }
            }
        } 
        // 如果 newFavoriteStatus === False
        else {
            // 首先查询该用户的收藏记录是否存在
            const { data: existing, error: queryError } = await supabase
                .from("collections")
                .select('g_ids')
                .eq('u_id', user.u_id)
            if (queryError) {
                console.error('Error querying existing data:', queryError);
                return;
            } 

            // 如果存在则判断收藏记录中是否包含该 g_id
            if (existing && existing.length > 0) {
                const temp = existing[0].g_ids
                // 如果用户的收藏为空则不操作
                if (temp.length === 0){
                    return
                } 
                // 如果收藏不为空则判断是否包含该 g_id
                else if (temp.length > 0) {
                    const array = temp.split('---').filter(Boolean)      // 使用 Boolean 来过滤掉空字符串
                    console.log(array)
                    // 如果存在则删除该 g_id
                    if (array.includes(String(game.g_id))) {
                        // 如果存在则删除该 g_id
                        const index = array.indexOf(String(game.g_id));
                        if (index !== -1) {
                            array.splice(index, 1); // 从数组中删除位于 index 的元素
                        }
                        const { error: updateError } = await supabase
                                .from('collections')
                                .update({ "g_ids": array.join('---') + '---'})
                                .eq('u_id', user.u_id);
                            
                            if (updateError) {
                                console.error('Error updating data:', updateError);
                            } else {
                                console.log('Data updated successfully');
                            }
                        
                        setIsFavorite(newFavoriteStatus);
                        }
                    } 
                    // 如果不存在则不操作
                    else {
                        return
                    }
                }
        }
    };

    const handleClick = useCallback(async (index: number) => {
        setCurrentRating(index);
        console.log(user.u_id, user.name, user.password);
    
        // 首先查询是否存在相应的评分记录
        const { data: existingData, error: queryError } = await supabase
            .from('ratings')
            .select('*')
            .eq('u_id', user.u_id)
            .eq('g_id', game.g_id);
    
        if (queryError) {
            console.error('Error querying data from Supabase', queryError);
            return;
        }
    
        // 如果存在记录，先删除
        if (existingData && existingData.length > 0) {
            const { error: deleteError } = await supabase
                .from('ratings')
                .delete()
                .match({ u_id: user.u_id, g_id: game.g_id });
    
            if (deleteError) {
                console.error('Error deleting existing rating', deleteError);
                return;
            }
        }
    
        // 插入新的评分记录
        const { data, error } = await supabase
            .from('ratings')
            .insert([
                {
                    u_id: user.u_id,
                    g_id: game.g_id,
                    rating: index
                }
            ]);
    
        if (error) {
            console.error('Error inserting data into Supabase', error);
        } else {
            console.log('Data inserted successfully', data);
        }
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
       setVideoPlay(true)
       setVideoEnded(false)
    };

    // 视频播放结束
    const handleVideoEnded = () => {
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
    }, [setUser]);

    const loadCurrentRating = useCallback(async () => {
        // 首先查询是否存在相应的评分记录
        const { data: existingData, error: queryError } = await supabase
            .from('ratings')
            .select('*')
            .eq('u_id', user?.u_id)
            .eq('g_id', game?.g_id);
    
        if (queryError) {
            console.error('Error querying data from Supabase', queryError);
            return;
        }
    
        // 如果存在记录，设置当前评分
        if (existingData.length > 0) {
            setCurrentRating(existingData[0].rating); // 假设每个用户和游戏组合只有一个评分记录
        } else {
            // 如果没有找到评分记录，可以选择设置一个默认评分或清除当前评分
            setCurrentRating(0); // 或者设置默认值，如 setCurrentRating(0);
        }
    }, []);

    const loadFavorite = useCallback(async () => {
        // 首先查询是否存在该用户的收藏记录
        const { data: existing, error: queryError } = await supabase
            .from('collections')
            .select('g_ids')
            .eq('u_id', user?.u_id)
    
        if (queryError) {
            console.error("Error querying data from Supabase", queryError);
        }
        // 如果不存在该用户的收藏记录则保持 isFavorite 为 false
        else if (existing && existing.length === 0){
            setIsFavorite(false)
        }
        // 如果存在该用户的收藏记录则判断其中是否包含当前 g_id
        else if (existing && existing.length > 0) {
            const temp = existing[0].g_ids
            // 如果用户收藏为空
            if (temp.length === 0) {
                setIsFavorite(false)
                setRed('none')
            }
            // 如果用户收藏不为空则判断是否存在该 g_id
            else if ( temp.length > 0) {
                const array = temp.split('---').filter(Boolean)      // 使用 Boolean 来过滤掉空字符串
                    // 如果存在
                    if (array.includes(String(game.g_id))) {
                        setIsFavorite(true)
                        setRed('red')
                    } 
                    // 如果不存在
                    else {
                        setIsFavorite(false)
                        setRed('none')
                    }
            }
        }
    }, []);

    const loadAvgRating = useCallback(async () => {
        // 从 rating 中收集该游戏的所有评分
        const {data: data, error: error} = await supabase
            .from("ratings")
            .select('rating')
            .eq('g_id', game?.g_id)
            
        if (error) {
            console.error('Error querying data from Supabase', error);
            return;
        }

        // 如果存在评分记录，则计算平均分数
        if (data && data.length > 0) {
            let totalSum = data.reduce((acc, curr) => acc + curr.rating, 0);
            let average = totalSum / data.length;
            average = parseFloat(average.toFixed(1))
            setAvg(average);
            /* console.log("平均评分已设置：" + avg) */
            setTotalNumber(data.length)   // 记录评分的用户数量

            if (average >= 8) {
                setReputation("特别好评")
            } else if (average >= 6 && average <8) {
                setReputation("多半好评")
            } else if (average >= 4 && average <6) {
                setReputation("中规中矩")
            } else if (average >= 2 && average <4) {
                setReputation("多半差评")
            } else if (average >= 0 && average <2) {
                setReputation("特别差评")
            }
        }
    }, [])

    const updateAvgRating = useCallback(async () => {
        console.log("平均评分已设置：" + avg)
        const {error: error } = await supabase
            .from("game")
            .update({"avg_rating": avg})
            .eq("g_id", game.g_id)
        if (error) {
            console.error('Error updating data:', error);
        } else {
            console.log('Data updated successfully');
        }
    },[avg])

    useEffect(() => {
        // 页面加载时自动滚动到顶部
        window.scrollTo(0, 0);
        // 查看是否存在评分，如果存在则自动渲染
        loadCurrentRating();
        // 查看是否收藏，如果存在则自动渲染
        loadFavorite();
        // 计算平均评分
        loadAvgRating()
    }, [router]); 

    useEffect(() => {
        updateAvgRating()
    },[avg])

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
    }, [isPaused]);

    useEffect(() => {
        setCurrentMedia({
            src: thumbnails[currentThumbnailIndex].src,
            type: thumbnails[currentThumbnailIndex].type
        });
        if (currentMedia.type !== 'video') {
            setVideoPlay(false)
            setVideoEnded(true)
        }
    }, [currentThumbnailIndex]); 
    
    useEffect(() => {
        // 在这里处理暂停逻辑
        if (videoPlay) {    
            setIsPaused(true); // 当视频播放时停止轮播
        } else if (pauseDueToHover) {
            setIsPaused(true); // 鼠标悬停时停止轮播
        } else if (videoEnded) {
            setIsPaused(false); // 视频结束后恢复轮播
        } else if (isModalOpen) {
            setIsPaused(true); // 查看图像时停止轮播
        } else {
            setIsPaused(false); // 其他情况下继续轮播
        }
    }, [videoPlay, pauseDueToHover, videoEnded, isModalOpen]); // 更新依赖列表以包含 videoPlay

    useEffect(() => {
        setMainImage(thumbnails[currentThumbnailIndex].src);
    }, [currentThumbnailIndex]);

    if (!isHydrated) {
        // 避免客户端和服务端渲染结果不一致的问题
        return null;
    }

    const test = (() => {
        console.log("我被点了")
    })    

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

            <div className="container mx-auto mt-12 mb-10 flex-1 rounded items-center justify-center overflow-hidden text-white">
                <div className="text-x text-gray-900">
                    {/* 子导航栏 */}
                    <div className="flex items-center px-4 py-3 bg-gray-600 justify-between text-white">
                        <ul className="flex items-center space-x-6">
                            <li>
                                <a href="#"
                                   className='flex flex-row w-full hover:text-gray-400 text-white text-sm leading-5'>
                                    您的商店
                                </a>
                            </li>
                            <li>
                                <a href="#"
                                   className='flex flex-row w-full hover:text-gray-400 text-white text-sm leading-5'>
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
                        </div>
                        <div className="bottom left-0 right-0  bg-opacity-50 flex justify-center py-2 space-x-2">
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
                                <span className="font-bold">用户评分：</span> {avg}
                            </div>
                            <div className="mb-2">
                                <span className="font-bold">总体评价：</span> {reputation} ({totalNumber})
                            </div>
                            <div className="mb-2">
                                <span className="font-bold">定位标签：</span> {game?.style}
                            </div>
                            <div className="mt-4 flex items-center space-x-2">
                                {/* 评分图标 */}
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
                                {/* 收藏图标 */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill={red}
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-6 cursor-pointer"
                                    onClick={handleFavorite}
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
