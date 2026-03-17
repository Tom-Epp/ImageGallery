import React, { useEffect, useState } from 'react';

interface SearchFieldProps {
  onSearch: (value: string) => void;
}

export const SearchField = ({ onSearch }: SearchFieldProps) => {
  const [search, setSearch] = useState('');

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

  useEffect(() => {
    if (search === '') return;
    const delay = setTimeout(() => {
      onSearch(search);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, onSearch]);

  return (
    <>
      <label htmlFor="search" className="sr-only text-zinc-900 dark:text-zinc-100 ">
        Search photos
      </label>
      <input
        id="search"
        type="text"
        placeholder="Search..."
        value={search}
        onChange={handleOnChange}
        className="w-full p-2 my-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600"
      />
    </>
  );
};
