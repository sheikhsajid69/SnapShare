import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import PostCard from "@/components/PostCard";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Loader2 } from "lucide-react";

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    if (!user) return;

    try {
      // Get posts from followed users (including own posts)
      const { data: followingData } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user.id);

      const followingIds = followingData?.map((f) => f.following_id) || [];
      const userIds = [user.id, ...followingIds];

      // Fetch posts
      const { data: postsData } = await supabase
        .from("posts")
        .select(`
          *,
          profiles (id, username, avatar_url)
        `)
        .in("user_id", userIds)
        .order("created_at", { ascending: false });

      setPosts(postsData || []);

      // Fetch all likes and comments for these posts
      if (postsData && postsData.length > 0) {
        const postIds = postsData.map((p) => p.id);

        const { data: likesData } = await supabase
          .from("likes")
          .select("*")
          .in("post_id", postIds);

        const { data: commentsData } = await supabase
          .from("comments")
          .select(`
            *,
            profiles (id, username, avatar_url)
          `)
          .in("post_id", postIds)
          .order("created_at", { ascending: true });

        setLikes(likesData || []);
        setComments(commentsData || []);
      }
    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();

    // Subscribe to realtime updates
    const postsChannel = supabase
      .channel("posts-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        () => fetchFeed()
      )
      .subscribe();

    const likesChannel = supabase
      .channel("likes-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "likes" },
        () => fetchFeed()
      )
      .subscribe();

    const commentsChannel = supabase
      .channel("comments-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        () => fetchFeed()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(likesChannel);
      supabase.removeChannel(commentsChannel);
    };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      
      <main className="max-w-lg mx-auto pt-4 px-4 space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No posts yet. Follow some users or create your first post!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              likes={likes.filter((like) => like.post_id === post.id)}
              comments={comments.filter((comment) => comment.post_id === post.id)}
              onLikeToggle={fetchFeed}
              onCommentAdded={fetchFeed}
            />
          ))
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Feed;