import { useEffect, useRef, useCallback, useState } from "react";
import { WikiCard } from "./components/WikiCard";
import { Loader2, Search, X, Download } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import { LanguageSelector } from "./components/LanguageSelector";
import { useLikedArticles } from "./contexts/LikedArticlesContext";
import { useWikiArticles } from "./hooks/useWikiArticles";

function App() {
  const [showAbout, setShowAbout] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  // state for global tag filtering
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { articles, loading, fetchArticles } = useWikiArticles();
  const { likedArticles, toggleLike } = useLikedArticles();
  const observerTarget = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  // global handlers for tag filter changes
  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev : [...prev, tag]
    );
  };

  const handleTagDeselect = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  // compute available tags from the articles (using frequency to select the most common)
  const tagFrequency: { [tag: string]: number } = {};
  articles.forEach((article) => {
    (article.tags || []).forEach((tag) => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
    });
  });
  const availableTags = Object.keys(tagFrequency)
    .sort((a, b) => tagFrequency[b] - tagFrequency[a])
    .slice(0, 10);

  // filter articles based on selected tags (if any)
  const filteredArticles = articles.filter((article) => {
    if (selectedTags.length === 0) return true;
    return article.tags?.some((tag) => selectedTags.includes(tag));
  });

  // intersection observer for infinite scrolling
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !loading) {
        fetchArticles();
      }
    },
    [loading, fetchArticles]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: "100px",
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const filteredLikedArticles = likedArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.extract.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ... existing handlers like handleExport remain the same

  return (
    <div className="h-screen w-full bg-black text-white overflow-y-scroll snap-y snap-mandatory">
      {/* existing fixed header and buttons */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => window.location.reload()}
          className="text-2xl font-bold text-white drop-shadow-lg hover:opacity-80 transition-opacity"
        >
          WikiTok
        </button>
      </div>
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
        <button
          onClick={() => setShowAbout(!showAbout)}
          className="text-sm text-white/70 hover:text-white transition-colors"
        >
          About
        </button>
        <button
          onClick={() => setShowLikes(!showLikes)}
          className="text-sm text-white/70 hover:text-white transition-colors"
        >
          Likes
        </button>
        <LanguageSelector />
      </div>

      {/* Global Tag Filter Bar (fixed near the bottom) */}
      <div className="fixed bottom-4 left-4 right-4 z-40">
        <div className="bg-gray-800 bg-opacity-70 rounded-full px-2 py-1 overflow-x-auto flex space-x-2">
          {availableTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() =>
                  isSelected ? handleTagDeselect(tag) : handleTagSelect(tag)
                }
                className={`px-3 py-1 rounded-full border transition-colors ${
                  isSelected
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-200 text-black border-gray-300"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Render articles using the filtered list */}
      {filteredArticles.map((article) => (
        <WikiCard
          key={article.pageid}
          article={article}
          onTagSelect={handleTagSelect}
          onTagDeselect={handleTagDeselect}
        />
      ))}

      <div ref={observerTarget} className="h-10 -mt-1" />
      {loading && (
        <div className="h-screen w-full flex items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      )}
      <Analytics />
    </div>
  );
}

export default App;
