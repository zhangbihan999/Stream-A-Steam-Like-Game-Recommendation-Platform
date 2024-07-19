'use client'
import React, { useState, useEffect, CSSProperties, useRef} from 'react';
import useUserStore from "@/lib/useUserStore";
import useGameStore from "@/lib/useGameStore";
import { supabase } from "@/lib/api";
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/navigation'
import styled from '@emotion/styled';
import Image from 'next/image';
import Carousel from '@/components/carousel/Carousel';
import { link } from 'fs';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSpring, animated } from 'react-spring';

// 背景
const BackgroundDiv = styled.div`
  background-image: url('/fengmian2.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* Center the form container */
  padding: 2rem;
  position: relative;
  margin: 0;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 3, 15, 0.09); /* 半透明黑色覆盖层 */
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

// 半透明框父容器
const CenteredContainer = styled.div`
  display: flex; /* 使用Flexbox布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 22vh; /* 调整白色半透明容器之间的距离(宽度比例) */
  margin-bottom: -2rem;
`;

// 黑色半透明框（链接版）
const FormContainer = styled.a`
  background: rgba(0, 0, 0, 0.70);
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
  color: hsl(0, 0%, 75%);

  &:last-child {
    margin-bottom: 0;
  }     

  &:hover {
    background: rgba(50, 30, 50, 0.80);  
    transform: scale(1.02);
    color: white;
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

// 按钮设置
const ImageButton = ({ imageUrl, onClick }) => {
  return (
    <button onClick={onClick} style={{
      border: 'none',
      background: 'none',
      position: 'relative', // 设置相对定位
      top: '7px', // 假设红框的顶部距离是50px
      right: '0',
      cursor: 'ns-resize' // 确保鼠标悬停时显示为指针
    }}>
      <img src="butt.png" alt="Image Button" style={{ width: '25px', height: '40px' }} />
    </button>
  );
};

// 灰色实线(竖线)
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

// 传图接口
interface CustomElementProps {
  imageUrl: string;
  buttonStyleUrl: string;
}


// 标号
const Label = ({ text, style }) => {
  return (
    <div className="label" style={style}>
      {text}
    </div>
  );
};

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const DraggableContainer = ({ id, index, moveContainer, children }) => {
  const ref = React.useRef(null);
  const [, drop] = useDrop({
    accept: 'container',
    hover(item: DragItem) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveContainer(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'container',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </div>
  );
};


const CustomElement: React.FC<CustomElementProps> = ({ imageUrl, buttonStyleUrl }) => {
  const { user, logout, setUser } = useUserStore();
   // 定义用户信息
   const userInfo = {
    id: '12345',
    name: 'Wang Naizheng',
    password: 'encrypted_password' // 加密后的密码
};
const [isHydrated, setIsHydrated] = useState(false); // 用于确保客户端渲染和服务端渲染一致
const { game, setGame, exit } = useGameStore();  /* 游戏状态 */

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

const [showPassword, setShowPassword] = useState(false);

const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
}

  const initialContainerData = [
    { id: 1, img: 'fengmian1.jpg', title: 'Counter-Strike 2', tags: ['第一人称射击', '射击', '多人', '竞技', '动作'], date: '2012 年 8 月 22 日', rating: '特别好评' },
    { id: 2, img: 'fengmian2.jpg', title: 'Counter-Strike 2', tags: ['第一人称射击', '射击', '多人', '竞技', '动作'], date: '2012 年 8 月 22 日', rating: '特别好评' },
    { id: 3, img: 'fengmian1.jpg', title: 'Counter-Strike 2', tags: ['第一人称射击', '射击', '多人', '竞技', '动作'], date: '2012 年 8 月 22 日', rating: '特别好评' },
    { id: 4, img: 'fengmian2.jpg', title: '好好好', tags: ['第一人称射击', '射击', '多人', '竞技', '动作'], date: '2012 年 8 月 22 日', rating: '特别好评' },
    { id: 5, img: 'fengmian1.jpg', title: '牛牛牛', tags: ['第一人称射击', '射击', '多人', '竞技', '动作'], date: '2012 年 8 月 22 日', rating: '特别好评' },
    { id: 6, img: 'fengmian2.jpg', title: '王乃正', tags: ['第一人称射击', '射击', '多人', '竞技', '动作'], date: '2012 年 8 月 22 日', rating: '特别好评' },
    { id: 7, img: 'fengmian1.jpg', title: '严耀祖', tags: ['第一人称射击', '射击', '多人', '竞技', '动作'], date: '2012 年 8 月 22 日', rating: '特别好评' },
    { id: 8, img: 'fengmian2.jpg', title: '张琛', tags: ['第一人称射击', '射击', '多人', '竞技', '动作'], date: '2012 年 8 月 22 日', rating: '特别好评' },
  ];

  const [containerData, setContainerData] = useState(initialContainerData);

  const moveContainer = (dragIndex, hoverIndex) => {
    const newContainerData = [...containerData];
    const [removed] = newContainerData.splice(dragIndex, 1);
    newContainerData.splice(hoverIndex, 0, removed);

    setContainerData(newContainerData);
  };

  return (
    <DndProvider backend={HTML5Backend}>
    <BackgroundDiv style={{ margin: 0, padding: 0 }}>
        <div className="text-x text-gray-900 w-full">
            {/* 导航栏 */}
            <nav className="flex items-center px-4 py-5 bg-gray-900 justify-between w-full">
                <div className="text-white flex items-center space-x-4">
                    <div className='flex flex-row items-center pr-4'>
                        <a href="#">
                            <img src="/game new.svg" width="80" height="35" alt="Steam 主页链接" />
                        </a>
                        <label htmlFor="#" className='text-2xl'>STREAM</label>
                    </div>
                    <ul className="flex items-center space-x-6">
                        <li>
                            <a href="/dashboard" className="hover:text-gray-400 text-white">商店</a>
                        </li>
                        <li>
                            <a href="/favo" className="hover:text-gray-400 text-white">个人中心</a>
                        </li>
                        <li>
                            <a href="/dashboard/LeaderBoard" className="hover:text-gray-400 text-white">排行榜</a>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col justify-center space-y-2">
                    <label htmlFor="#" className="text-xl text-white px-2">{user?.name}</label>
                    <Link href="/login" className="upgrade-btn active-nav-link text-white text-sm px-2 hover:text-blue-500 hover:underline" onClick={() => logout()}>退出账户</Link>
                </div>
            </nav>
        </div>

        <div className="flex items-center px-4 py-3 bg-gray-600 justify-between w-full">
            {/* 子导航栏 */}
            <div className="flex items-center px-4 py-3 bg-gray-600 justify-between mt-30 w-full z-500">
                <ul className="flex items-center space-x-6">
                    <li>
                        <a href="#" className='flex flex-row w-full hover:text-gray-400 text-white text-sm leading-5'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-5 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
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
                    <input type="text" className="rounded bg-white-900 border border-gray-600 placeholder-gray-400 w-60 px-3 py-1" placeholder="搜索" />
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 flex items-center px-2">
                        <img src="/search.png" className='w-5' />
                    </div>
                </div>
            </div>
        </div>

        <div className="container mx-auto my-10 flex-1 flex flex-row rounded items-start justify-between w-full">
            {/* 个人信息部分 */}
            <aside className="w-full md:w-1/5 p-4 bg-gray-700 text-white overflow-y-auto mr-3">
                <h2 className="text-3xl font-bold mb-6">用户信息</h2>
                <div className="mb-6">
                    <label className="block text-gray-400 text-sm font-bold mb-2">用户ID:</label>
                    <p className="text-gray-200">{userInfo.id}</p>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-400 text-sm font-bold mb-2">用户名:</label>
                    <p className="text-gray-200">{userInfo.name}</p>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-400 text-sm font-bold mb-2">密码:</label>
                    <div className="flex items-center">
                        <p className="text-gray-200 mr-2">{showPassword ? userInfo.password : '********'}</p>
                        <button onClick={togglePasswordVisibility} className="bg-blue-500 text-white px-2 py-1 rounded">
                            {showPassword ? '隐藏' : '显示'}
                        </button>
                    </div>
                </div>
            </aside>

            {/* 收藏信息部分 */}
            <main className="flex-1">
                {containerData.map((data, index) => (
                    <DraggableContainer key={data.id} id={data.id} index={index} moveContainer={moveContainer}>
                        <CenteredContainer>
                            <FormContainer href="/login">
                                <FlexContainer>
                                    <div className="flex flex-col md:flex-row items-center">
                                        <div className="mr-2">
                                            <Label text={index + 1} style={{ margin: '0 10px 0 0' }} />
                                        </div>
                                        <div className="mr-7">
                                            <img src={data.img} alt="Image" className="w-40 md:w-64 h-24" />
                                        </div>
                                        <div className='mr-6'>
                                            <LineComponent />
                                        </div>
                                        <div className="flex-1">
                                            <h2>{data.title}</h2>
                                            <div className="tags">
                                                {data.tags.map((tag, i) => (
                                                    <span key={i}>{tag}</span>
                                                ))}
                                            </div>
                                            <div className="info">
                                                <div className="release-date">
                                                    <span>发行日期：</span>
                                                    <span>{data.date}</span>
                                                </div>
                                                <div className="rating">
                                                    <span>总体评价：</span>
                                                    <span>{data.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <ImageButton imageUrl={"/my-image.png"} onClick={CustomElement} />
                                        </div>
                                    </div>
                                </FlexContainer>
                            </FormContainer>
                        </CenteredContainer>
                    </DraggableContainer>
                ))}
            </main>
        </div>
    </BackgroundDiv>
</DndProvider>

);
};

export default CustomElement;