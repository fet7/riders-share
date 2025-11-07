import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  // Use useRef for values that don't need re-renders
  const validationErrorsRef = useRef<Record<string, string[]>>({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});

  // Search-related state
  const matchesRef = useRef<number[]>([]);
  const [matches, setMatches] = useState<number[]>([]);
  const [matchIndex, setMatchIndex] = useState(0);
  const [noMatch, setNoMatch] = useState(false);
  const lastQueryRef = useRef("");
  const searchRef = useRef<HTMLInputElement | null>(null);
  const noMatchTimeoutRef = useRef<number | null>(null);

  // State for rollback
  const backupRecordsRef = useRef<T[] | null>(null);
  const backupIndexRef = useRef<number | null>(null);
  const backupFormRef = useRef<Partial<T> | null>(null);

  const total = records.length;

  // Memoize expensive calculations
  const generateNextId = useCallback((): string => {
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
  }, [records, idField, idPattern]);

  // Optimized clearSearch
  const clearSearch = useCallback(() => {
    if (searchRef.current) searchRef.current.value = "";
    matchesRef.current = [];
    setMatches([]);
    setMatchIndex(0);
    setNoMatch(false);
    lastQueryRef.current = "";

    if (noMatchTimeoutRef.current) {
      window.clearTimeout(noMatchTimeoutRef.current);
      noMatchTimeoutRef.current = null;
    }
  }, []);

  // Handle record changes
  const handleAddNew = useCallback(
    (template?: Partial<T>) => {
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
    },
    [isDirty, generateNextId, idField, records.length, clearSearch]
  );

  // Memoized navigation
  const handleNavigate = useCallback(
    (dir: "next" | "prev" | "first" | "last") => {
      backupRecordsRef.current = null;
      backupIndexRef.current = null;
      backupFormRef.current = null;
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
    },
    [index, total, records, clearSearch]
  );

  function arraysEqual(a: any[], b: any[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  }

  const playBeep = useCallback(() => {
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
  }, []);

  // Optimized search function
  const handleSearch = useCallback(
    (query: string, searchFields: (keyof T)[]) => {
      const q = query.toLowerCase().trim();
      if (!q) {
        matchesRef.current = [];
        setMatches([]);
        setMatchIndex(0);
        setNoMatch(false);
        lastQueryRef.current = "";
        return;
      }

      // Use requestAnimationFrame for non-blocking search
      requestAnimationFrame(() => {
        const foundIndices: number[] = [];

        for (let i = 0; i < records.length; i++) {
          const record = records[i];
          for (const field of searchFields) {
            const value = String(record[field] || "").toLowerCase();
            if (value.includes(q)) {
              foundIndices.push(i);
              break; // No need to check other fields for this record
            }
          }
        }

        if (foundIndices.length === 0) {
          matchesRef.current = [];
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

        const isSameQuery =
          q === lastQueryRef.current &&
          arraysEqual(foundIndices, matchesRef.current);

        matchesRef.current = foundIndices;
        lastQueryRef.current = q;
        setMatches(foundIndices);

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
      });
    },
    [records, matchIndex, playBeep]
  );

  // Optimized handleSubmit
  const handleSubmit = useCallback(
    (actionType: "create" | "update" | "delete") => {
      // Clear any previous backup
      backupRecordsRef.current = [...records];
      backupIndexRef.current = index;
      backupFormRef.current = { ...form };

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

      const endpoint = endpoints[actionType];
      fetcher.submit(fd, { method: "post", action: endpoint });
    },
    [form, index, records, idField, endpoints, fetcher]
  );

  // Optimized fetcher effect
  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;

    const data = fetcher.data;
    if (data.processed) return;

    // Handle validation errors
    if (data?.errors) {
      data.processed = true;
      validationErrorsRef.current = data.errors;
      setValidationErrors(data.errors);
      toast.error("❌ Please fix the validation errors below.");
      return;
    }

    if (data?.success && data.actionType) {
      const { actionType, record } = data;

      // Mark as processed to prevent re-processing
      data.processed = true;

      // Clear validation errors on success
      validationErrorsRef.current = {};
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

      backupRecordsRef.current = null;
      backupIndexRef.current = null;
      backupFormRef.current = null;

      setIsNew(false);
      setIsDirty(false);
      clearSearch();
    } else if (data?.error && backupRecordsRef.current) {
      // Mark as processed to prevent re-processing
      data.processed = true;

      setRecords(backupRecordsRef.current);
      if (backupIndexRef.current !== null) setIndex(backupIndexRef.current);
      if (backupFormRef.current) setForm(backupFormRef.current);

      backupRecordsRef.current = null;
      backupIndexRef.current = null;
      backupFormRef.current = null;

      toast.error(`❌ Operation failed: ${data.error}`);
      onRecordsChange?.(backupRecordsRef.current || []);
    }
  }, [
    fetcher.state,
    fetcher.data,
    index,
    records,
    onRecordsChange,
    clearSearch,
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
  }, [form, validationErrors]);

  // Memoize the return value
  const api = useMemo(
    () => ({
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
    }),
    [
      records,
      form,
      index,
      isNew,
      isDirty,
      total,
      matches,
      matchIndex,
      noMatch,
      validationErrors,
      handleAddNew,
      handleNavigate,
      handleSearch,
      handleSubmit,
      clearSearch,
      fetcher,
    ]
  );

  return api;
}
