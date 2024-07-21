import { exec } from 'child_process';

export const POST = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userInput } = req.body;
    const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: userInput },
    ];

    const command = `python3 src/app/dashboard/StreamAI/qwen_impl.py '${JSON.stringify(messages)}'`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: 'Failed to execute script' });
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).json({ error: 'Script execution error' });
        }
        try {
            const response = JSON.parse(stdout);
            res.json({ stdout: response });
        } catch (parseError) {
            console.error(`Error parsing stdout: ${parseError}`);
            res.status(500).json({ error: 'Error parsing stdout' });
        }
    });
};
