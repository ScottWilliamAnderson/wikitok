import { test, expect, vi } from 'bun:test';
import { renderHook, act } from '@testing-library/react-hooks';
import { useWikiArticles } from './useWikiArticles';

// Mock the fetch function for this test
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      query: {
        pages: {
          1: {
            title: 'Article 1',
            extract: 'Summary of Article 1',
            pageid: 1,
            canonicalurl: 'http://example.com/1',
            categories: [{ title: 'History' }],
          },
          2: {
            title: 'Article 2',
            extract: 'Summary of Article 2',
            pageid: 2,
            canonicalurl: 'http://example.com/2',
            categories: [{ title: 'Science' }],
          },
        },
      },
    }),
  }) as any
);

test('useWikiArticles fetches and processes articles with tags', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useWikiArticles());

  // Trigger fetching of articles
  act(() => {
    result.current.fetchArticles();
  });

  // Wait for the hook to update with the articles
  await waitForNextUpdate();

  // Verify articles were fetched correctly
  expect(result.current.articles).toHaveLength(2);
  expect(result.current.articles[0].tags).toContain('History');
  expect(result.current.articles[1].tags).toContain('Science');
});
