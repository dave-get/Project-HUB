"use client";
import { useState } from "react";
import { MessageCircle, Heart } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
}

const initialComments: Comment[] = [
  {
    id: "1",
    author: {
      name: "John Doe",
    },
    content:
      "Great project! I've been looking for something like this for my security testing lab. Does it work with ESP32 as well?",
    timestamp: "2 days ago",
    likes: 0,
    replies: [],
  },
];

export default function CommentSection() {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        author: {
          name: "You",
        },
        content: commentText,
        timestamp: "Just now",
        likes: 0,
        replies: [],
      };

      setComments([...comments, newComment]);
      setCommentText("");
      setIsCommentOpen(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Discussion ({comments.length})
        </h3>
        <button
          className="flex items-center text-[14px] border border-border gap-1 px-4 py-1 rounded hover:bg-accent transition-colors"
          onClick={() => setIsCommentOpen(!isCommentOpen)}
        >
          <MessageCircle className="w-4 h-4" />
          Comment
        </button>
      </div>

      {/* Comment Form */}
      {isCommentOpen && (
        <div className="bg-card p-4 rounded-lg mb-4 border border-border">
          <div className="flex items-start space-x-4 mb-3">
            {/* Avatar Placeholder */}
            <div className="w-10 h-10 rounded-full bg-muted" />

            <div className="flex-1">
              <div className="mb-1">
                <span className="font-semibold text-sm text-foreground">
                  You
                </span>
              </div>
              <Textarea
                placeholder="Write your comment here..."
                className="min-h-[100px] resize-none bg-background border-border"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              className="text-[14px] px-4 py-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              onClick={() => setIsCommentOpen(false)}
            >
              Cancel
            </button>
            <button
              className="bg-primary text-primary-foreground text-[14px] px-4 py-1 rounded hover:bg-primary/90 transition-colors"
              onClick={handleSubmitComment}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Comments List */}
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex items-start space-x-4 bg-card p-4 rounded-lg mb-4 border border-border"
        >
          {/* Avatar Placeholder */}
          <div className="w-10 h-10 rounded-full bg-muted" />

          {/* Comment Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-sm text-foreground">
                {comment.author.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {comment.timestamp}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {comment.content}
            </p>

            {/* Like and Reply Actions */}
            <div className="flex space-x-4 text-sm text-muted-foreground">
              <button className="flex items-center space-x-1 hover:text-foreground transition-colors">
                <Heart className="w-4 h-4" />
                <span>Like</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-foreground transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>Reply</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Load More Comments */}
      {comments.length > 1 && (
        <div className="flex justify-center mt-6">
          <button className="bg-primary text-primary-foreground w-full px-6 py-2 rounded hover:bg-primary/90 transition-colors text-sm">
            Load More Comments
          </button>
        </div>
      )}
    </div>
  );
}
