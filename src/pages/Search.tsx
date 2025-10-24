import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search as SearchIcon } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);

    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .ilike("username", `%${searchQuery}%`)
        .limit(20);

      setResults(data || []);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      
      <main className="max-w-lg mx-auto p-4">
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-4">
          {results.map((profile) => (
            <div
              key={profile.id}
              onClick={() => navigate(`/profile/${profile.id}`)}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>{profile.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{profile.username}</p>
                {profile.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {query && results.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No users found
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Search;