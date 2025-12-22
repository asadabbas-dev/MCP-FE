"use client";

import { useState, useRef, useEffect } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import { Bot, Send, User, Loader2 } from "lucide-react";

/**
 * AI Chatbot View Component
 * 
 * Interactive AI chatbot interface for academic assistance.
 * 
 * Features:
 * - Real-time chat interface
 * - Send messages to AI assistant
 * - Receive bot responses
 * - Quick question buttons
 * - Message timestamps
 * - Loading states during responses
 * - Auto-scroll to latest message
 * 
 * Use Cases:
 * - Course registration guidance
 * - Academic FAQs
 * - General academic help
 */

export default function ChatbotView() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: "bot",
        text: getBotResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setLoading(false);
    }, 1000);
  };

  const getBotResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes("course") || lowerInput.includes("enroll")) {
      return "To enroll in a course, go to the Courses page and click 'Enroll in Course'. You'll need to provide the course code, select the semester and section. Make sure you meet the prerequisites!";
    } else if (lowerInput.includes("assignment") || lowerInput.includes("submit")) {
      return "To submit an assignment, go to the Assignments page, find your assignment, and click 'Submit'. You can upload files (PDF, DOC, DOCX) and add comments. Remember to submit before the deadline!";
    } else if (lowerInput.includes("result") || lowerInput.includes("grade") || lowerInput.includes("cgpa")) {
      return "You can view your results and CGPA on the Results page. It shows semester-wise grades and calculates your overall CGPA. Your current CGPA is displayed on the dashboard.";
    } else if (lowerInput.includes("library") || lowerInput.includes("book")) {
      return "To search for books, go to the Library page and click 'Search Books'. You can view your currently borrowed books and their due dates there.";
    } else if (lowerInput.includes("timetable") || lowerInput.includes("schedule")) {
      return "Your class timetable is available on the Timetable page. It shows your daily schedule with course timings and room numbers.";
    } else if (lowerInput.includes("notification") || lowerInput.includes("alert")) {
      return "Check the Notifications page for all announcements, assignment deadlines, and important updates. You can mark notifications as read or delete them.";
    } else if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
      return "Hello! I'm here to help you with your academic queries. You can ask me about courses, assignments, results, library, timetable, or anything else related to your studies.";
    } else {
      return "I understand you're asking about: " + userInput + ". For more specific help, you can ask about courses, assignments, results, library, timetable, or notifications. How can I assist you further?";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "How to enroll in a course?",
    "How to submit an assignment?",
    "Where can I see my results?",
    "How to search for books?",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Chatbot</h1>
        <p className="text-gray-600 mt-1">
          Get instant help with your academic queries
        </p>
      </div>

      <Card className="h-[600px] flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.type === "bot" && (
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-indigo-600" />
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.type === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.type === "user"
                      ? "text-indigo-100"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {message.type === "user" && (
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-4 py-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInput(question);
                    setTimeout(() => handleSend(), 100);
                  }}
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              startIcon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            >
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

