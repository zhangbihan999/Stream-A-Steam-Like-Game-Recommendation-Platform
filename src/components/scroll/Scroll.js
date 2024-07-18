import { useState, useEffect } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import './scroll.css';
import { DiVim } from "react-icons/di";
import { supabase } from "@/lib/api";
import useGameStore from "@/lib/useGameStore";
import { useRouter } from 'next/navigation';

export default function Scroll() {
  const { game, setGame, exit } = useGameStore();  /* 游戏状态 */
  const [isPaused, setIsPaused] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(30); // 默认滚动速度
  const [animationDirection, setAnimationDirection] = useState('normal');
  const router = useRouter();
  const [games, setGames] = useState([]); // 存储游戏数据
   // 从 Supabase 获取游戏数据
   const fetchGames = async () => {
    const { data, error } = await supabase
        .from('game')
        .select('*')
        .in('g_id', [3,6,8,10,17,24])
    if (error) {
        console.error('Error fetching games:', error);
    } else {
        setGames(data);
    }
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleClick = (game) => {
    return () => {
        setGame(game); // 将点击的游戏设置为全局游戏状态
        router.push('/dashboard/GameDetail');  // 使用 Next.js 的 useRouter
    };
  };

  useEffect(() => {
    // 获取游戏数据
    fetchGames();
  })

  return (
    <div className="relative w-11/12 mx-auto">
      <div 
        className={`wrapper container flex h-40 relative overflow-hidden ${isPaused ? 'paused' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {games.map((game, index) => (
          <div key={index} className={`item  ${animationDirection}`}
            style={{
              animationDelay: `calc(${7 * (games.length - (index + 1))}s * -1)`,
              animationDuration: `${7 * games.length}s` 
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img src={game?.face_img} alt={`slide ${index}`} className="w-full h-full object-cover hover:cursor-pointer hover:opacity-75"
              onClick={handleClick(game)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
