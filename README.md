# LUIS BotLite
This is a (very) lightweight framework for a Chatbot based on Alexan Innovation's Chatbot Platform.
Use this as a starter for rapid LUIS integration and prototyping.

See it deployed here: https://luischatbotlite.azurewebsites.net

# Setup
Ensure you have node.js installed

Clone the repository

Run npm install --save to ensure dependencies have downloaded (although they are included in this repository)

Go to /server/bot/intent_luis.js and change the URL to your published LUIS URL.

Then, check out /server/bot/knowledge_base.json to match intent names with answers!

Run "npm start" and navigate to http://localhost:3000
