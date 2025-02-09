import { render, fireEvent } from '@testing-library/react';
import { TagBubbles } from './TagBubbles';

test('should toggle tags on click and apply correct styles', () => {
  const tags = ['history', 'Rome', 'person'];
  const onTagSelect = jest.fn();
  const onTagDeselect = jest.fn();

  const { getByText } = render(
    <TagBubbles tags={tags} onTagSelect={onTagSelect} onTagDeselect={onTagDeselect} />
  );

  // Initial state (not selected)
  const historyTag = getByText('history');
  expect(historyTag.classList.contains('bg-gray-700')).toBe(true); // Check the initial non-selected style

  // Click to select
  fireEvent.click(historyTag);
  expect(onTagSelect).toHaveBeenCalledWith('history');
  expect(historyTag.classList.contains('bg-blue-500')).toBe(true); // Check selected style

  // Click again to deselect
  fireEvent.click(historyTag);
  expect(onTagDeselect).toHaveBeenCalledWith('history');
  expect(historyTag.classList.contains('bg-gray-700')).toBe(true); // Check deselected style
});

test('should render tags with correct style and size', () => {
  const tags = ['history', 'Rome', 'person'];
  const { getByText } = render(
    <TagBubbles tags={tags} onTagSelect={jest.fn()} onTagDeselect={jest.fn()} />
  );

  const historyTag = getByText('history');
  expect(historyTag).toHaveStyle('font-size: 0.875rem'); // Check the font size
  expect(historyTag).toHaveStyle('min-width: 80px'); // Ensure minimum size for consistency
  expect(historyTag.classList.contains('bg-gray-700')).toBe(true); // Check initial non-selected style
});
