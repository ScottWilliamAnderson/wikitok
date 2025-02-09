import { Share2, Heart } from "lucide-react";
import { useState } from "react";
import { useLikedArticles } from "../contexts/LikedArticlesContext";
import { TagBubbles } from "./TagBubbles";

export interface WikiArticle {
  title: string;
  extract: string;
  pageid: number;
  url: string;
  thumbnail: {
    source: string;
    width: number;
    height: number;
  };
  tags?: string[];
}

interface WikiCardProps {
  article: WikiArticle;
  // optional callbacks for tag selection (from the global filter)
  onTagSelect?: (tag: string) => void;
  onTagDeselect?: (tag: string) => void;
}

export function WikiCard({ article, onTagSelect, onTagDeselect }: WikiCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { toggleLike, isLiked } = useLikedArticles();

  // local fallback functions if no global handler is provided
  const localTagSelect = (tag: string) => {
    console.log(`Tag selected: ${tag}`);
  };

  const localTagDeselect = (tag: string) => {
    console.log(`Tag deselected: ${tag}`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.extract || "",
          url: article.url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      await navigator.clipboard.writeText(article.url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center snap-start relative">
      <div className="h-full w-full relative">
        {article.thumbnail ? (
          <div className="absolute inset-0">
            <img
              loading="lazy"
              src={article.thumbnail.source}
              alt={article.title}
              className={`w-full h-full object-cover transition-opacity duration-300 bg-white ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                console.error("Image failed to load:", e);
                setImageLoaded(true);
              }}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-900 animate-pulse" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gray-900" />
        )}
        {/* Content container */}
        <div className="absolute bottom-[10vh] left-0 right-0 p-6 text-white z-10">
          <div className="flex justify-between items-start mb-3">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition-colors"
            >
              <h2 className="text-2xl font-bold drop-shadow-lg">
                {article.title}
              </h2>
            </a>
            <div className="flex gap-2">
              <button
                onClick={() => toggleLike(article)}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  isLiked(article.pageid)
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-white/10 hover:bg-white/20"
                }`}
                aria-label="Like article"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isLiked(article.pageid) ? "fill-white" : ""
                  }`}
                />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                aria-label="Share article"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-gray-100 mb-4 drop-shadow-lg line-clamp-6">
            {article.extract}
          </p>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-white hover:text-gray-200 drop-shadow-lg"
          >
            Read more →
          </a>
          {article.tags && (
            <TagBubbles
              tags={article.tags}
              onTagSelect={onTagSelect ?? localTagSelect}
              onTagDeselect={onTagDeselect ?? localTagDeselect}
            />
          )}
        </div>
      </div>
    </div>
  );
}
