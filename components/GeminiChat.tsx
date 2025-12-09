import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

export const GeminiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: "Bonjour ! Je suis l'assistant Reservo. Je peux vous aider à trouver un coiffeur, un médecin, ou vous expliquer comment fonctionne la fidélité. Que cherchez-vous ?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await sendMessageToGemini(userMsg.text);
      
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '', isStreaming: true }]);

      let fullText = '';
      for await (const chunk of stream) {
         const chunkText = chunk.text;
         if (chunkText) {
             fullText += chunkText;
             setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: fullText } : m));
         }
      }
      setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, isStreaming: false } : m));
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Désolé, j'ai rencontré une erreur de connexion." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 md:bottom-8 md:right-8 bg-[#1E90FF] text-white p-4 rounded-full shadow-xl hover:bg-blue-600 transition-all z-50 flex items-center justify-center"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 w-[90vw] md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-[#1E90FF] p-4 flex justify-between items-center text-white">
             <div className="flex items-center gap-2">
               <div className="bg-white/20 p-1 rounded-lg">
                 <Bot className="w-5 h-5" />
               </div>
               <div>
                 <h3 className="font-bold text-sm">Reservo Bot</h3>
                 <p className="text-xs text-blue-100">Assistant IA</p>
               </div>
             </div>
             <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded">
               <X className="w-5 h-5" />
             </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
             {messages.map((msg) => (
               <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                   msg.role === 'user' 
                     ? 'bg-[#1E90FF] text-white rounded-br-none' 
                     : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-none'
                 }`}>
                   {msg.text}
                   {msg.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-[#1E90FF] animate-pulse"></span>}
                 </div>
               </div>
             ))}
             {isLoading && !messages[messages.length - 1].isStreaming && (
                <div className="flex justify-start">
                   <div className="bg-white text-gray-500 shadow-sm border border-gray-100 rounded-2xl p-3 rounded-bl-none">
                      <span className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75"></span>
                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></span>
                      </span>
                   </div>
                </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
             <div className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Posez une question..."
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#1E90FF]"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-[#1E90FF] text-white p-2 rounded-full hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>
      )}
    </>
  );
};
