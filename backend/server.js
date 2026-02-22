const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { getUsers, saveUsers, getTokens, saveTokens } = require('./db');
const authenticateToken = require('./authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

const JWT_SECRET = process.env.JWT_SECRET || 'kodbank_secret_key_123';

app.use(express.json());
app.use(cookieParser());

// Dynamic CORS configuration for Vercel
const allowedOrigins = [
    'http://localhost:5173',
    'https://kodbank.vercel.app', // You can update this with your actual Vercel URL
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req, res) => {
    res.send('<h1>🏦 KodBank Backend API is Running</h1><p>The server is healthy and ready to process transactions.</p>');
});

// --- Auth Routes ---

// Register
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    const users = getUsers();

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: Date.now(),
        name,
        email,
        password: hashedPassword,
        balance: 1000, // Initial balance
        userToken: '' // Initialize token field
    };

    const token = jwt.sign({ id: newUser.id, name: newUser.name, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
    newUser.userToken = token;

    users.push(newUser);
    saveUsers(users);

    // Store token in DB
    const tokens = getTokens();
    tokens.push({ userId: newUser.id, token, createdAt: new Date().toISOString() });
    saveTokens(tokens);

    // Set cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 3600000
    });

    res.status(201).json({
        message: 'User registered successfully',
        user: { name: newUser.name, email: newUser.email },
        token
    });
});

// Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    // Update token in users.json for visibility (as per requirement)
    user.userToken = token;
    saveUsers(users);

    // Store token in DB
    const tokens = getTokens();
    tokens.push({ userId: user.id, token, createdAt: new Date().toISOString() });
    saveTokens(tokens);

    // Set cookie on client side
    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: 'lax',
        maxAge: 3600000 // 1 hour
    });

    res.json({ message: 'Login successful', user: { name: user.name, email: user.email }, token });
});

// Logout
app.post('/api/logout', (req, res) => {
    const token = req.cookies.token;
    let tokens = getTokens();
    tokens = tokens.filter(t => t.token !== token);
    saveTokens(tokens);
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

// --- Bank Routes ---

// Check Balance
app.get('/api/balance', authenticateToken, (req, res) => {
    const users = getUsers();
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({ balance: user.balance });
});

// Get Current User (Verify Session)
app.get('/api/me', authenticateToken, (req, res) => {
    const users = getUsers();
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
});

let aiClient;
(async () => {
    try {
        const { Client } = await import('@gradio/client');
        aiClient = await Client.connect("CohereLabs/tiny-aya");
        console.log('✅ AI Assistant (Tiny Aya) Connected & Ready');
    } catch (err) {
        console.error('❌ Failed to connect to AI Assistant:', err);
    }
})();

// AI Assistant Route
app.post("/api/ai-chat", authenticateToken, async (req, res) => {
    console.log(`AI Chat Request from ${req.user.email}: ${req.body.message}`);
    try {
        const { message } = req.body;

        if (!aiClient) {
            console.error('AI Client not initialized');
            return res.status(503).json({ reply: "AI Assistant is still waking up, please try again in a second." });
        }

        console.log('Calling AI predict (Tiny Aya)...');
        const result = await aiClient.predict("/generate", {
            message: message,
            system_prompt: "You are the official KodBank AI Assistant. Your goal is to help users with their banking needs, explain features like transfers and withdrawals, and provide general financial guidance in a professional yet friendly manner. Keep responses concise and focused on KodBank.",
            temperature: 0.2,
            max_new_tokens: 300,
        });

        console.log('AI Response received:', result.data[0]);

        res.json({
            reply: result.data[0]
        });

    } catch (error) {
        console.error('AI Error breakdown:', {
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });
        res.status(500).json({
            reply: "AI service unavailable"
        });
    }
});

// Money Transfer
app.post('/api/transfer', authenticateToken, (req, res) => {
    const { recipientEmail, amount: amountStr } = req.body;
    const amount = Number(amountStr);
    const users = getUsers();
    const sender = users.find(u => u.id === req.user.id);
    const recipient = users.find(u => u.email === recipientEmail);

    console.log(`Transfer Attempt: ${sender?.email} -> ${recipientEmail} ($${amount})`);

    if (!recipient) {
        return res.status(404).json({ message: 'Recipient not found' });
    }

    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
    }

    if (sender.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
    }

    if (sender.email === recipientEmail) {
        return res.status(400).json({ message: 'Cannot transfer to yourself' });
    }

    sender.balance -= amount;
    recipient.balance += amount;

    saveUsers(users);

    console.log(`Transfer Success: New balance for ${sender.email} is $${sender.balance}`);
    res.json({ message: 'Transfer successful', newBalance: sender.balance });
});

// Withdraw Money
app.post('/api/withdraw', authenticateToken, (req, res) => {
    const { amount: amountStr } = req.body;
    const amount = Number(amountStr);
    const users = getUsers();
    const user = users.find(u => u.id === req.user.id);

    console.log(`Withdraw Attempt: ${user?.email} ($${amount})`);

    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
    }

    if (user.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.balance -= amount;
    saveUsers(users);

    console.log(`Withdraw Success: New balance for ${user.email} is $${user.balance}`);
    res.json({ message: 'Withdrawal successful', newBalance: user.balance });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`KodBank Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
