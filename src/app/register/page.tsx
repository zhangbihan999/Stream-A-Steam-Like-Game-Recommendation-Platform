'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import { supabase } from "@/lib/api";
import styled from '@emotion/styled';

const BackgroundDiv = styled.div`
  background-image: url('/fengmian1.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* Center the form container horizontally */
  padding: 2rem;
`;

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.90); /* Semi-transparent white background */
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(255, 255, 255, 155);
  width: 100%; /* Make sure the container doesn't exceed the screen width */
  max-width: 500px; /* Adjust to the desired max width */
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


export default function Home() {
  const [mode, setMode] = useState('User');
  const [authorityCode, setAuthorityCode] = useState('');

  // 生成八位随机 id
  function generateEightDigitId() {
    return Math.floor(Math.random() * 90000000) + 10000000;
  } 

  // 函数用于向 'user' 表添加新用户
  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();  // 禁止刷新界面
    const form = event.target as HTMLFormElement;
    const name = form.elements.namedItem('name') as HTMLInputElement;
    const password = form.elements.namedItem('password') as HTMLInputElement;
    const check = form.elements.namedItem('check') as HTMLInputElement;
    const id = generateEightDigitId();

    if (check.value !== password.value) {
      alert("The two passwords are different");
      return;
    }

    const { data, error } = await supabase
      .from('user')
      .insert([
        { 
          u_id: id,
          name: name.value,
          password: password.value,
        }
      ]);

    if (error) {
      console.error('Error inserting data: ', error);
      alert("Error creating account.");
    } else {
      console.log('Data inserted: ', data);
      alert("Account Created! Let's sign in!");
      window.location.href = '/login'; // 导航到登录界面
    }
  }

  return (
    <BackgroundDiv>
      <FormContainer>
        <div className="flex min-h-full flex-col justify-center px-6 pt-6 pb-12 lg:px-8">
          {/* <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">注册</h2>
          </div> */}
    
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" action="#" method="POST" onSubmit={handleSignUp}>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">用户名</label>
                </div>
                <div className="mt-2">
                  <AnimatedInput id="name" name="name" type="text" autoComplete="name" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
              </div>
    
              <div>
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">密码</label>
                <div className="mt-2">
                  <AnimatedInput id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
              </div>

              <div>
                  <label htmlFor="check" className="block text-sm font-medium leading-6 text-gray-900">确认密码</label>
                <div className="mt-2">
                  <AnimatedInput id="check" name="check" type="password" autoComplete="check" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
              </div>
    
              <div>
                <DarkButton type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">注册</DarkButton>
              </div>
            </form>

          </div>
        </div>
      </FormContainer>
    </BackgroundDiv>
  )
}
