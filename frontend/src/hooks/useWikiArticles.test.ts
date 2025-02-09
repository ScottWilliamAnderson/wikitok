// frontend/src/hooks/useWikiArticles.test.ts
import { test, expect, jest } from "bun:test";
import { act } from "react-dom/test-utils";
import { renderHook } from "@testing-library/react-hooks";
import { useWikiArticles } from "./useWikiArticles";

// Create a fake Wikipedia API response
const fakeResponse = {
  query: {
    pages: {
      1: {
        title: "Fake Article",
        extract: "Fake extract.",
        pageid: 1,
        canonicalurl: "http://fake.url",
        thumbnail: { source: "http://fake.image", width: 400, height: 300 },
        categories: [{ title: "FakeCategory" }],
      },
      2: {
        title: "Another Fake Article",
        extract: "Another fake extract.",
        pageid: 2,
        canonicalurl: "http://fake2.url",
        thumbnail: { source: "http://fake2.image", width: 400, height: 300 },
        categories: [{ title: "AnotherCategory" }],
      },
    },
  },
};

test("useWikiArticles fetches articles and updates state", async () => {
  // Mock the global fetch function to return our fake response
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeResponse),
    } as any)
  );

  const { result, waitForNextUpdate } = renderHook(() => useWikiArticles());

  // Call the fetchArticles function (returned as getMoreArticles)
  act(() => {
    result.current.fetchArticles();
  });

  // Wait for the hook to update its state
  await waitForNextUpdate();

  // Check that articles have been added and that our fake article appears in the list
  expect(result.current.articles.length).toBeGreaterThan(0);
  expect(result.current.articles[0].title).toBe("Fake Article");

  // Optionally, you can restore the original fetch if needed:
  // global.fetch.mockRestore();
});
