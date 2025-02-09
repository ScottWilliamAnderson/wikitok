import { useState, useCallback } from "react";
import { useLocalization } from "./useLocalization";
import type { WikiArticle } from "../components/WikiCard";

// helper to preload an image
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = reject;
  });
};

/**
 * useWikiArticles hook
 * @returns articles, loading state and a function to fetch more articles
 */
export function useWikiArticles() {
  const [articles, setArticles] = useState<WikiArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [buffer, setBuffer] = useState<WikiArticle[]>([]);
  const { currentLanguage } = useLocalization();

  const fetchArticles = async (forBuffer = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(
        currentLanguage.api +
          new URLSearchParams({
            action: "query",
            format: "json",
            generator: "random",
            grnnamespace: "0",
            prop: "extracts|pageimages|info|categories",
            inprop: "url",
            // increase number of articles to preload
            grnlimit: "1000",
            exintro: "1",
            exlimit: "max",
            exsentences: "5",
            explaintext: "1",
            piprop: "thumbnail",
            pithumbsize: "400",
            origin: "*",
          })
      );

      const data = await response.json();
      const newArticles = Object.values(data.query.pages)
        .map((page: any): WikiArticle => ({
          title: page.title,
          extract: page.extract,
          pageid: page.pageid,
          thumbnail: page.thumbnail,
          url: page.canonicalurl,
          // limit tags to the first three categories per article
          tags: page.categories ? page.categories.map((cat: any) => cat.title).slice(0, 3) : [],
        }))
        .filter(
          (article) =>
            article.thumbnail &&
            article.thumbnail.source &&
            article.url &&
            article.extract
        );

      // preload all thumbnails
      await Promise.allSettled(
        newArticles
          .filter((article) => article.thumbnail)
          .map((article) => preloadImage(article.thumbnail!.source))
      );

      if (forBuffer) {
        setBuffer(newArticles);
      } else {
        setArticles((prev) => [...prev, ...newArticles]);
        // fetch more articles into the buffer
        fetchArticles(true);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
    setLoading(false);
  };

  // when more articles are needed, use the buffer or fetch more
  const getMoreArticles = useCallback(() => {
    if (buffer.length > 0) {
      setArticles((prev) => [...prev, ...buffer]);
      setBuffer([]);
      fetchArticles(true);
    } else {
      fetchArticles(false);
    }
  }, [buffer]);

  return { articles, loading, fetchArticles: getMoreArticles };
}