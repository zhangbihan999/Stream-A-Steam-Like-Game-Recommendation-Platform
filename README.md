This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Getting Started

#### npm

First, run the development server:

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

If the system say that you haven’t install ‘next’ yet, then run the following command to install:

```
npm install next react react-dom
```

Then run:

```
npm run dev
```

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

#### tailwindcss

```
# 安装 tailwIndcss
npm install -D tailwindcss postcss autoprefixer
# 初始化 tialwindcss。完成这一步之后，文件列表将出现一个`tailwind.config.js`文件
npx tailwindcss init -p
```

将`tailwind.config.js`修改如下：

```
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

将`src/app/globals.css`修改如下：

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

打开`src/app/page.tsx`，将内容修改如下，这里，我们在 classname 中通过使用 tailwindcss 提供的组件便能够直接操控 css 样式.

```
export default function Home() {
  return <div className="text-red-500">hello world</div>
}
```

运行`npm run dev`，进入本地的3000端口，如果页面正确展现了红色的 hello world，即设置成功。