// pages/api/query.js

import { spawn } from 'child_process';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { input } = req.body;

    const process = spawn('python', ['src/app/api/RAG/RAG.py', input]);

    let data = '';
    for await (const chunk of process.stdout) {
      data += chunk;
    }
    let error = '';
    for await (const chunk of process.stderr) {
      error += chunk;
    }

    const exitCode = await new Promise((resolve, reject) => {
      process.on('close', resolve);
    });

    if (exitCode) {
      return res.status(500).json({ error });
    }

    return res.status(200).json({ response: data });
  } else {
    // 不支持除POST以外的方法
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}