from flask import Flask, request, jsonify
from flask_cors import CORS
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.llms.mistralai import MistralAI
from llama_index.embeddings.mistralai import MistralAIEmbedding
from llama_index.core.indices.service_context import ServiceContext
from llama_index.core.query_engine import RetrieverQueryEngine
from gevent import pywsgi
import os

# 从环境变量中读取 API 密钥（首先在 python 终端中执行：set MISTRAL_API_KEY=your_api_key）
""" api_key = os.environ.get("MISTRAL_API_KEY") """

app = Flask(__name__)
CORS(app)  # 允许所有域名访问

reader = SimpleDirectoryReader("public/data")
documents = reader.load_data()

llm = MistralAI(api_key=api_key, model="mistral-large-latest")
embed_model = MistralAIEmbedding(model_name="mistral-embed", api_key=api_key)
service_context = ServiceContext.from_defaults(llm=llm, embed_model=embed_model)

index = VectorStoreIndex.from_documents(documents, service_context=service_context)

query_engine = index.as_query_engine(similarity_top_k=5)

@app.route('/query', methods=['POST'])
def query():
    data = request.get_json()
    user_input = data.get('input')
    base_prompt = "你叫小爱，是 STREAM 游戏推荐平台的助手。你的责任是回答用户提出的关于游戏的问题。除了游戏名称可以用英文回答外，默认情况下均使用中文作答。"
    full_query = base_prompt + " " + user_input
    response = query_engine.query(full_query)
    return jsonify(str(response))

if __name__ == '__main__':
    server = pywsgi.WSGIServer(('0.0.0.0',5000),app)
    server.serve_forever()