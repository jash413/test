//file components/chat-vish/EmojiPicker.tsx

import { Reaction } from '@/lib/socket/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { SmileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EMOJI_OPTIONS = [
  { emoji: '👍', reaction: 'like' },
  { emoji: '❤️', reaction: 'love' },
  { emoji: '😂', reaction: 'laugh' },
  { emoji: '😮', reaction: 'wow' },
  { emoji: '😢', reaction: 'sad' },
  { emoji: '😠', reaction: 'angry' }
] as const;

interface EmojiPickerProps {
  onEmojiSelect: (reaction: string) => void;
  existingReactions?: Reaction[];
  onReactionClick: (reaction: string) => void;
}

export function EmojiPicker({
  onEmojiSelect,
  existingReactions,
  onReactionClick
}: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <SmileIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-2">
        <div className="flex flex-wrap gap-2">
          {EMOJI_OPTIONS.map(({ emoji, reaction }) => (
            <button
              key={reaction}
              onClick={() => onEmojiSelect(reaction)}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
