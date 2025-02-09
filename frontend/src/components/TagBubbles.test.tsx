// frontend/src/components/TagBubbles.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { test, expect, jest } from "bun:test";
import { TagBubbles } from "./TagBubbles";

test("TagBubbles toggles tags on click", () => {
  const tags = ["history", "Rome", "person"];
  const onTagSelect = jest.fn();
  const onTagDeselect = jest.fn();

  // render the component with the provided tags and callbacks
  const { getByText } = render(
    <TagBubbles tags={tags} onTagSelect={onTagSelect} onTagDeselect={onTagDeselect} />
  );

  // click the first tag to select it
  const tagButton = getByText("history");
  fireEvent.click(tagButton);
  expect(onTagSelect).toHaveBeenCalledWith("history");

  // click the same tag to deselect it
  fireEvent.click(tagButton);
  expect(onTagDeselect).toHaveBeenCalledWith("history");
});
