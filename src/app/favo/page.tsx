'use client'
import { supabase } from "@/lib/api";
import Link from 'next/link';
import Head from 'next/head';
import useUserStore from '@/lib/useStore';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import Image from 'next/image';

//背景
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

export default function Wishlist() {
    return (
      <BackgroundDiv>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
          <Head>
            <title>愿望单 - WNZHENG1125</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
    
          <main style={{ maxWidth: '800px', width: '100%' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>WNZHENG1125 的愿望单</h1>
            <input type="text" placeholder="按名称或标签搜索" style={{ width: '100%', padding: '10px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '5px' }} />
    
            {/* 游戏列表 */}
            <div style={{ width: '100%' }}>
              {/* 游戏项 */}
              <div style={{ border: '1px solid #eee', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Counter-Strike 2</h2>
                <p>特别好评</p>
                <p>￥ 103.00</p>
                <p>第一人称射击 射击 多人 竞技 动作</p>
                <p>发行日期：2012年8月22日</p>
                <button style={{ padding: '10px 20px', border: 'none', borderRadius: '5px', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}>添加至购物车</button>
                <p>添加日期：2024/7/17 (移除)</p>
              </div>
              {/* 其他游戏项... */}
            </div>
          </main>
    
          {/* 页脚 */}
          <footer style={{ marginTop: '20px' }}>
            {/* 页脚内容 */}
          </footer>
        </div>
      </BackgroundDiv>
    );
  }
