# Ask Buddha

## Overview

This React application simulates a conversation with Lord Buddha, providing users with historical and educational information in an engaging format. The chatbot is powered by OpenAI's API, allowing it to generate informative and contextually appropriate responses. To learn more about interacting with the APIs, check out [this doc](./docs/using-the-openai-assistant-apis.md).

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A modern frontend build tool that significantly improves the development experience.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **SWC**: A super-fast compiler that powers the transformation of TypeScript into JavaScript.

## Setup

To get this project up and running on your local machine, follow these steps:

### Prerequisites

- Node.js (>=21.4.0)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone git@github.com:symbiosissolutions/ask-buddha.git
cd ask-buddha
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Configure the Environment Variables**

Create a `.env` file in the root of the project and add your OpenAI API key:

```plaintext
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_ASSISTANT_ID=your_assistant_id_here
```

### Running the Application

To start the application in development mode, run:

```bash
npm run dev
# or
yarn dev
```

This will start the Vite server, and you can access the app at `http://localhost:5173`.

### Building for Production

To build the app for production, run:

```bash
npm run build
# or
yarn build
```

## Usage

Once the app is running, you can interact with the chatbot by typing your questions into the chat interface. The bot, assuming the persona of Lord Buddha, will respond with information that is both educational and insightful.