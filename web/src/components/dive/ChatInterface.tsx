"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Plus, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isPaperAnalysis?: boolean;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingPaper, setUploadingPaper] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading || uploadingPaper) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversation_history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "I couldn't generate a response.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling API:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: error instanceof Error
          ? `Error: ${error.message}. Make sure the backend server is running at http://localhost:8000`
          : "An error occurred while processing your request.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.pdf')) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Please upload a PDF file.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    // Add a message indicating paper upload
    const uploadMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `📄 Analyzing paper: ${file.name}`,
      timestamp: new Date(),
      isPaperAnalysis: true,
    };

    setMessages((prev) => [...prev, uploadMessage]);
    setUploadingPaper(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/api/upload-paper", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to upload paper");
      }

      const data = await response.json();

      const analysisMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "I couldn't analyze the paper.",
        timestamp: new Date(),
        isPaperAnalysis: true,
      };

      setMessages((prev) => [...prev, analysisMessage]);
    } catch (error) {
      console.error("Error uploading paper:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: error instanceof Error
          ? `Error: ${error.message}`
          : "An error occurred while analyzing your paper.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setUploadingPaper(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handlePlusClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-medium text-white/90 mb-12">
              Ready when you are.
            </h2>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6 pb-32">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl px-5 py-3.5 backdrop-blur-xl ${
                    message.role === "user"
                      ? "bg-blue-500/20 text-white border border-blue-500/30 shadow-lg"
                      : "bg-white/5 text-white/95 border border-white/10"
                  }`}
                  style={{
                    backdropFilter: "blur(20px) saturate(180%)",
                  }}
                >
                  <div className="text-[15px] leading-relaxed prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Custom components for better styling
                        p: ({ children }) => (
                          <p className="mb-3 last:mb-0">{children}</p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-white">
                            {children}
                          </strong>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside mb-3 space-y-1">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside mb-3 space-y-1">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-white/90">{children}</li>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-xl font-bold mb-2 text-white">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-lg font-semibold mb-2 text-white">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-base font-semibold mb-1 text-white">
                            {children}
                          </h3>
                        ),
                        code: ({ children, className }) => {
                          const isInline = !className;
                          return isInline ? (
                            <code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-300 text-sm">
                              {children}
                            </code>
                          ) : (
                            <code className="block bg-white/10 p-3 rounded-lg text-sm overflow-x-auto">
                              {children}
                            </code>
                          );
                        },
                        a: ({ children, href }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {(isLoading || uploadingPaper) && (
              <div className="flex justify-start">
                <div
                  className="bg-white/5 text-white/90 border border-white/10 rounded-3xl px-5 py-3.5 backdrop-blur-xl flex items-center gap-3"
                  style={{
                    backdropFilter: "blur(20px) saturate(180%)",
                  }}
                >
                  <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                  {uploadingPaper && (
                    <span className="text-sm text-white/70">
                      Analyzing your paper...
                    </span>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Form - Centered at bottom */}
      <div className="absolute bottom-0 left-0 right-0 pb-8 px-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div
              className="relative rounded-[28px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden"
              style={{
                backdropFilter: "blur(40px) saturate(180%)",
              }}
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <button
                  type="button"
                  onClick={handlePlusClick}
                  disabled={uploadingPaper || isLoading}
                  className="p-2 hover:bg-white/5 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed group"
                  title="Upload research paper (PDF)"
                >
                  <FileText className="w-5 h-5 text-white/60 group-hover:text-blue-400 transition-colors" />
                </button>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={uploadingPaper ? "Analyzing paper..." : "Ask anything about the dataset"}
                  disabled={isLoading || uploadingPaper}
                  className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-[15px]"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading || uploadingPaper}
                  className="p-2.5 bg-blue-500/30 hover:bg-blue-500/40 text-blue-300 rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-white/40 mt-3 text-center">
              {uploadingPaper
                ? "Analyzing your paper with Ollama..."
                : "Ask questions or upload a PDF to analyze"}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
