'use client'
import { supabase } from "@/lib/api";
import Link from 'next/link';
import useUserStore from '@/lib/useUserStore';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import React from 'react';
import { BiLogOut } from "react-icons/bi";

// 背景
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

//文本框反馈动画
const AnimatedInput = styled.input`
  block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6;
  
  &:focus {
    animation: focusAnimation 0.3s ease forwards;
  }

  @keyframes focusAnimation {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 rgba(255, 255, 255, 0.90);
    }
    100% {
      transform: scale(1.02);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.90);
    }
  }
`;

// 深色按钮
const DarkButton = styled.button`
  background-color: #333; /* 深灰色背景 */
  color: #fff; /* 白色文字 */
  &:hover {
    background-color: #444; /* 鼠标悬浮时更深的灰色 */
  }
`;

// 深色文字
const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #333; /* 深灰色文字 */
  margin-bottom: 1rem;
`;

// 调整SVG和标题的容器样式
const SvgTitleContainer = styled.div`
  margin-top: 0.01rem; /* 减少上方留白 */
  display: flex;
  align-items: center;
`;

export default function Home() {
  const { setUser, user } = useUserStore();  /* 记录用户状态 */
  const router = useRouter();
  
  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();  // 阻止表单的默认提交行为
    const form = event.target as HTMLFormElement;
    const name = form.elements.namedItem('name') as HTMLInputElement;
    const password = form.elements.namedItem('password') as HTMLInputElement;

    // 从数据库中查询是否存在该用户名
    const { data: userData, error: userError } = await supabase
        .from('user')
        .select("*")
        .eq('name', name.value)
        .single(); // Assuming 'name' should be unique

    if (userError || !userData) {
        console.error('Error fetching user:', userError);
        alert("Account not exists.");
        return;
    }

    // 检查密码是否匹配
    if (userData.password !== password.value) {
        alert("Password is wrong.");
        return;
    }

    setUser({id: userData.id, name: userData.name, password: userData.password});   /* 设置用户信息 */
    router.push('/dashboard'); 
  }

  return (
    <BackgroundDiv>
      <FormContainer>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm flex justify-center items-center">
        <SvgTitleContainer>
            <svg width="100" height="100" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M609.9 345.8c-6.7 0-17.9 6.7-29 11.2-20.1 8.9-42.4 20.1-67 20.1-22.3 0-46.9-11.2-67-20.1-13.4-4.5-26.8-11.2-31.3-11.2-73.7 0-131.8 151.8-131.8 252.3 0 22.3 2.2 42.4 8.9 53.6 6.7 13.4 13.4 15.6 17.9 15.6 29 0 64.8-13.4 118.4-42.4 26.8-15.6 53.6-22.3 84.9-22.3h2.2c29 0 53.6 6.7 80.4 22.3 53.6 31.3 87.1 42.4 118.4 42.4 4.5 0 13.4-2.2 17.9-15.6 6.7-13.4 8.9-31.3 8.9-53.6-0.1-100.4-60.4-252.3-131.8-252.3z m-129.6 172h-29V549c-2.2 8.9-8.9 15.6-17.9 15.6-8.9 0-17.9-6.7-17.9-17.9v-29h-29c-8.9 0-17.9-6.7-17.9-17.9s6.7-15.6 17.9-15.6h29v-29c0-8.9 6.7-17.9 17.9-17.9s17.9 6.7 17.9 17.9v29h29c8.9 0 17.9 6.7 17.9 17.9s-8.9 15.7-17.9 15.7z m122.9 17.8c-18.5 0-33.5-15-33.5-33.5s15-33.5 33.5-33.5 33.5 15 33.5 33.5-15 33.5-33.5 33.5z" fill="#282828"></path>
              <path d="M511.6 103c-225.9 0-409 183.1-409 409s183.1 409 409 409 409-183.1 409-409-183.1-409-409-409z m252.3 564.4c-11.2 20.1-29 33.5-51.4 33.5-35.7 0-75.9-13.4-134-46.9-22.3-13.4-44.7-17.9-67-17.9-24.6 0-46.9 4.5-69.2 17.9-58.1 33.5-98.3 46.9-134 46.9-20.1 0-38-11.2-49.1-33.5-8.9-17.9-11.2-40.2-11.2-69.2 0-113.9 67-285.8 165.2-285.8 13.4 0 26.8 6.7 44.7 13.4 17.9 6.7 35.7 15.6 53.6 15.6 15.6 0 35.7-8.9 53.6-15.6 15.6-6.7 31.3-13.4 44.7-13.4 100.5 0 165.2 171.9 165.2 285.8 0.1 29-4.4 51.3-11.1 69.2z" fill="#282828"></path>
            </svg>
          <Title className="ml-4">STREAM</Title>
        </SvgTitleContainer>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          
          <form className="space-y-6" action="#" method="POST" onSubmit={handleSignIn}>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">用户名</label>
                <div className="text-sm">
                    <Link href="/register" className="font-semibold text-grey-600 hover:text-grey-500">点此创建新用户</Link>
                </div>
              </div>
              <div className="mt-2">
                <AnimatedInput id="name" name="name" type="name" autoComplete="name" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">密码</label>
              <div className="mt-2">
                <AnimatedInput id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
              </div>
            </div>

            <div>
              <DarkButton type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">登录</DarkButton>
            </div>
          </form>
        </div>
      </FormContainer>
    </BackgroundDiv>
  );
}
