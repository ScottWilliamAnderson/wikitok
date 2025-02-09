import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { TagBubbles } from './TagBubbles';

test('should toggle tags on click and apply correct styles', async () => {
  const tags = ['history', 'Rome', 'person'];
  const onTagSelect = jest.fn();
  const onTagDeselect = jest.fn();

  render(
      <TagBubbles tags={tags} onTagSelect={onTagSelect} onTagDeselect={onTagDeselect} />
  );

  // Wait for the elements to be rendered
  await waitFor(() => screen.getByTestId('tag-history-0'));

  // Query all elements with the same test id and make sure we're interacting with the right one
  const historyTags = screen.queryAllByTestId('tag-history-0');
  expect(historyTags.length).toBe(1);  // Expect only one "history" tag to be rendered
  const historyTag = historyTags[0];

  // Check initial state (not selected)
  expect(historyTag.classList.contains('bg-gray-200')).toBe(true); // Initially unselected, expect bg-gray-200

  // Click to select
  fireEvent.click(historyTag);
  expect(onTagSelect).toHaveBeenCalledWith('history');
  expect(historyTag.classList.contains('bg-blue-500')).toBe(true); // Should change to selected style

  // Click again to deselect
  fireEvent.click(historyTag);
  expect(onTagDeselect).toHaveBeenCalledWith('history');
  expect(historyTag.classList.contains('bg-gray-200')).toBe(true); // Should revert to original style
  });
