### Getting Start

### 启动后端服务器

如果你想体验 StreamAI 服务，请首先运行`src/app/api/RAG/RAG.py`文件以启动后端服务器。

这一步需要提供您的 api key，我们使用的模型是 Mistral，如果您使用其他模型，记得修改从 llamaindex 引入的库的名称。

> 例如：您如果使用 OpenAI，则将`from llama_index.llms.mistralai import MistralAI`修改为`from llama_index.llms.openai import OpenAI`，然后设置 api key。

### 启动前端服务器

运行`npm run dev`，然后进入`http://localhost:3000`查看界面。

如果系统报错：`you haven’t install ‘next’ yet`, 则运行下面这行命令：

```
npm install next react react-dom
```

再执行`npm run dev`。