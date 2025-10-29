import React, { useState, useRef, useEffect } from "react";
import { X, MessageCircle, ArrowUp } from "lucide-react";
import chatService from "../../Services/chatBot.js";
import "../../../src/css/App.css"

const ViveroChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy tu Jardinero virtual 🌱 ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await chatService(userMessage.text);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: "👨‍🌾 " + response,
            sender: "bot",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 1000);
    } catch {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "👨‍🌾 Lo siento, ocurrió un error. Intenta de nuevo.",
          sender: "bot",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div>
      {/* BOTÓN FLOTANTE */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 
                     text-white rounded-full shadow-xl flex items-center justify-center 
                     hover:scale-110 hover:shadow-green-400/70 hover:shadow-lg 
                     transition-all duration-300 cursor-pointer"
          style={{ zIndex: 9999 }}
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* CAJA DEL CHAT */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 w-[420px] h-[520px] bg-white shadow-2xl rounded-xl flex flex-col border border-green-200"
          style={{ zIndex: 9999 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-t-xl shadow-md">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-green-600 text-lg">
                👨‍🌾
              </div>
              <span className="font-semibold">Jardinero</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-green-700 p-1 rounded cursor-pointer transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 bg-green-50 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] bg-repeat space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start items-end"
                } space-x-2 animate-fade-in`}
              >
                {/* Avatar del bot */}
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-green-600 shadow border border-green-200">
                    👨‍🌾
                  </div>
                )}

                {/* Mensaje */}
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm ${
                    msg.sender === "user"
                      ? "bg-emerald-900 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-green-200 rounded-bl-none shadow"
                  }`}
                >
                  {msg.text}
                  <div className="text-[10px] text-gray-400 mt-1 text-right">
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {/* Indicador de escritura */}
            {isTyping && (
              <div className="flex items-end space-x-2 animate-fade-in">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-green-600 shadow border border-green-200">
                  👨‍🌾
                </div>
                <div className="bg-white border border-green-200 px-4 py-2 rounded-2xl text-sm text-gray-800 italic animate-pulse">
                  escribiendo...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="relative border-t border-gray-200 p-3 bg-white">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="+ Haz una pregunta"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            />
            {inputMessage.trim() && (
              <button
                onClick={handleSendMessage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 
                           bg-green-600 hover:bg-green-700 text-white p-2 
                           rounded-full shadow cursor-pointer transition"
              >
                <ArrowUp size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViveroChatbot;
