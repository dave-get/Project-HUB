"use client";
import { useState, useEffect } from "react";
import {
  MessageCircle,
  Heart,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddCommentMutation,
  useDeleteCommentMutation,
} from "@/features/commentsApi/commentsApi";
import type { Comment } from "@/features/commentsApi/commentsApi";
import { useGetUserQuery } from "@/features/profileApi/profileApi";

interface CommentSectionProps {
  projectId: string;
  comments: Comment[];
}

export default function CommentSection({
  projectId,
  comments,
}: CommentSectionProps) {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [visibleComments, setVisibleComments] = useState(1);
  const [localComments, setLocalComments] = useState<Comment[]>(comments);

  // API hooks
  const [addComment] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const { data: profile } = useGetUserQuery();

  // Sync localComments with incoming comments prop
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  // Update displayed comments when comments prop changes
  const displayedComments = localComments.slice(0, visibleComments);

  const handleShowMore = () => {
    setVisibleComments((prev) => prev + 2);
  };

  const handleShowLess = () => {
    setVisibleComments(1);
  };

  const handleSubmitComment = async () => {
    if (!profile?.data || !commentText.trim()) return;

    try {
      const newComment: Comment = {
        commenterId: profile.data._id,
        name: profile.data.fullName,
        text: commentText.trim(),
        image: profile.data.imageUrl,
        likes: 0,
        createdAt: new Date(),
      };

      // Optimistically update the UI
      setLocalComments((prev) => [...prev, newComment]);
      setCommentText("");
      setIsCommentOpen(false);

      // Make the API call
      await addComment({
        projectId,
        commenterId: profile.data._id,
        name: profile.data.fullName,
        text: commentText.trim(),
        image: profile.data.imageUrl,
      }).unwrap();
    } catch (error) {
      console.error("Failed to add comment:", error);
      // Revert the optimistic update on error
      setLocalComments(comments);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    console.log("commentId", commentId);
    if (!commentId || !projectId) {
      console.error("Missing comment ID or project ID");
      return;
    }

    try {
      // Make the API call first
      await deleteComment({
        projectId: projectId,
        commentId: commentId,
      }).unwrap();

      // Only update local state if delete was successful
      setLocalComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );
    } catch (error: any) {
      console.error("Failed to delete comment:", error);
      // Show error message to user
      alert("Failed to delete comment. Please try again.");
    }
  };

  const hasMoreComments = localComments.length > visibleComments;

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Discussion ({localComments.length})
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
            <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
              {profile?.data?.imageUrl && (
                <img
                  src={profile.data.imageUrl}
                  alt={profile.data.fullName}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="flex-1">
              <div className="mb-1">
                <span className="font-semibold text-sm text-foreground">
                  {profile?.data?.fullName || "You"}
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
      <div className="space-y-4">
        {displayedComments.map((comment) => (
          <div
            key={comment._id || `${comment.commenterId}-${comment.createdAt}`}
            className="flex items-start space-x-4 bg-card p-4 rounded-lg border border-border"
          >
            {/* Avatar Placeholder */}
            <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
              {comment.image && (
                <img
                  src={comment.image}
                  alt={comment.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Comment Content */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm text-foreground">
                  {comment.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {comment.text}
              </p>

              {/* Actions */}
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <button className="flex items-center space-x-1 hover:text-foreground transition-colors">
                  <Heart className="w-4 h-4" />
                  <span>Like ({comment.likes})</span>
                </button>
                {profile?.data?._id === comment.commenterId && (
                  <button
                    className="flex items-center space-x-1 hover:text-destructive transition-colors"
                    onClick={() =>
                      comment._id && handleDeleteComment(comment._id)
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less Buttons */}
      <div className="flex flex-col gap-2 mt-4">
        {hasMoreComments && (
          <button
            onClick={handleShowMore}
            className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2 border border-border rounded-lg hover:bg-accent"
          >
            <MessageCircle className="w-4 h-4" />
            Show More Comments ({localComments.length - visibleComments}{" "}
            remaining)
          </button>
        )}
        {visibleComments > 1 && (
          <button
            onClick={handleShowLess}
            className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2 border border-border rounded-lg hover:bg-accent"
          >
            <MessageCircle className="w-4 h-4" />
            Show Less
          </button>
        )}
      </div>
    </div>
  );
}
