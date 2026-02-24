import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ChatBot = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! 👋 How can I help you today?", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: "user" };
        setMessages(prev => [...prev, userMessage]);
        setInput("");

        // Simulate bot response add more qna
        setTimeout(() => {
            let botResponse = "I'm not sure about that. Could you please specify?";
            const lowerInput = input.toLowerCase();

            if (["hello", "hey", "hi", "hiii"].some(word => lowerInput.includes(word))) {
                botResponse = "Hello! Hope you're having a great day. How can I assist you?";
            } else if (["report", "issue"].some(word => lowerInput.includes(word))) {
                botResponse = "To report an issue, go to your dashboard and click the '+ Report Issue' button.";
            } else if (["status", "check", "track", "my issue"].some(word => lowerInput.includes(word))) {
                botResponse = "You can check the status of your reports in the 'My Issues' section of your dashboard.";
            } else if (["password", "forgot", "pass", "reset"].some(word => lowerInput.includes(word))) {
                botResponse = "If you've forgotten your password, use the 'Forgot Password' link on the login page.";
            } else if (["thank", "thanks", "thx"].some(word => lowerInput.includes(word))) {
                botResponse = "You're very welcome! Is there anything else I can help with?";
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: "bot" }]);
        }, 1000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* for mobile */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed bottom-6 right-6 w-[calc(100vw-48px)] md:w-[400px] h-[600px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col z-[70] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-violet-600 p-6 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                                    <i className="ri-robot-line"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold">CSM Assistant</h4>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                        <span className="text-xs text-violet-100">Always online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <i className="ri-close-line text-2xl"></i>
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${msg.sender === "user"
                                            ? "bg-violet-600 text-white rounded-tr-none"
                                            : "bg-gray-100 text-gray-800 rounded-tl-none"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-gray-50/50">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 pr-14 outline-none focus:ring-2 focus:ring-violet-200 transition-all font-medium"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-violet-600 text-white rounded-xl flex items-center justify-center hover:bg-violet-700 disabled:opacity-50 disabled:hover:bg-violet-600 transition-all"
                                >
                                    <i className="ri-send-plane-2-fill"></i>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ChatBot;
