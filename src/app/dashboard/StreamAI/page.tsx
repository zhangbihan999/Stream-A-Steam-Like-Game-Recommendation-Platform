"use client";
import Link from 'next/link';
import useUserStore from "@/lib/useUserStore";
import useGameStore from "@/lib/useGameStore";
import styled from '@emotion/styled';
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from "@/lib/api";
import { useRouter } from 'next/navigation'; // 从 next/navigation 导入 useRouter

const BackgroundDiv = styled.div`
    background-image: url('/fengmian2.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const ChatContainer = styled.div`
    background: rgba(16, 24, 39, 0.9);
    border-radius: 10px;
    width: 70%;
    max-width: 80%;
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    padding-bottom: 30px;
`;

const ChatHeader = styled.div`
    background: #374051;
    padding: 10px 20px;
    color: #fff;
    font-size: 1.2rem;
    text-align: center;
`;

const ChatMessages = styled.div`
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Message = styled.div<{ isUser: boolean }>`
    background: ${({ isUser }) => (isUser ? 'rgb(192, 192, 192)' : '#e2e2e2')};
    color: ${({ isUser }) => (isUser ? '#000' : '#000')};
    padding: 10px;
    border-radius: 10px;
    align-self: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
    max-width: 70%;
    word-wrap: break-word;
`;

const ChatInputContainer = styled.div`
    display: flex;
    padding: 10px;
    background: #374051;
    border-top: 1px solid #374051;
`;

const ChatInput = styled.input`
    flex: 1;
    padding: 10px;
    border: 1px solid #101827;
    border-radius: 5px;
    font-size: 1rem;
    outline: none;
`;

const SendButton = styled.button`
    background: #374051;
    color: #fff;
    padding: 10px 20px;
    margin-left: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.3s;

    &:hover {
        background: rgba(192, 192, 192, 0.5);
    }
`;

const SearchContainer = styled.a`
    display: flex;
    flex-direction: row;
    align-items: center;
    color: white;
    line-height: 1.25;
    background: rgba(192, 192, 192, 0.5);
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    transition: background 0.3s ease;
    &:hover {
        background: rgba(192, 192, 192, 0.8);
    }
`;

const Navbar = styled.nav`
    width: 100%;
    z-index: 1000;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 30px;
    background: #101827;
    color: white;
`;

const ContentContainer = styled.div`
    margin-top: -3%; /* 为内容增加顶部边距，确保不被导航栏遮挡 */
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export default function Home() {
    const { user, setUser, logout } = useUserStore();
    const { setGame } = useGameStore();
    const [isHydrated, setIsHydrated] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        setIsHydrated(true);
        const storedUserString = localStorage.getItem('user-storage');
        if (storedUserString) {
            const storedUser = JSON.parse(storedUserString);
            if (storedUser && storedUser.state && storedUser.state.user) {
                setUser(storedUser.state.user);
            }
        }
    }, [setUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (input.trim()) {
            const newMessage = {
                text: input,
                isUser: true,
            };
            setMessages([...messages, newMessage]);
            setInput('');
            try {
                const response = await fetch('src/lib/api/run-script.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userInput: input }),
                });
                const data = await response.json();
                if (response.ok) {
                    const content = data.stdout.output.choices[0].content;
                    setMessages(prevMessages => [...prevMessages, { text: content, isUser: false }]);
                } else {
                    console.error('Failed to execute script:', data.error);
                }
            } catch (error) {
                console.error('Network error:', error);
            }
        }
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    if (!isHydrated) {
        return null;
    }

    return (
        <BackgroundDiv>
            <Navbar>
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
            </Navbar>

            <ContentContainer>
                <div className="container mx-auto my-10 flex-1 rounded items-center justify-center">
                    <div className="text-x text-gray-900 mt-12">
                        <div className="flex items-center px-4 py-3 bg-gray-600 justify-between mt-12">
                            <ul className="flex items-center space-x-6">
                                <li>
                                    <a href="#"
                                       className='flex flex-row w-full hover:text-gray-400 text-white text-sm leading-5'>
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
                </div>

                <ChatContainer>
                    <ChatHeader>STREAM AI</ChatHeader>
                    <ChatMessages ref={messagesEndRef}>
                        {messages.map((msg, index) => (
                            <Message key={index} isUser={msg.isUser}>
                                {msg.text}
                            </Message>
                        ))}
                        <div ref={messagesEndRef} />
                    </ChatMessages>
                    <ChatInputContainer>
                        <ChatInput
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="请输入内容....."
                        />
                        <SendButton onClick={handleSendMessage}>Send</SendButton>
                    </ChatInputContainer>
                </ChatContainer>
            </ContentContainer>
        </BackgroundDiv>
    );
}
