import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Grid, Loader2, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const Profile = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = user?.id === userId;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        setProfile(profileData);

        // Fetch posts
        const { data: postsData } = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        setPosts(postsData || []);

        // Fetch stats
        const { count: followersCount } = await supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("following_id", userId);

        const { count: followingCount } = await supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("follower_id", userId);

        setStats({
          posts: postsData?.length || 0,
          followers: followersCount || 0,
          following: followingCount || 0,
        });

        // Check if current user follows this profile
        if (user && !isOwnProfile) {
          const { data: followData } = await supabase
            .from("follows")
            .select("*")
            .eq("follower_id", user.id)
            .eq("following_id", userId)
            .maybeSingle();

          setIsFollowing(!!followData);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, user, isOwnProfile]);

  const handleFollow = async () => {
    if (!user || isOwnProfile) return;

    try {
      if (isFollowing) {
        await supabase
          .from("follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", userId);
        setIsFollowing(false);
        setStats((prev) => ({ ...prev, followers: prev.followers - 1 }));
      } else {
        await supabase.from("follows").insert({
          follower_id: user.id,
          following_id: userId,
        });
        setIsFollowing(true);
        setStats((prev) => ({ ...prev, followers: prev.followers + 1 }));
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        {/* Profile Info */}
        <div className="space-y-6">
          <div className="flex items-center space-x-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-2xl">
                {profile.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold">{profile.username}</h1>
                {isOwnProfile ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/edit-profile")}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    size="sm"
                    onClick={handleFollow}
                    className={!isFollowing ? "bg-gradient-instagram hover:opacity-90" : ""}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                )}
              </div>

              <div className="flex space-x-6 text-sm">
                <div>
                  <span className="font-semibold">{stats.posts}</span> posts
                </div>
                <div>
                  <span className="font-semibold">{stats.followers}</span> followers
                </div>
                <div>
                  <span className="font-semibold">{stats.following}</span> following
                </div>
              </div>
            </div>
          </div>

          {profile.bio && (
            <p className="text-sm">{profile.bio}</p>
          )}
        </div>

        {/* Posts Grid */}
        <div className="mt-8 border-t border-border pt-4">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Grid className="w-4 h-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">Posts</span>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No posts yet
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="aspect-square bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img
                    src={post.image_url}
                    alt={post.caption || "Post"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;