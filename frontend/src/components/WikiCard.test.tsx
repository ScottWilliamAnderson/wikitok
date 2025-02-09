// frontend/src/components/WikiCard.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { test, expect, jest } from "bun:test";
import { WikiCard, WikiArticle } from "./WikiCard";
import { LikedArticlesProvider } from "../contexts/LikedArticlesContext";

// We create a fake article for testing
const fakeArticle: WikiArticle = {
  title: "Test Article",
  extract: "This is a test extract for the article.",
  pageid: 123,
  url: "http://example.com",
  thumbnail: {
    source: "http://example.com/image.jpg",
    width: 400,
    height: 300,
  },
  tags: ["test", "example"],
};

test("WikiCard renders article title and handles tag selection", () => {
  const onTagSelect = jest.fn();
  const onTagDeselect = jest.fn();

  // Wrap the WikiCard in the LikedArticlesProvider so that context is provided.
  const { getByText } = render(
    <LikedArticlesProvider>
      <WikiCard article={fakeArticle} onTagSelect={onTagSelect} onTagDeselect={onTagDeselect} />
    </LikedArticlesProvider>
  );

  // Check that the article title is rendered
  expect(getByText("Test Article")).toBeDefined();

  // Find one of the tags and simulate a click (selecting the tag)
  const tagButton = getByText("test");
  fireEvent.click(tagButton);
  expect(onTagSelect).toHaveBeenCalledWith("test");

  // Click again to deselect
  fireEvent.click(tagButton);
  expect(onTagDeselect).toHaveBeenCalledWith("test");
});
