
import { Input } from "~/components/ui/input";

interface RecordSearchProps {
  onSearch: (query: string) => void;
  matches: number[];
  matchIndex: number;
  noMatch: boolean;
  placeholder?: string;
  className?: string;
  searchRef?: React.RefObject<HTMLInputElement | null>; // ✅ add this
}

export function RecordSearch({
  onSearch,
  matches,
  matchIndex,
  noMatch,
  placeholder = "Search...",
  className = "",
  searchRef, // ✅ correct spelling here
}: RecordSearchProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isComposing = (e.nativeEvent as any).isComposing;
    if (isComposing) return;

    if (e.key === "Enter") {
      e.preventDefault();
      onSearch(searchRef?.current?.value || "");
      searchRef?.current?.focus();
      e.stopPropagation();
    }
  };

  return (
    <div
      className={`flex whitespace-nowrap gap-4 items-baseline justify-end ${className}`}
    >
      {matches.length > 0 ? (
        <span className="text-xs text-muted-foreground block">
          {matchIndex + 1} / {matches.length}
        </span>
      ) : noMatch ? (
        <div className="text-xs text-rose-500 text-right mt-[-12px] mb-2">
          No matches
        </div>
      ) : null}

      <Input
        ref={searchRef} // ✅ use the hook ref here
        placeholder={placeholder}
        className="mb-4 bg-primary/10 w-50 sm:w-60 h-7 text-xs"
        inputMode="search"
        enterKeyHint="enter"
        type="search"
        onChange={(e) => onSearch(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
