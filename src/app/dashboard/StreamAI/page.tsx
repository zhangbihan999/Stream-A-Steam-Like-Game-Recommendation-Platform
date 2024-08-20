"use client";
import Link from 'next/link';
import useUserStore from "@/lib/useUserStore";
import useGameStore from "@/lib/useGameStore";
import styled from '@emotion/styled';
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from "@/lib/api";
import { useRouter } from 'next/navigation'; // 从 next/navigation 导入 useRouter
import axios from 'axios'; // 导入 axios

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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSendMessage = async () => {
        /* if (input.trim()) {
            const newMessage = {
                text: input,
                isUser: true,
            };
            setMessages([...messages, newMessage]);
            setInput('');

            try {
                const response = await axios.post('http://localhost:5000/query', { input });
                const generatedText = response.data;
                setMessages(prevMessages => [
                    ...prevMessages,
                    { text: generatedText, isUser: false }  // 显示 AI 的回答
                ]);
            } catch (error) {
                console.error('Failed to get response from AI model:', error);
            }
        } */
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
                            onKeyDown={handleKeyDown}  // 添加 onKeyDown 事件监听
                            placeholder="请输入内容....."
                        />
                        <SendButton onClick={handleSendMessage}>Send</SendButton>
                    </ChatInputContainer>
                </ChatContainer>
            </ContentContainer>
        </BackgroundDiv>
    );
}
