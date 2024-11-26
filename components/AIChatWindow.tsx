// file components/AIChatWindow.tsx

'use client';
import React, { useState } from 'react';
import { Volume2, X, Plus } from 'lucide-react';

const AIChatWindow: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-5 right-5 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] p-3 rounded-full shadow-lg hover:bg-[hsl(var(--primary)/.9)] transition-colors"
          aria-label="Open AI Assistant"
        >
          <Plus size={24} />
        </button>
      )}
      {isOpen && (
        <div className="fixed bottom-5 right-5 w-80 bg-[hsl(var(--background))] rounded-lg shadow-xl overflow-hidden border border-[hsl(var(--border))]">
          <div className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] p-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[hsl(var(--secondary))] rounded-full mr-3 flex items-center justify-center">
                AI
              </div>
              <span className="font-semibold">Buildi - your Assistant</span>
            </div>
            <div className="flex items-center">
              <button className="text-[hsl(var(--primary-foreground))] mr-3" aria-label="Toggle sound">
                <Volume2 size={20} />
              </button>
              <button onClick={toggleChat} className="text-[hsl(var(--primary-foreground))]" aria-label="Close chat">
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="p-4">
            <p className="text-[hsl(var(--muted-foreground))] text-sm mb-4">
              How can I assist you with your construction project today?
            </p>
            <div className="bg-[hsl(var(--secondary))] p-3 rounded-lg mb-4">
              <p className="text-sm text-[hsl(var(--secondary-foreground))]">Hello! What would you like help with?</p>
            </div>
            <button className="w-full bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] py-2 px-4 rounded mb-2 hover:bg-[hsl(var(--secondary)/.8)] transition-colors">
              Create a new project
            </button>
            <button className="w-full bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] py-2 px-4 rounded hover:bg-[hsl(var(--secondary)/.8)] transition-colors">
              View project schedule
            </button>
          </div>
          <div className="border-t border-[hsl(var(--border))] p-4">
            <input
              type="text"
              placeholder="Ask about your project..."
              className="w-full border border-[hsl(var(--input))] rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatWindow;