'use client'
import { supabase } from "@/lib/api";
import Link from 'next/link';
import useUserStore from '@/lib/useStore';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';

// 将 SVG 内容嵌入 styled-component
const BackgroundDiv = styled.div`
  background-image: url('fengmian1.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
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
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST" onSubmit={handleSignIn}>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">用户名</label>
              <div className="text-sm">
                  <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">点此创建新用户</Link>
              </div>
            </div>
            <div className="mt-2">
              <input id="name" name="name" type="name" autoComplete="name" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">密码</label>
            <div className="mt-2">
              <input id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>
          </div>

          <div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">登录</button>
          </div>
        </form>
      </div>
    </BackgroundDiv>
  );
}
