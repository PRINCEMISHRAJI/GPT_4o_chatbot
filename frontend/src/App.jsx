import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import InputBox from './components/InputBox'
import ChatBox from './components/ChatBox'

function App() {
  const [messages, setMessages] = useState([
    { "sender": "bot", "text": "Hello There! I'm here to help you to connect with top-rated contractors. How can i assist you today? " },
  ]);

  const clearChat = () => {
    setMessages([]);
  }

  return (
    <>
      <Header />
      <ChatBox messages={messages}/>
      <InputBox messages={messages}  setMessages={setMessages} clearChat={clearChat}/>
    </>
  )
}

export default App
