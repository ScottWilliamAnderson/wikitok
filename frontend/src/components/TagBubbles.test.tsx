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
  await waitFor(() => screen.getByText('history'));

  // Query all buttons with the text "history"
  const historyTag = screen.getAllByText('history')[0]; // Ensure we pick the first matching element

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

  const historyTag = await screen.findByText('history');
  expect(historyTag).toHaveStyle('font-size: 0.875rem'); // Check the font size
  expect(historyTag).toHaveStyle('min-width: 80px'); // Ensure minimum size for consistency
  expect(historyTag.classList.contains('bg-gray-200')).toBe(true); // Initially unselected, expect bg-gray-200
});
