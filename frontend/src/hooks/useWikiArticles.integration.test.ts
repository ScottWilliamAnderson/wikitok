// frontend/src/hooks/useWikiArticles.integration.test.ts
import { test, expect } from "bun:test";
import { renderHook } from "@testing-library/react-hooks";
import { useWikiArticles } from "./useWikiArticles";

/**
 * Integration test for useWikiArticles that uses real Wikipedia data.
 *
 * To run this test, set the environment variable RUN_INTEGRATION_TESTS=true.
 * Example:
 *   RUN_INTEGRATION_TESTS=true bun test --preload ./frontend/test-setup.ts
 */
test("integration: useWikiArticles fetches real Wikipedia articles", async () => {
  // Skip the integration test unless the environment variable is set.
  if (!process.env.RUN_INTEGRATION_TESTS) {
    console.log("Skipping integration test: RUN_INTEGRATION_TESTS not set.");
    return;
  }

  // Render the hook (using real network fetch, not a mock)
  const { result, waitForNextUpdate } = renderHook(() => useWikiArticles());

  // Trigger fetching of articles.
  result.current.fetchArticles();

  // Wait for the hook to update its state (articles to be added).
  await waitForNextUpdate();

  // Verify that we have fetched at least one article.
  expect(result.current.articles.length).toBeGreaterThan(0);

  // Log the real article details for visibility
  const article = result.current.articles[0];
  console.log(`Fetched real article: ${article.title}`);
  console.log(`Article URL: ${article.url}`);
  console.log(`Article Extract: ${article.extract}`);

  // Optionally, verify that the first article has the expected properties.
  expect(article.title).toBeTruthy();
  expect(article.extract).toBeTruthy();
});
