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

  // Query the correct tag
  const historyTag = screen.getAllByText('history')[0];

  // Check initial state (not selected)
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

test('should render tags with correct style and size', async () => {
  const tags = ['history', 'Rome', 'person'];
  render(
    <TagBubbles tags={tags} onTagSelect={jest.fn()} onTagDeselect={jest.fn()} />
  );

  const historyTag = await screen.findByText('history');
