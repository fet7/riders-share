// import { useEffect, useState } from "react";
// import { useFetcher } from "react-router";
// import { Button } from "~/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
// import type { FieldConfig } from "../types/field-config";
// import { DynamicForm } from "./dynamic-form";

// interface SubFormProps {
//   fields: FieldConfig[];
//   records: any[];
//   parentId: string;
//   parentIdField: string;
//   endpoints: {
//     create: string;
//     update: string;
//     delete: string;
//   };
//   idField: string;
//   idPattern?: string;
//   title: string;
//   onRecordsChange?: (records: any[]) => void;
// }

// export function SubForm({
//   fields,
//   records,
//   parentId,
//   parentIdField,
//   endpoints,
//   idField,
//   idPattern = "DP{00000}",
//   title,
//   onRecordsChange,
// }: SubFormProps) {
//   const fetcher = useFetcher();
//   const [localRecords, setLocalRecords] = useState<any[]>([]);
//   const [savingStates, setSavingStates] = useState<
//     Map<string, "creating" | "updating" | "deleting" | null>
//   >(new Map());
//   const [editingRecord, setEditingRecord] = useState<any>(null);
//   const [isCreating, setIsCreating] = useState(false);

//   // Initialize local records
//   useEffect(() => {
//     setLocalRecords(Array.isArray(records) ? records : []);
//   }, [records]);

//   const generateNextId = (): string => {
//     const usedIds = localRecords
//       .map((record) => {
//         const id = record[idField];
//         const numMatch = id?.match(/\d+/);
//         return numMatch ? parseInt(numMatch[0], 10) : 0;
//       })
//       .filter((n) => !isNaN(n))
//       .sort((a, b) => a - b);

//     let newNum = 1;
//     for (let i = 0; i < usedIds.length; i++) {
//       if (usedIds[i] !== i + 1) {
//         newNum = i + 1;
//         break;
//       }
//       newNum = usedIds.length + 1;
//     }

//     const match = idPattern.match(/\{0+\}/);
//     const padLen = match ? Math.max(match[0].length - 2, 1) : 3;

//     return idPattern.replace(/\{0+\}/, newNum.toString().padStart(padLen, "0"));
//   };

//   const setRecordSavingState = (
//     recordId: string,
//     state: "creating" | "updating" | "deleting" | null
//   ) => {
//     setSavingStates((prev) => {
//       const newMap = new Map(prev);
//       if (state === null) {
//         newMap.delete(recordId);
//       } else {
//         newMap.set(recordId, state);
//       }
//       return newMap;
//     });
//   };

//   const handleSubmit = (
//     actionType: "create" | "update" | "delete",
//     record: any
//   ) => {
//     const recordId = record[idField];

//     // Set saving state immediately
//     setRecordSavingState(
//       recordId,
//       actionType === "create"
//         ? "creating"
//         : actionType === "update"
//           ? "updating"
//           : "deleting"
//     );

//     // Submit to server
//     const fd = new FormData();
//     fd.append("_form", "deposit");
//     fd.append("_action", actionType);
//     fd.append(parentIdField, parentId);

//     Object.entries(record).forEach(([k, v]) => {
//       if (v !== undefined && v !== null) {
//         fd.append(k, v.toString());
//       }
//     });

//     fetcher.submit(fd, { method: "post", action: endpoints[actionType] });
//   };

//   const handleAddNew = () => {
//     const newId = generateNextId();
//     const emptyRecord = {
//       [idField]: newId,
//       [parentIdField]: parentId,
//       transaction_amount: 0,
//       share_price: 1000,
//       general_note: "",
//       created_by: "system",
//       updated_by: "system",
//     };

//     // Add to local records as a draft (not submitted yet)
//     setLocalRecords((prev) => [...prev, emptyRecord]);
//     setEditingRecord(emptyRecord);
//     setIsCreating(true);
//   };

//   const handleSaveNew = () => {
//     if (editingRecord) {
//       handleSubmit("create", editingRecord);
//       setIsCreating(false);
//       setEditingRecord(null);
//     }
//   };

//   const handleCancelNew = () => {
//     if (editingRecord) {
//       // Remove the draft record
//       setLocalRecords((prev) =>
//         prev.filter((record) => record[idField] !== editingRecord[idField])
//       );
//       setIsCreating(false);
//       setEditingRecord(null);
//     }
//   };

//   const handleFormChange = (name: string, value: any) => {
//     if (editingRecord) {
//       setEditingRecord((prev: any) => ({
//         ...prev,
//         [name]: value,
//       }));

