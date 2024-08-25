const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = 3001;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: userMessage }],
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const botReply = response.data.choices[0].message.content;
        res.json({ reply: botReply });
    } catch (error) {
        console.error('Error fetching GPT response:', error);
        res.status(500).json({ error: 'Failed to fetch GPT response' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});