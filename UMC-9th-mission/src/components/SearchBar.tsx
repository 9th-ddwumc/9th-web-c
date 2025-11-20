import { useState, useEffect } from "react";
import useDebounce from "../hooks/useDebounce";

type SearchBarProps = {
  value: string;
  onChange: (v: string) => void;
};

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  // 1️⃣ 로컬 상태를 만들어서 즉시 input에 반영
  const [localValue, setLocalValue] = useState(value);

  // 2️⃣ 로컬 상태를 debounce
  const debouncedValue = useDebounce(localValue, 500);

  // 3️⃣ debounce가 바뀌면 부모에게 전달
  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return (
    <div className="w-full mb-4 flex items-center bg-white rounded-xl px-4 py-2">
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="flex-1 bg-transparent outline-none text-black placeholder-gray-400"
      />
    </div>
  );
};

export default SearchBar;
