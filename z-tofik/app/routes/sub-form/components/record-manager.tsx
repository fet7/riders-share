import { Plus } from "lucide-react";

import { useEffect } from "react";
import { ConfirmDialog } from "~/components/comfirm-dialog";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useRecordManager } from "../hooks/use-record-manager";
import type { RecordManagerConfig } from "../types/field-config";
import { DynamicForm } from "./dynamic-form";
import { RecordNavigation } from "./record-navigation";
import { RecordSearch } from "./record-search";

interface RecordManagerProps<T> extends RecordManagerConfig<T> {
  initialRecords: T[];
  title?: string;
  className?: string;
}

export function RecordManager<T extends Record<string, any>>({
  initialRecords,
  recordType,
  fields,
  endpoints,
  idField,
  idPattern,
  searchFields,
  newRecordTemplate,
  layout = "vertical",
  gridColumns = 1,
  title,
  className = "",
  onRecordsChange,
  onRecordChange,
}: RecordManagerProps<T>) {
  const {
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
    setForm,
    validationErrors,
    handleAddNew,
    handleNavigate,
    handleSearch,
    handleSubmit,
    fetcher,
  } = useRecordManager({
    initialRecords,
    endpoints,
    idField,
    idPattern,
    onRecordsChange,
  });

  // Call onRecordChange when the current record changes
  useEffect(() => {
    if (onRecordChange && records[index]) {
      onRecordChange(records[index]);
    }
  }, [records, index, onRecordChange]);

  const handleFormChange = (name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocalSearch = (query: string) => {
    handleSearch(query, searchFields);
  };

  return (
    <div className={`max-w-3xl mx-auto py-10 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="bg-primary p-2 sm:p-4 rounded-2xl">
            <div className="text-center text-secondary pt-2">
              {title || `${recordType} Record`}
              {isDirty && (
                <span className="text-amber-500 text-sm font-medium animate-pulse">
                  🟡
                </span>
              )}
            </div>
            <RecordNavigation
              currentIndex={index}
              totalRecords={total}
              onNavigate={handleNavigate}
              isNew={isNew}
              isDirty={isDirty}
              className="mt-4"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-x-4">
          {/* Search */}
          <RecordSearch
            onSearch={handleLocalSearch}
            matches={matches}
            matchIndex={matchIndex}
            noMatch={noMatch}
            placeholder={`Search by ${searchFields.join(", ")}...`}
            searchRef={searchRef}
          />

          {/* Dynamic Form */}
          <DynamicForm
            fields={fields}
            formData={form}
            onChange={handleFormChange}
            layout={layout}
            gridColumns={gridColumns}
            validationErrors={validationErrors}
          />

          {/* Actions */}
          <div className="flex gap-16 sm:gap-32 justify-end mt-8">
            <div>
              <Button
                variant="default"
                size="icon"
                onClick={() => handleAddNew(newRecordTemplate)}
                title={`Add new ${recordType}`}
                className="rounded-full"
                disabled={isNew && isDirty}
              >
                <Plus size={16} />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleSubmit(isNew ? "create" : "update")}
                disabled={!isDirty || fetcher.state !== "idle"}
              >
                {fetcher.state === "submitting" ? "Saving..." : "Save"}
              </Button>
              <ConfirmDialog
                title={`Delete ${recordType}?`}
                description={`This action will permanently remove this ${recordType} record.`}
                confirmText="Yes, delete"
                cancelText="Cancel"
                onConfirm={() => handleSubmit("delete")}
                trigger={
                  <Button
                    variant="destructive"
                    disabled={isNew || fetcher.state !== "idle"}
                  >
                    {fetcher.state === "submitting" ? "Deleting..." : "Delete"}
                  </Button>
                }
              />
            </div>
          </div>

          {fetcher.data?.error && (
            <p className="text-red-500 mt-2">{fetcher.data.error}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
