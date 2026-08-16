# BigganKhichuri

BigganKhichuri is a collection of web applications including a chatbot, a gamified learning platform, and an educational app with interactive features.

## Features

### Chatbot
- A simple AI-powered chatbot built with Flask.
- Uses Vext API for generating responses.
- Fine Tuned the GPT-4.0 model with academic topics.

### Gamify
- A multiplayer game application.
- Backend built with Flask and Socket.IO for real-time communication.
- Frontend built with React and Phaser for game logic.

### My-App
- An educational platform with subjects like Math, Physics, Chemistry, Biology, and Environmental Science.
- Includes features like chatbox, idea sharing, and text-to-speech.
- Built with React and Vite.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd BigganKhichuri-main
   ```

2. For the Chatbot:
   - Navigate to `chatbot/`
   - Install dependencies: `pip install flask flask-cors requests`
   - Set environment variables: `CHANNEL_TOKEN` and `API_KEY`
   - Run: `python app.py`

<!-- 3. For Gamify:
   - Backend: Navigate to `Gamify/game/backend/`, install from `requirements.txt`, run `python app.py`
   - Frontend: Navigate to `Gamify/game/frontend/`, run `npm install`, then `npm start` -->

3. For My-App:
   - Navigate to `my-app/`
   - Run `npm install`
   - Run `npm run dev`

## Usage

- Access each app through their respective ports as configured.
- For the chatbot, visit the root URL and start chatting.
- For Gamify, join lobbies and play games.
- For My-App, explore subjects and use interactive features.

## Technologies Used

- Backend: Flask, Socket.IO
- Frontend: React, Phaser, Vite
- AI: Vext API

## About Vext and the AI Chatbot

The chatbot in this project uses Vext, a platform for building and fine-tuning AI chatbots based on GPT models.

Vext allows users to create custom AI assistants by fine-tuning pre-trained GPT models with their own data. In this project, the chatbot sends user messages to a Vext hook endpoint. Vext processes the input using a fine-tuned GPT model and returns a response.

To set up the chatbot:
- Sign up on Vext website.
- Create a project and fine-tune a GPT model with your training data (conversations, FAQs, etc.).
- Get the hook URL and API key from Vext.
- Configure the environment variables in the Flask app.

The fine-tuning process involves:
1. Collecting training data relevant to your chatbot's purpose.
2. Uploading the data to Vext.
3. Training the model on Vext's platform.
4. Deploying the model to get a hook URL for API calls.

This way, the chatbot can provide more accurate and context-specific responses compared to a generic GPT model.
