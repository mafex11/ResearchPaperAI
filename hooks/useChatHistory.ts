import { useState, useEffect } from 'react';

export interface Message {
  role: "user" | "assistant" | "system" | "error";
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
  preview: string;
  tags: string[];
}

// Helper function to extract relevant tags from chat content
const extractTags = (messages: Message[]): string[] => {
  // Start with an empty array of tags
  const tags: Set<string> = new Set();
  
  // Look for keywords in the user messages
  messages
    .filter(msg => msg.role === "user")
    .forEach(msg => {
      const content = msg.content.toLowerCase();
      
      // Common academic fields
      if (content.includes('ai') || content.includes('artificial intelligence')) tags.add('AI');
      if (content.includes('machine learning') || content.includes('ml')) tags.add('Machine Learning');
      if (content.includes('healthcare') || content.includes('medical')) tags.add('Healthcare');
      if (content.includes('physics') || content.includes('quantum')) tags.add('Physics');
      if (content.includes('climate') || content.includes('environment')) tags.add('Environment');
      if (content.includes('finance') || content.includes('economic')) tags.add('Finance');
      if (content.includes('psychology') || content.includes('mental health')) tags.add('Psychology');
      if (content.includes('politics') || content.includes('government')) tags.add('Politics');
      if (content.includes('social media') || content.includes('communication')) tags.add('Social Media');
      if (content.includes('research') || content.includes('study')) tags.add('Research');
    });
  
  return Array.from(tags).slice(0, 5); // Limit to 5 tags max
};

// Helper to generate a preview from messages
const generatePreview = (messages: Message[]): string => {
  const userMessages = messages.filter(msg => msg.role === 'user');
  if (userMessages.length > 0) {
    // Get the first user message
    const firstMessage = userMessages[0].content;
    // Truncate to first 100 characters
    return firstMessage.length > 100 
      ? `${firstMessage.substring(0, 100)}...` 
      : firstMessage;
  }
  return "No message content";
};

// Helper to generate a title from content
const generateTitle = (messages: Message[]): string => {
  const userMessages = messages.filter(msg => msg.role === 'user');
  if (userMessages.length > 0) {
    const firstMessage = userMessages[0].content;
    // Extract first sentence or first few words
    const firstSentence = firstMessage.split('.')[0];
    return firstSentence.length > 40 
      ? `${firstSentence.substring(0, 40)}...` 
      : firstSentence;
  }
  return "Untitled Research Chat";
};

export const useChatHistory = () => {
  const [history, setHistory] = useState<ChatSession[]>([]);
  
  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse chat history:', error);
        // If parsing fails, reset history
        localStorage.setItem('chatHistory', JSON.stringify([]));
      }
    }
  }, []);

  // Save a new chat session
  const saveChat = (messages: Message[]) => {
    if (messages.length === 0) return null;
    
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: generateTitle(messages),
      timestamp: new Date().toISOString(),
      messages: messages,
      preview: generatePreview(messages),
      tags: extractTags(messages)
    };
    
    const updatedHistory = [newChat, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
    
    return newChat.id;
  };

  // Get a specific chat by ID
  const getChatById = (id: string): ChatSession | undefined => {
    return history.find(chat => chat.id === id);
  };

  // Delete a chat session
  const deleteChat = (id: string) => {
    const updatedHistory = history.filter(chat => chat.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
  };

  // Clear all chat history
  const clearAllHistory = () => {
    setHistory([]);
    localStorage.setItem('chatHistory', JSON.stringify([]));
  };

  return {
    history,
    saveChat,
    getChatById,
    deleteChat,
    clearAllHistory
  };
}; 