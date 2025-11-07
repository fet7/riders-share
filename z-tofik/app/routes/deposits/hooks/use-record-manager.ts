import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";

interface UseRecordManagerProps<T> {
  initialRecords: T[];
  endpoints: {
    create: string;
    update: string;
    delete: string;
  };
  idField: keyof T;
  idPattern?: string;
  onRecordsChange?: (records: T[]) => void;
}

export function useRecordManager<T extends Record<string, any>>({
  initialRecords,
  endpoints,
  idField,
  idPattern = "REC{00000}",
  onRecordsChange,
}: UseRecordManagerProps<T>) {
  const fetcher = useFetcher();
  const [records, setRecords] = useState<T[]>(initialRecords);
  const [index, setIndex] = useState(0);
  const [form, setForm] = useState<Partial<T>>(initialRecords[0] || {});
  const [isNew, setIsNew] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // validation errors state
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});

  // Search-related state
  const [matches, setMatches] = useState<number[]>([]);
  const [matchIndex, setMatchIndex] = useState(0);
  const [noMatch, setNoMatch] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const searchRef = useRef<HTMLInputElement | null>(null);
  const noMatchTimeoutRef = useRef<number | null>(null);

  // State for rollback
  const [backupRecords, setBackupRecords] = useState<T[] | null>(null);
  const [backupIndex, setBackupIndex] = useState<number | null>(null);
  const [backupForm, setBackupForm] = useState<Partial<T> | null>(null);

  const total = records.length;

  // In your useRecordManager hook - modify the generateNextId function
