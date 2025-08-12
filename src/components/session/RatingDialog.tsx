
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Star } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface RatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sessionId: string, rating: number, feedback: string) => void;
  session: { id: string };
  userToRate: string;
  userRole: 'Tutor' | 'Student';
}

export default function RatingDialog({
  isOpen,
  onClose,
  onSubmit,
  session,
  userToRate,
  userRole,
}: RatingDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        variant: 'destructive',
        title: 'Rating Required',
        description: 'Please select at least one star.',
      });
      return;
    }
    onSubmit(session.id, rating, feedback);
    toast({
        title: 'Rating Submitted',
        description: `Thank you for rating your session with ${userToRate}.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate Your {userRole}</DialogTitle>
          <DialogDescription>
            How was your session with {userToRate}? Your feedback helps improve the community.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex justify-center" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'h-10 w-10 cursor-pointer transition-colors',
                  (hoverRating || rating) >= star
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                )}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
              />
            ))}
          </div>
          <Textarea
            placeholder="Add an optional comment..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Rating</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
