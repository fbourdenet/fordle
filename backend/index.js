const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const utils = require("./utils");
const wordList = require("./words");

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:8080']
    }
});

let words = wordList;

io.on('connect', (socket) => {
    let wordToGuess = utils.getWordToGuess(words).toUpperCase();
    console.log(wordToGuess);

    socket.on('get-word-to-guess', () => {
        wordToGuess = utils.getWordToGuess(words).toUpperCase();
    });

    socket.on('get-word-length', () => {
        let res = utils.getWordLength(wordToGuess);
        socket.emit('get-word-length', res);
    });

    socket.on('check-user-word', (word) => {
        let res = utils.checkUserWord(socket, word, wordToGuess);
        socket.emit('check-user-word', res);
    });
});

server.listen(3000, () => {
    console.log('listening on localhost:3000');
});