const generateNextId = (): string => {
  // For deposits, find existing DP IDs and increment
  if (idField === "deposit_id") {
    const depositIds = records
      .map((record) => record[idField] as string)
      .filter(id => id.startsWith("DP"))
      .map(id => {
        const numMatch = id.match(/DP(\d+)/);
        return numMatch ? parseInt(numMatch[1], 10) : 0;
      })
      .filter(n => !isNaN(n) && n > 0)
      .sort((a, b) => a - b);

    let nextNum = 1;
    if (depositIds.length > 0) {
      nextNum = Math.max(...depositIds) + 1;
    }

    return `DP${nextNum.toString().padStart(5, "0")}`;
  }

  // Original pattern-based generation for other record types
  const usedIds = records
    .map((record) => {
      const id = record[idField] as string;
      const numMatch = id.match(/\d+/);
      return numMatch ? parseInt(numMatch[0], 10) : 0;
    })
    .filter((n) => !isNaN(n))
    .sort((a, b) => a - b);

  let newNum = 1;
  for (let i = 0; i < usedIds.length; i++) {
    if (usedIds[i] !== i + 1) {
      newNum = i + 1;
      break;
    }
    newNum = usedIds.length + 1;
  }

  const match = idPattern.match(/\{0+\}/);
  const padLen = match ? Math.max(match[0].length - 2, 1) : 5;

  return idPattern.replace(/\{0+\}/, newNum.toString().padStart(padLen, "0"));
};

  // // Generate next ID based on pattern
  // const generateNextId = (): string => {
  //   const usedIds = records
  //     .map((record) => {
  //       const id = record[idField] as string;
  //       const numMatch = id.match(/\d+/);
  //       return numMatch ? parseInt(numMatch[0], 10) : 0;
  //     })
  //     .filter((n) => !isNaN(n))
  //     .sort((a, b) => a - b);

  //   let newNum = 1;
  //   for (let i = 0; i < usedIds.length; i++) {
  //     if (usedIds[i] !== i + 1) {
  //       newNum = i + 1;
  //       break;
  //     }
  //     newNum = usedIds.length + 1;
  //   }

  //   const match = idPattern.match(/\{0+\}/);
  //   const padLen = match ? Math.max(match[0].length - 2, 1) : 5;

  //   return idPattern.replace(/\{0+\}/, newNum.toString().padStart(padLen, "0"));
  // };

  // Handle record changes
  const handleAddNew = (template?: Partial<T>) => {
    if (isDirty) {
      const confirmDiscard = confirm(
        "You have unsaved changes. Discard and create a new record?"
      );
      if (!confirmDiscard) return;
    }

    clearSearch();

    const newId = generateNextId();
    const newRecord: T = {
      [idField]: newId,
      ...template,
    } as T;

    setForm(newRecord);
    setIsNew(true);
    setIsDirty(true);
    setIndex(records.length);
  };

  const handleNavigate = (dir: "next" | "prev" | "first" | "last") => {
    setBackupRecords(null);
    setBackupIndex(null);
    setBackupForm(null);
    clearSearch();

    let newIndex = index;
    if (dir === "next") newIndex = index + 1;
    if (dir === "prev") newIndex = index - 1;
    if (dir === "first") newIndex = 0;
    if (dir === "last") newIndex = total - 1;

    if (newIndex < 0) newIndex = 0;
    if (newIndex >= total) newIndex = total - 1;

    const nextRecord = records[newIndex];
    if (nextRecord) {
      setForm(nextRecord);
      setIndex(newIndex);
      setIsNew(false);
      setIsDirty(false);
    }
  };

  const handleSearch = (query: string, searchFields: (keyof T)[]) => {
    const q = query.toLowerCase();
    if (!q) {
      setMatches([]);
      setMatchIndex(0);
      setNoMatch(false);
      setLastQuery("");
      return;
    }

    const foundIndices = records
      .map((record, i) => ({
        i,
        match: searchFields.some((field) =>
          String(record[field] || "")
            .toLowerCase()
            .includes(q)
        ),
      }))
      .filter((x) => x.match)
      .map((x) => x.i);

    if (foundIndices.length === 0) {
      setMatches([]);
      setMatchIndex(0);
      setNoMatch(true);
      playBeep();

      if (noMatchTimeoutRef.current) {
        window.clearTimeout(noMatchTimeoutRef.current);
      }
      noMatchTimeoutRef.current = window.setTimeout(() => {
        setNoMatch(false);
        noMatchTimeoutRef.current = null;
      }, 2000);
      return;
    }

    const isSameQuery = q === lastQuery && arraysEqual(foundIndices, matches);
    setMatches(foundIndices);
    setLastQuery(q);

    if (!isSameQuery) {
      setMatchIndex(0);
      setIndex(foundIndices[0]);
      setForm(records[foundIndices[0]]);
    } else {
      const nextMatch = (matchIndex + 1) % foundIndices.length;
      setMatchIndex(nextMatch);
      setIndex(foundIndices[nextMatch]);
      setForm(records[foundIndices[nextMatch]]);
    }
  };

  function arraysEqual(a: any[], b: any[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  }

  const clearSearch = () => {
    if (searchRef.current) searchRef.current.value = "";
    setMatches([]);
    setMatchIndex(0);
    setNoMatch(false);
    setLastQuery("");

    if (noMatchTimeoutRef.current) {
      window.clearTimeout(noMatchTimeoutRef.current);
      noMatchTimeoutRef.current = null;
    }
  };

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 600;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close();
      }, 150);
    } catch {}
  };

  // optimistic updates + rollback-safe
  const handleSubmit = (actionType: "create" | "update" | "delete") => {
    // Clear any previous backup
    setBackupRecords(null);
    setBackupIndex(null);
    setBackupForm(null);

    setBackupRecords([...records]);
    setBackupIndex(index);
    setBackupForm({ ...form });

    if (actionType === "create") {
      const optimisticRecord = { ...form, [idField]: form[idField] } as T;
      setRecords((prev) => {
        const updated = [...prev, optimisticRecord];
        setIndex(updated.length - 1);
        setForm(optimisticRecord);
        return updated;
      });
    } else if (actionType === "update") {
      setRecords((prev) => {
        const updated = prev.map((r, i) =>
          i === index ? ({ ...r, ...form } as T) : r
        );
        const updatedRecord = updated[index] as T;
        setForm(updatedRecord || {});
        return updated;
      });
    } else if (actionType === "delete") {
      setRecords((prev) => {
        const updated = prev.filter((_, i) => i !== index);
        const newIndex = Math.max(0, index - 1);
        setIndex(Math.min(newIndex, Math.max(0, updated.length - 1)));
        setForm(
          updated[Math.min(newIndex, Math.max(0, updated.length - 1))] || {}
        );
        return updated;
      });
    }

    setIsNew(false);
    setIsDirty(false);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, v.toString());
    });
    fd.append("_action", actionType);
    // fd.append("simulateError", "true"); // 🧪 force the server to fail

    const endpoint = endpoints[actionType];
    fetcher.submit(fd, { method: "post", action: endpoint });
  };

  // fetcher synchronization + rollback with validation errors
  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;

    const data = fetcher.data;

    // Prevent processing the same data multiple times
    if (data.processed) return;

    // Handle validation errors
    if (data?.errors) {
      data.processed = true;
      setValidationErrors(data.errors);
      toast.error("❌ Please fix the validation errors below.");
      return;
    }

    if (data?.success && data.actionType) {
      const { actionType, record } = data;

      // Mark as processed to prevent re-processing
      data.processed = true;

      // Clear validation errors on success
      setValidationErrors({});

      if (actionType === "create" && record) {
        setRecords((prev) => {
          // Check if this record already exists to avoid duplicates
          const exists = prev.some((r) => r[idField] === record[idField]);
          if (exists) return prev;

          const replaced =
            prev.length > 0 ? [...prev.slice(0, -1), record] : [record];
          setIndex(replaced.length - 1);
          setForm(record);
          onRecordsChange?.(replaced);
          return replaced;
        });
        toast.success(`✅ Record created successfully!`);
      } else if (actionType === "update" && record) {
        setRecords((prev) => {
          const updated = prev.map((r, i) => (i === index ? record : r));
          setForm(record);
          onRecordsChange?.(updated);
          return updated;
        });
        toast.info(`📝 Record updated successfully.`);
      } else if (actionType === "delete") {
        toast.error("🗑️ Record deleted successfully.");
        onRecordsChange?.(records);
      }

      setBackupRecords(null);
      setBackupIndex(null);
      setBackupForm(null);

      setIsNew(false);
      setIsDirty(false);
      clearSearch();
    } else if (data?.error && backupRecords) {
      // Mark as processed to prevent re-processing
      data.processed = true;

      setRecords(backupRecords);
      if (backupIndex !== null) setIndex(backupIndex);
      if (backupForm) setForm(backupForm);

      setBackupRecords(null);
      setBackupIndex(null);
      setBackupForm(null);

      toast.error(`❌ Operation failed: ${data.error}`);
      onRecordsChange?.(backupRecords);
    }
  }, [
    fetcher.state,
    fetcher.data,
    index,
    backupRecords,
    backupIndex,
    backupForm,
    onRecordsChange,
    records,
  ]);

  // Dirty state tracking
  useEffect(() => {
    const current = records[index] || {};
    const dirty =
      JSON.stringify(form) !== JSON.stringify(current) ||
      (isNew && Object.values(form).some((v) => v));
    setIsDirty(dirty);
  }, [form, index, isNew, records]);

  // Clear validation errors when form changes
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors({});
    }
  }, [form]);

  return {
    records,
    form,
    index,
    isNew,
    isDirty,
    total,
    matches,
    matchIndex,
    noMatch,
    searchRef,
    validationErrors,

    setForm,
    handleAddNew,
    handleNavigate,
    handleSearch,
    handleSubmit,
    clearSearch,

    fetcher,
  };
}