//       // Also update in localRecords
//       setLocalRecords((prev) =>
//         prev.map((record) =>
//           record[idField] === editingRecord[idField]
//             ? { ...record, [name]: value }
//             : record
//         )
//       );
//     }
//   };

//   // Handle server responses
//   useEffect(() => {
//     if (fetcher.state === "idle" && fetcher.data) {
//       const data = fetcher.data;
//       const formData = fetcher.formData as FormData | undefined;
//       const actionType = formData?.get("_action") as
//         | "create"
//         | "update"
//         | "delete"
//         | undefined;

//       if (data?.success) {
//         // Success case - clear saving state and update records
//         const recordId =
//           data.record?.[idField] ||
//           data.deposit?.[idField] ||
//           data.fields?.[idField];

//         if (recordId) {
//           setRecordSavingState(recordId, null);
//         }

//         // Update local records with server data
//         if (actionType === "create" && data.deposit) {
//           setLocalRecords((prev) => {
//             const updated = prev.map((record) =>
//               record[idField] === data.deposit?.[idField]
//                 ? data.deposit
//                 : record
//             );
//             onRecordsChange?.(updated);
//             return updated;
//           });
//         } else if (actionType === "update" && data.deposit) {
//           setLocalRecords((prev) => {
//             const updated = prev.map((record) =>
//               record[idField] === data.deposit?.[idField]
//                 ? data.deposit
//                 : record
//             );
//             onRecordsChange?.(updated);
//             return updated;
//           });
//         } else if (actionType === "delete") {
//           const deletedRecordId = data.fields?.[idField];
//           if (deletedRecordId) {
//             setLocalRecords((prev) => {
//               const updated = prev.filter(
//                 (record) => record[idField] !== deletedRecordId
//               );
//               onRecordsChange?.(updated);
//               return updated;
//             });
//           }
//         }
//       } else if (data?.error || data?.errors) {
//         // Error case - revert optimistic updates and clear saving state
//         const recordId = data.fields?.[idField];

//         if (recordId) {
//           setRecordSavingState(recordId, null);
//         }

//         if (data?.errors) {
//           console.error("Validation errors:", data.errors);
//         } else {
//           console.error("Operation failed:", data.error);
//         }
//       }
//     }
//   }, [fetcher.state, fetcher.data, fetcher.formData, idField, onRecordsChange]);

//   const handleRecordUpdate = (index: number, name: string, value: any) => {
//     setLocalRecords((prev) => {
//       const updated = [...prev];
//       updated[index] = {
//         ...updated[index],
//         [name]: value,
//       };
//       return updated;
//     });
//   };

