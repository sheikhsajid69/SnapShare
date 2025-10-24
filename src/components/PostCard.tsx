import { useState } from "react";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
  post: {
    id: string;
    image_url: string;
    caption: string;
    created_at: string;
    profiles: {
      id: string;
      username: string;
      avatar_url: string;
    };
  };
  likes: any[];
  comments: any[];
  onLikeToggle: () => void;
  onCommentAdded: () => void;
}

const PostCard = ({ post, likes, comments, onLikeToggle, onCommentAdded }: PostCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isLiked = likes.some((like) => like.user_id === user?.id);
  const likeCount = likes.length;

  const handleLike = async () => {
    if (!user) return;

    try {
      if (isLiked) {
        const like = likes.find((l) => l.user_id === user.id);
        await supabase.from("likes").delete().eq("id", like.id);
      } else {
        await supabase.from("likes").insert({
          post_id: post.id,
          user_id: user.id,
        });
      }
      onLikeToggle();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;

    setSubmitting(true);
    try {
      await supabase.from("comments").insert({
        post_id: post.id,
        user_id: user.id,
        content: comment.trim(),
      });
      setComment("");
      onCommentAdded();
      toast({
        title: "Comment added",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate(`/profile/${post.profiles.id}`)}
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={post.profiles.avatar_url} />
            <AvatarFallback>{post.profiles.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold">{post.profiles.username}</span>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Image */}
      <div className="aspect-square bg-muted">
        <img
          src={post.image_url}
          alt={post.caption || "Post"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Actions */}
      <div className="p-3 space-y-2">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-auto hover:bg-transparent"
            onClick={handleLike}
          >
            <Heart
              className={`w-6 h-6 ${
                isLiked
                  ? "fill-[hsl(var(--like-red))] text-[hsl(var(--like-red))] animate-pulse-like"
                  : ""
              }`}
            />
          </Button>
          <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent">
            <MessageCircle className="w-6 h-6" />
          </Button>
        </div>

        {/* Like count */}
        {likeCount > 0 && (
          <p className="text-sm font-semibold">{likeCount} {likeCount === 1 ? "like" : "likes"}</p>
        )}

        {/* Caption */}
        {post.caption && (
          <p className="text-sm">
            <span className="font-semibold mr-2">{post.profiles.username}</span>
            {post.caption}
          </p>
        )}

        {/* Comments preview */}
        {comments.length > 0 && (
          <div className="space-y-1">
            {comments.slice(0, 2).map((comment) => (
              <p key={comment.id} className="text-sm">
                <span className="font-semibold mr-2">{comment.profiles.username}</span>
                {comment.content}
              </p>
            ))}
            {comments.length > 2 && (
              <button className="text-sm text-muted-foreground">
                View all {comments.length} comments
              </button>
            )}
          </div>
        )}

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground uppercase">
          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
        </p>
      </div>

      {/* Comment input */}
      <form onSubmit={handleComment} className="border-t border-border p-3 flex items-center space-x-3">
        <Input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
          disabled={submitting}
        />
        {comment.trim() && (
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="text-accent hover:text-accent/80 font-semibold"
            disabled={submitting}
          >
            Post
          </Button>
        )}
      </form>
    </div>
  );
};

export default PostCard;