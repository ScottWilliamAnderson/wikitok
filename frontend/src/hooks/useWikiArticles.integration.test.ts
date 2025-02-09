import { test, expect } from 'bun:test';
import { renderHook, act } from '@testing-library/react-hooks';
import { useWikiArticles } from './useWikiArticles';

test('integration: useWikiArticles fetches real Wikipedia articles', async () => {
  // Ensure the integration test runs only if the environment variable is set.
  if (!process.env.RUN_INTEGRATION_TESTS) {
    console.log('Skipping integration test: RUN_INTEGRATION_TESTS not set.');
    return;
  }

  const { result, waitForNextUpdate } = renderHook(() => useWikiArticles());

  // Trigger fetching of articles
  act(() => {
    result.current.fetchArticles();
  });

  // Wait for the hook to update with the articles (increase timeout)
  try {
    await waitForNextUpdate({ timeout: 5000 }); // Increase timeout
  } catch (e) {
    console.error('Error waiting for update:', e);
    throw e;
  }

  // Verify articles were fetched correctly
  expect(result.current.articles.length).toBeGreaterThan(0);

  // Optionally log the first article for visibility
  const firstArticle = result.current.articles[0];
  console.log(`Fetched real article: ${firstArticle.title}`);
  console.log(`Article URL: ${firstArticle.url}`);
  console.log(`Article Extract: ${firstArticle.extract}`);

  // Optionally, verify that the first article has the expected properties.
  expect(firstArticle.title).toBeTruthy();
  expect(firstArticle.extract).toBeTruthy();
});
