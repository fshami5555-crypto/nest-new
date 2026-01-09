
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { chatWithPsych } from '../gemini';
import { Send, User, MessageCircle, Info } from 'lucide-react';

interface PsychChatProps {
  user: UserProfile;
}

const PsychChat: React.FC<PsychChatProps> = ({ user }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: `أهلاً بكِ يا ${user.name}، أنا "نست" صديقتكِ المقربة. فضفضي لي، أنا هنا لأسمعكِ دائماً.. كيف حالكِ اليوم؟ 🌸` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await chatWithPsych(user, userMsg, messages);
      setMessages(prev => [...prev, { role: 'ai', text: response || 'اعتذر، حدث خطأ بسيط.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'أنا هنا معكِ، لكن يبدو أن هناك مشكلة في الاتصال. حاولي مرة أخرى يا عزيزتي.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col p-4">
      <div className="glass flex-1 rounded-3xl overflow-hidden flex flex-col shadow-xl">
        {/* Header */}
        <div className="bg-pink-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <MessageCircle size={24} />
            </div>
            <div>
              <h2 className="font-bold">مستشاركِ النفسي (نست)</h2>
              <p className="text-[10px] opacity-80 italic">محادثة سرية تماماً ومدعومة بالذكاء الاصطناعي</p>
            </div>
          </div>
          <Info size={20} className="cursor-pointer opacity-80" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                m.role === 'user' 
                ? 'bg-white border border-pink-100 text-gray-800 rounded-tr-none' 
                : 'bg-pink-600 text-white rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-end">
              <div className="bg-pink-100 text-pink-600 p-3 rounded-2xl rounded-tl-none animate-pulse text-xs font-bold">
                نست تكتب لكِ بصدق...
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-pink-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اكتبي ما في قلبكِ هنا..."
              className="flex-1 bg-pink-50/50 border border-pink-100 rounded-2xl px-4 py-3 outline-none focus:border-pink-300 transition-all text-sm"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-pink-600 text-white p-3 rounded-2xl hover:bg-pink-700 transition-colors shadow-lg shadow-pink-200"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychChat;
