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
  await waitFor(() => screen.getByTestId('tag-history-0')); // Wait for the first tag (index 0)

  // Query the history tag using its test id
  const historyTag = screen.getByTestId('tag-history-0');

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

test('should render tags with correct style and size', async () => {
  const tags = ['history', 'Rome', 'person'];
  render(
    <TagBubbles tags={tags} onTagSelect={jest.fn()} onTagDeselect={jest.fn()} />
  );

  // Query the history tag using its test id
  const historyTag = await screen.findByTestId('tag-history-0');
  expect(historyTag).toHaveStyle('font-size: 0.875rem'); // Check the font size
  expect(historyTag).toHaveStyle('min-width: 80px'); // Ensure minimum size for consistency
  expect(historyTag.classList.contains('bg-gray-200')).toBe(true); // Initially unselected, expect bg-gray-200
});
