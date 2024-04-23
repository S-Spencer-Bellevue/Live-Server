// Import two packages: express and cors
const express = require("express");
const cors = require("cors");
const bcryptjs = require("bcryptjs");

// Create a new Express app
const app = express();

app.use(cors()); // Use the `cors` middleware to enable CORS.
app.use(express.json()); // Use the `express.json()` middleware to parse JSON request bodies.

//faux database placeholder
const chats = [];

//post requests to api
app.post("/api/messages", (req, res) => {
    console.log(req.body);

const { message, pin } = req.body;
const hashedPin = bcryptjs.hashSync(pin);
console.log("Generated hashed and salted pin:", hashedPin);

//Search for messages with the same pin
let pinExists = false;
let currentChat;
for (let i = 0; i < chats.length; i++) {
    currentChat = chats[i];
    pinExists = bcryptjs.compareSync(pin, currentChat.pin);
    //pinExists = currentChat.pin === pin;


    if (pinExists) {
        //output for debugging
        console.log("Found an existing chat session: ", currentChat);

        break;
    }
}

//If we can't find a chat with the same pin, create a new chat object
if (!pinExists) {
//create a new chat object with the hashed pin and the message
const newChat = {
    pin: hashedPin,
    messages: [message],
};
//store the new chat in the open array
chats.push(newChat);

//output for debugging
console.log("Created a new chat session: ", newChat);

//set the current chat to the new chat object.
currentChat = newChat;
} else {
    //The chat exists. Add the message to the existing chat.
    currentChat.messages.push(message);
}

//respond with the message for the chat session
res.status(200).send({ messages: currentChat.messages});
//output debugging
console.log("Sent the messages: ", currentChat.messages);

//Respond with the messages for the chat session
res.status(200).send({ messages: newChat.messages });
//output debugging to console
console.log("Sent the messages: ", newChat.messages);
});

// Run the Express app on port 8000.
app.listen(8000, () => console.log("Running on port 8000"));