//   const isRecordSaving = (recordId: string) => savingStates.has(recordId);
//   const getSavingState = (recordId: string) => savingStates.get(recordId);

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex justify-between items-center">
//           <span>{title}</span>
//           <Button
//             onClick={handleAddNew}
//             size="sm"
//             disabled={isCreating || fetcher.state !== "idle"}
//           >
//             Add Deposit
//           </Button>
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {localRecords.map((record, index) => {
//             const recordId = record[idField];
//             const isSaving = isRecordSaving(recordId);
//             const savingState = getSavingState(recordId);
//             const isEditingThisRecord =
//               editingRecord && editingRecord[idField] === recordId;

//             return (
//               <div
//                 key={`${record[parentIdField]}-${recordId}`}
//                 className={`border rounded-lg p-4 ${
//                   isSaving ? "opacity-50 bg-muted/50" : ""
//                 } ${isEditingThisRecord ? "border-blue-500 bg-blue-50" : ""}`}
//               >
//                 <DynamicForm
//                   fields={fields}
//                   formData={record}
//                   onChange={(name, value) => {
//                     if (isEditingThisRecord) {
//                       handleFormChange(name, value);
//                     } else {
//                       handleRecordUpdate(index, name, value);
//                     }
//                   }}
//                   layout="grid"
//                   gridColumns={2}
//                 />
//                 <div className="flex gap-2 mt-4 justify-end">
//                   {isEditingThisRecord ? (
//                     <>
//                       <Button
//                         size="sm"
//                         onClick={handleSaveNew}
//                         disabled={isSaving || fetcher.state !== "idle"}
//                       >
//                         {savingState === "creating"
//                           ? "Creating..."
//                           : "Create Deposit"}
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={handleCancelNew}
//                         disabled={isSaving || fetcher.state !== "idle"}
//                       >
//                         Cancel
//                       </Button>
//                     </>
//                   ) : (
//                     <>
//                       <Button
//                         size="sm"
//                         onClick={() => handleSubmit("update", record)}
//                         disabled={isSaving || fetcher.state !== "idle"}
//                       >
//                         {savingState === "updating" ? "Updating..." : "Update"}
//                       </Button>
//                       <Button
//                         variant="destructive"
//                         size="sm"
//                         onClick={() => handleSubmit("delete", record)}
//                         disabled={isSaving || fetcher.state !== "idle"}
//                       >
//                         {savingState === "deleting" ? "Deleting..." : "Delete"}
//                       </Button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//           {localRecords.length === 0 && !isCreating && (
//             <p className="text-muted-foreground text-center py-4">
//               No deposits found. Click "Add Deposit" to create one.
//             </p>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { FieldConfig } from "../types/field-config";
import { DynamicForm } from "./dynamic-form";

interface SubFormProps {
  fields: FieldConfig[];
  records: any[];
  parentId: string;
  parentIdField: string;
  endpoints: {
    create: string;
    update: string;
    delete: string;
  };
  idField: string;
  idPattern?: string;
  title: string;
  onRecordsChange?: (records: any[]) => void;
}

export function SubForm({
  fields,
  records,
  parentId,
  parentIdField,
  endpoints,
  idField,
  idPattern = "DP{00000}",
  title,
  onRecordsChange,
}: SubFormProps) {
  const fetcher = useFetcher();
  const [localRecords, setLocalRecords] = useState<any[]>([]);
  const [savingStates, setSavingStates] = useState<
    Map<string, "creating" | "updating" | "deleting" | null>
  >(new Map());
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Initialize local records
  useEffect(() => {
    setLocalRecords(Array.isArray(records) ? records : []);
  }, [records]);

  const generateNextId = (): string => {
    const usedIds = localRecords
      .map((record) => {
        const id = record[idField];
        const numMatch = id?.match(/\d+/);
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
    const padLen = match ? Math.max(match[0].length - 2, 1) : 3;

    return idPattern.replace(/\{0+\}/, newNum.toString().padStart(padLen, "0"));
  };

  const setRecordSavingState = (
    recordId: string,
    state: "creating" | "updating" | "deleting" | null
  ) => {
    setSavingStates((prev) => {
      const newMap = new Map(prev);
      if (state === null) {
        newMap.delete(recordId);
      } else {
        newMap.set(recordId, state);
      }
      return newMap;
    });
  };

  const handleSubmit = (
    actionType: "create" | "update" | "delete",
    record: any
  ) => {
    const recordId = record[idField];

    // Set saving state immediately
    setRecordSavingState(
      recordId,
      actionType === "create"
        ? "creating"
        : actionType === "update"
          ? "updating"
          : "deleting"
    );

    // Optimistic update for delete - remove immediately
    if (actionType === "delete") {
      setLocalRecords((prev) => prev.filter((r) => r[idField] !== recordId));
    }

    // Submit to server
    const fd = new FormData();
    fd.append("_form", "deposit");
    fd.append("_action", actionType);
    fd.append(parentIdField, parentId);

    Object.entries(record).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        fd.append(k, v.toString());
      }
    });

    fetcher.submit(fd, { method: "post", action: endpoints[actionType] });
  };

  const handleAddNew = () => {
    const newId = generateNextId();
    const emptyRecord = {
      [idField]: newId,
      [parentIdField]: parentId,
      transaction_amount: 0,
      share_price: 1000,
      general_note: "",
      created_by: "system",
      updated_by: "system",
    };

    // Add to local records as a draft (not submitted yet)
    setLocalRecords((prev) => [...prev, emptyRecord]);
    setEditingRecord(emptyRecord);
    setIsCreating(true);
  };

  const handleSaveNew = () => {
    if (editingRecord) {
      handleSubmit("create", editingRecord);
      setIsCreating(false);
      setEditingRecord(null);
    }
  };

  const handleCancelNew = () => {
    if (editingRecord) {
      // Remove the draft record
      setLocalRecords((prev) =>
        prev.filter((record) => record[idField] !== editingRecord[idField])
      );
      setIsCreating(false);
      setEditingRecord(null);
    }
  };

  const handleFormChange = (name: string, value: any) => {
    if (editingRecord) {
      setEditingRecord((prev: any) => ({
        ...prev,
        [name]: value,
      }));

      // Also update in localRecords
      setLocalRecords((prev) =>
        prev.map((record) =>
          record[idField] === editingRecord[idField]
            ? { ...record, [name]: value }
            : record
        )
      );
    }
  };

  // Handle server responses - FIXED VERSION
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const data = fetcher.data;
      const formData = fetcher.formData as FormData | undefined;
      const actionType = formData?.get("_action") as
        | "create"
        | "update"
        | "delete"
        | undefined;

      console.log("Server response:", data); // Debug log

      // Clear saving state for ALL operations when complete
      if (data?.success || data?.error || data?.errors) {
        const recordId =
          data.record?.[idField] ||
          data.deposit?.[idField] ||
          data.fields?.[idField];

        if (recordId) {
          setRecordSavingState(recordId, null);
        } else if (formData) {
          // If no recordId in response, try to get it from formData
          const formDataRecordId = formData.get(idField) as string;
          if (formDataRecordId) {
            setRecordSavingState(formDataRecordId, null);
          }
        }

        // Handle successful operations
        if (data?.success) {
          // Update local records with server data
          if (actionType === "create" && data.deposit) {
            setLocalRecords((prev) => {
              const updated = prev.map((record) =>
                record[idField] === data.deposit?.[idField]
                  ? data.deposit
                  : record
              );
              onRecordsChange?.(updated);
              return updated;
            });
          } else if (actionType === "update" && data.deposit) {
            setLocalRecords((prev) => {
              const updated = prev.map((record) =>
                record[idField] === data.deposit?.[idField]
                  ? data.deposit
                  : record
              );
              onRecordsChange?.(updated);
              return updated;
            });
          } else if (actionType === "delete") {
            // Delete was already handled optimistically, just notify parent
            onRecordsChange?.(localRecords);
          }
        }
        // Handle errors - revert optimistic updates
        else if (data?.error || data?.errors) {
          if (actionType === "delete") {
            // Revert optimistic delete - add the record back
            const deletedRecord = data.fields;
            if (deletedRecord && deletedRecord[idField]) {
              setLocalRecords((prev) => [...prev, deletedRecord]);
            }
          } else if (actionType === "create") {
            // Revert optimistic create
            const createdRecordId = data.fields?.[idField];
            if (createdRecordId) {
              setLocalRecords((prev) =>
                prev.filter((record) => record[idField] !== createdRecordId)
              );
            }
          }

          if (data?.errors) {
            console.error("Validation errors:", data.errors);
          } else {
            console.error("Operation failed:", data.error);
          }
        }
      }
    }
  }, [
    fetcher.state,
    fetcher.data,
    fetcher.formData,
    idField,
    onRecordsChange,
    localRecords,
  ]);

  const handleRecordUpdate = (index: number, name: string, value: any) => {
    setLocalRecords((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [name]: value,
      };
      return updated;
    });
  };

  const isRecordSaving = (recordId: string) => savingStates.has(recordId);
  const getSavingState = (recordId: string) => savingStates.get(recordId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{title}</span>
          <Button
            onClick={handleAddNew}
            size="sm"
            disabled={isCreating || fetcher.state !== "idle"}
          >
            Add Deposit
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {localRecords.map((record, index) => {
            const recordId = record[idField];
            const isSaving = isRecordSaving(recordId);
            const savingState = getSavingState(recordId);
            const isEditingThisRecord =
              editingRecord && editingRecord[idField] === recordId;

            return (
              <div
                key={`${record[parentIdField]}-${recordId}`}
                className={`border rounded-lg p-4 ${
                  isSaving ? "opacity-50 bg-muted/50" : ""
                } ${isEditingThisRecord ? "border-blue-500 bg-blue-50" : ""}`}
              >
                <DynamicForm
                  fields={fields}
                  formData={record}
                  onChange={(name, value) => {
                    if (isEditingThisRecord) {
                      handleFormChange(name, value);
                    } else {
                      handleRecordUpdate(index, name, value);
                    }
                  }}
                  layout="grid"
                  gridColumns={2}
                />
                <div className="flex gap-2 mt-4 justify-end">
                  {isEditingThisRecord ? (
                    <>
                      <Button
                        size="sm"
                        onClick={handleSaveNew}
                        disabled={isSaving || fetcher.state !== "idle"}
                      >
                        {savingState === "creating"
                          ? "Creating..."
                          : "Create Deposit"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelNew}
                        disabled={isSaving || fetcher.state !== "idle"}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleSubmit("update", record)}
                        disabled={isSaving || fetcher.state !== "idle"}
                      >
                        {savingState === "updating" ? "Updating..." : "Update"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleSubmit("delete", record)}
                        disabled={isSaving || fetcher.state !== "idle"}
                      >
                        {savingState === "deleting" ? "Deleting..." : "Delete"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {localRecords.length === 0 && !isCreating && (
            <p className="text-muted-foreground text-center py-4">
              No deposits found. Click "Add Deposit" to create one.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
