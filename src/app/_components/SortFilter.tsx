import type { SortOrder } from '@/app/_types/filters.types';

const OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'most_liked', label: 'Most Liked' },
];

interface SortFilterProps {
  selected: SortOrder;
  onChange: (value: SortOrder) => void;
}

export const SortFilter = ({ selected, onChange }: SortFilterProps) => {
  return (
    <div className="flex gap-2 mb-4">
      {OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          aria-pressed={selected === value}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            selected === value
              ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
              : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
