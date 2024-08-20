<div align="center">
  <h1>Stream: A Steam-Like Game Recommendation Platform</h1>
  <p align="center">
    &#128195 <a href="https://stream-game-app.vercel.app/">App URL</a> • 
    &#128568; <a href="https://www.youtube.com/watch?v=IxnQsugQXB4">Demo Video</a> • 
  </p>
</div>
![alt text]([https://asdfdasgasd.oss-cn-chengdu.aliyuncs.com/typora_pictures/202408202322813.png](https://github.com/zhangbihan999/Stream-A-Steam-Like-Game-Recommendation-Platform/blob/zc/public/readme_show.png))

<br/>

## Quick Start

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000/) with your browser to see the result.

If the system show such an error: `you haven’t install ‘next’ yet`, then run the command below:

```
npm install next react react-dom
```

Actually, there are many other modules need to be downloaded before you can run the project, just follow the warnings and download these modules.  

## Code Structure (Only src)

- `app/`

	- `dashboard/`
		- `favo/page.tsx`: The content of page “个人中心”
		- `GameDetail/page.tsx`: Once you click into a game, you will come to this page with the details of this game
		- `LeaderBoard/page.tsx`: The content of page “排行榜”
		- `Search/page.tsx`: The content of page “搜索”, which is in the subnavigation bar
		- `StreamAI/page.tsx`: The content of page “STREAM AI”, which is in the subnavigation bar

	- `login/page.tsx`: The content of ‘login’ page
	- `register/page.tsx`: The content of ‘register’ page

- `components/`

	- `carousel/`
		- `carousel.css`: Styles used in `Carousel.js`
		- `Carousel.js`: Main content of the carousel showed in `dashboard/`
	- `scroll/`
		- `scroll.css`: Styles used in `Scroll.js`
		- `Scroll.js`: Main content of the scroll showed in `dashboard/`
	- `loading.tsx`: Define the LoadingOverlay during page switching

- `lib/`

	- `api.js`: Build the connection with @supabase
	- `useGameStore.js`: Use @zustand to set global game variable
	- `useUserStore.js`: Use @zustand to set global user variable

## Acknowledgments

Thanks to @Pherenice1125 and @Charlie-0325, the other two contributors of this project.

Just in memory of our sophomore summer training, it was your company made that brief time so precious.
