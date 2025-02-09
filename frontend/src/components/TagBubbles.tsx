import React, { useState } from 'react';

interface TagBubblesProps {
  tags: string[];
  onTagSelect: (tag: string) => void;
  onTagDeselect: (tag: string) => void;
}

export const TagBubbles: React.FC<TagBubblesProps> = ({ tags, onTagSelect, onTagDeselect }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
      onTagDeselect(tag);
    } else {
      setSelectedTags([...selectedTags, tag]);
      onTagSelect(tag);
    }
  };

  return (
    <div className="flex overflow-x-auto space-x-2 p-2">
      {tags.map(tag => (
        <button
          key={tag}
          data-testid={`tag-${tag}`} // Add unique data-testid based on tag name
          onClick={() => handleTagClick(tag)}
          className={`px-3 py-1 rounded-full border ${selectedTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};
