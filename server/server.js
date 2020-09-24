const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage } = require('./utils/message.js')
const { isRealString } = require('./utils/validation.js');
const bot = require('./bot/bot.js');
const port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var twilio = require('twilio');
const BOT_NAME = 'Bot';
const publicPath = path.join(__dirname, '../public');
app = express();
var server = http.createServer(app);
var io = socketIO(server, { pingInterval: 60000, pingTimeout: 5000 });

// Express Middleware:

app.use(bodyParser.json());
// For SMS Messages
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');
    socket.on('join', async(params, callback) => {
        socket.emit('socketID', socket.id);
        callback();
    });

    socket.on('disconnect', (reason) => {
        console.log(`disconnected ${socket.id} because: ${reason}`);
    });


    socket.on('connect_timeout', async() => {
        console.log('timed out from client...');
    });

    // receiving the user's message

    socket.on('userSendMessage', async(message, callback) => {
        console.log('Got a message from user:' + message.text)
        if (isRealString(message.text)) {
            try {
                var botAnswer = await bot.getBotResponse(message.text);
                socket.emit('newMessage', generateMessage(BOT_NAME, unescape(botAnswer)));
                console.log('Chatbot response:');
                console.log(botAnswer);
                callback();
            } catch (e) {
                socket.emit('newMessage', generateMessage(BOT_NAME, 'Oops, something went wrong. Please try again later.'));
                console.log(e);
            }
        }
        callback();
    });

});



server.listen(port, function() {
    console.log(`Server is up on port ${port}`);
});