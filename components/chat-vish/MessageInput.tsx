// file : components/chat-vish/MessageInput.tsx

import { useSocket } from '@/lib/socket/SocketContext';
import { useState, useCallback, useRef, useEffect } from 'react';
import { PaperclipIcon, SendIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import debounce from 'lodash/debounce';

export function MessageInput() {
  const { activeConversation, sendMessage, startTyping, stopTyping } =
    useSocket();

  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const debouncedStartTyping = useCallback(
    (conversationId: number) => {
      const debouncedFn = debounce((id: number) => {
        startTyping(id);
      }, 300);
      debouncedFn(conversationId);
    },
    [startTyping]
  );

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (activeConversation) {
      debouncedStartTyping(activeConversation);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation || !content.trim()) return;

    try {
      setSending(true);
      await sendMessage(activeConversation, content.trim(), undefined, files);
      setContent('');
      setFiles([]);
      stopTyping(activeConversation);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  if (!activeConversation) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="flex flex-col space-y-2">
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 rounded bg-gray-50 p-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 rounded bg-white p-2 shadow-sm"
              >
                <span className="max-w-[200px] truncate text-sm">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                  className="text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              placeholder="Type a message..."
              className="max-h-[200px] min-h-[40px] w-full resize-none rounded border p-2"
              disabled={sending}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => document.getElementById('file-input')?.click()}
            disabled={sending}
          >
            <PaperclipIcon className="h-5 w-5" />
          </Button>
          <Button
            type="submit"
            disabled={(!content.trim() && !files.length) || sending}
          >
            <SendIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </form>
  );
}
