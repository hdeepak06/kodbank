const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const TOKENS_FILE = path.join(__dirname, 'data', 'tokens.json');

const readData = (file) => {
    try {
        const data = fs.readFileSync(file, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const writeData = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
};

module.exports = {
    getUsers: () => readData(USERS_FILE),
    saveUsers: (users) => writeData(USERS_FILE, users),
    getTokens: () => readData(TOKENS_FILE),
    saveTokens: (tokens) => writeData(TOKENS_FILE, tokens)
};
