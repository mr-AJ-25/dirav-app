import { useState, useRef, useEffect } from 'react';
import { DiravColors } from '@/core/theme/colors';
import { MockDatabase, ChatMessage } from '@/data/mockDatabase';
import { SendIcon, RobotIcon, SparklesIcon } from '@/core/icons/Icons';
import { sendMessageToGemini, isAPIConfigured } from '@/services/geminiService';
import { getChatHistory, saveChatHistory } from '@/services/storageService';

export function AIAdvisorScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = getChatHistory();
    return saved && saved.length > 0 ? saved : MockDatabase.chatHistory;
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (messages.length > 1) {
      saveChatHistory(messages);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await sendMessageToGemini(userInput);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (question: string) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  const formatMessage = (text: string) => {
    return text.split('\n').map((line, i) => {
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        formattedLine = `<span class="block ml-2">${formattedLine}</span>`;
      }
      if (/^\d+\./.test(line.trim())) {
        formattedLine = `<span class="block ml-2">${formattedLine}</span>`;
      }
      return (
        <span 
          key={i} 
          dangerouslySetInnerHTML={{ __html: formattedLine }} 
          className={line.trim() === '' ? 'block h-2' : 'block'}
        />
      );
    });
  };

  const clearChat = () => {
    const initialMessage = MockDatabase.chatHistory[0];
    setMessages([initialMessage]);
    saveChatHistory([initialMessage]);
  };

  const suggestedQuestions = [
    { emoji: '💰', text: 'How can I save more money?' },
    { emoji: '📊', text: 'Give me budgeting tips' },
    { emoji: '🎓', text: 'Find me scholarships' },
    { emoji: '📈', text: 'Analyze my spending' },
  ];

  const isNewChat = messages.length <= 1;

  return (
    <div className="h-full flex flex-col bg-[#F8F9FC]">
      {/* Minimal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${DiravColors.primary}, ${DiravColors.accentGradientEnd})` 
            }}
          >
            <SparklesIcon size={20} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-[#111827]">Dirav AI</h1>
              {isAPIConfigured() && (
                <span className="text-[9px] px-1.5 py-0.5 bg-gradient-to-r from-[#7C3AED] to-[#C026D3] text-white rounded-full font-bold">
                  PRO
                </span>
              )}
            </div>
            <p className="text-xs text-[#6B7280]">
              {isTyping ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
        
        {!isNewChat && (
          <button
            onClick={clearChat}
            className="text-xs text-[#6B7280] hover:text-[#7C3AED] px-3 py-2 rounded-lg hover:bg-[#7C3AED]/5 transition-all font-medium"
          >
            New Chat
          </button>
        )}
      </div>

      {/* Chat Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto"
      >
        {isNewChat ? (
          /* Welcome State */
          <div className="h-full flex flex-col items-center justify-center p-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${DiravColors.primary}, ${DiravColors.accentGradientEnd})` 
              }}
            >
              <SparklesIcon size={40} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-[#111827] mb-2">How can I help you?</h2>
            <p className="text-sm text-[#6B7280] text-center mb-8 max-w-sm">
              I'm your personal financial advisor. Ask me anything about budgeting, saving, or finding opportunities.
            </p>
            
            <div className="w-full max-w-md grid grid-cols-2 gap-3">
              {suggestedQuestions.map((q) => (
                <button
                  key={q.text}
                  onClick={() => handleSuggestionClick(q.text)}
                  className="p-4 bg-white rounded-xl border border-gray-100 hover:border-[#7C3AED]/30 hover:shadow-md transition-all text-left group"
                >
                  <span className="text-2xl mb-2 block">{q.emoji}</span>
                  <span className="text-sm text-[#374151] group-hover:text-[#7C3AED] font-medium line-clamp-2">
                    {q.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="p-4 space-y-4 max-w-3xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`flex gap-3 max-w-[85%] ${
                    message.isUser ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar for AI */}
                  {!message.isUser && (
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ 
                        background: `linear-gradient(135deg, ${DiravColors.primary}, ${DiravColors.accentGradientEnd})` 
                      }}
                    >
                      <RobotIcon size={16} className="text-white" />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-3 ${
                      message.isUser
                        ? 'bg-[#7C3AED] text-white rounded-2xl rounded-br-md'
                        : 'bg-white text-[#111827] rounded-2xl rounded-bl-md shadow-sm border border-gray-100'
                    }`}
                  >
                    <div className="text-sm leading-relaxed">
                      {message.isUser ? message.text : formatMessage(message.text)}
                    </div>
                    <p
                      className={`text-[10px] mt-2 ${
                        message.isUser ? 'text-white/60' : 'text-[#9CA3AF]'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ 
                      background: `linear-gradient(135deg, ${DiravColors.primary}, ${DiravColors.accentGradientEnd})` 
                    }}
                  >
                    <RobotIcon size={16} className="text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-md shadow-sm border border-gray-100 px-4 py-3">
                    <div className="flex gap-1">
                      <div 
                        className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce" 
                        style={{ animationDelay: '0ms' }} 
                      />
                      <div 
                        className="w-2 h-2 bg-[#9333EA] rounded-full animate-bounce" 
                        style={{ animationDelay: '150ms' }} 
                      />
                      <div 
                        className="w-2 h-2 bg-[#C026D3] rounded-full animate-bounce" 
                        style={{ animationDelay: '300ms' }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Input Area - Clean and minimal */}
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2 max-w-3xl mx-auto bg-[#F8F9FC] rounded-xl px-4 py-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything..."
            disabled={isTyping}
            className="flex-1 py-2 bg-transparent focus:outline-none text-sm disabled:opacity-50 placeholder:text-[#9CA3AF]"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 flex-shrink-0"
            style={{ 
              background: inputValue.trim() 
                ? `linear-gradient(135deg, ${DiravColors.primary}, ${DiravColors.accentGradientEnd})`
                : '#E5E7EB'
            }}
          >
            <SendIcon size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
