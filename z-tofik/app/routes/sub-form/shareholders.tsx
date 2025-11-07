import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLoaderData } from "react-router";
import { RecordManager } from "./components/record-manager";
import { SubForm } from "./components/sub-form";
import { handleAction, handleDepositAction } from "./helpers/action-handler";
import {
  getAllShareholders,
  getAvailableDepositIds,
} from "./helpers/services.server";
import type { Shareholder } from "./helpers/validation";
import type { FieldConfig } from "./types/field-config";

export async function loader() {
  const shareholders = await getAllShareholders();
  const depositOptions = await getAvailableDepositIds();
  console.log("hello from loader");

  return {
    shareholders,
    depositOptions: depositOptions
      .map((deposit) => ({
        label: deposit.deposit_id,
        value: deposit.deposit_id,
      }))
      .filter((option) => option.value && option.value.trim() !== ""), // Filter out empty values
  };
}

// app/routes/shareholders.tsx (or your route file)
export async function action({ request }: { request: Request }) {
  console.log("hello from action");

  const formData = await request.formData();

  const actionType = formData.get("_action") as "create" | "update" | "delete";

  const formType = formData.get("_form") as "shareholder" | "deposit"; // Add form type

  const shareholder_id = formData.get("shareholder_id")?.toString();
  const deposit_id = formData.get("deposit_id")?.toString();
  const data = Object.fromEntries(formData);

  // // 🧪 Artificially simulate a failure for testing rollback
  // if (formData.get("simulateError") === "true") {
  //   return {
  //     success: false,
  //     error: "Simulated failure from server.",
  //   };
  // }

  // 🚨 FIX: Make sure the formType check is working correctly
  console.error("Form type:", formType); // Debug log
  console.log("");
  console.log("hello there");
  console.log("");

  // Route to appropriate handler based on form type
  if (formType === "deposit") {
    const result = await handleDepositAction({
      actionType,
      shareholder_id,
      deposit_id,
      data,
    });

    return {
      ...result,
      actionType,
      formType,
      processed: false,
      record: result.deposit || null,
      errors: result.errors || null,
    };
  } else {
    // Shareholder form
    const result = await handleAction({ actionType, shareholder_id, data });
    return {
      ...result,
      actionType,
      processed: false,
      record: Array.isArray(result.shareholder)
        ? result.shareholder[0]
        : result.shareholder,
      errors: result.errors || null,
    };
  }
}

const SHAREHOLDER_FIELDS: FieldConfig[] = [
  {
    name: "shareholder_id",
    label: "Shareholder ID",
    type: "text",
    readOnly: true,
  },
  {
    name: "name_english",
    label: "Name (English)",
    type: "text",
    required: true,
  },
  {
    name: "name_amharic",
    label: "Name (Amharic)",
    type: "text",
    required: true,
  },
  {
    name: "nationality",
    label: "Nationality",
    type: "text",
    defaultValue: "ኢትዮጵያዊ",
  },
  {
    name: "city",
    label: "City",
    type: "text",
  },
  {
    name: "sub_city",
    label: "Sub City",
    type: "text",
  },
  {
    name: "wereda",
    label: "Wereda",
    type: "text",
  },
  {
    name: "house_num",
    label: "House Number",
    type: "text",
  },
  {
    name: "phone_primary",
    label: "Primary Phone",
    type: "tel",
    inputMode: "tel",
  },
  {
    name: "phone_secondary",
    label: "Secondary Phone",
    type: "text",
    inputMode: "text",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    inputMode: "email",
  },
  {
    name: "national_id_num",
    label: "National ID Number",
    type: "text",
  },
  {
    name: "general_note",
    label: "General Note",
    type: "textarea",
  },
];

// shareholders.tsx - Add deposit fields
const DEPOSIT_FIELDS: FieldConfig[] = [
  {
    name: "deposit_id",
    label: "Deposit ID",
    type: "select",
    required: true,
  },
  {
    name: "transaction_amount",
    label: "Transaction Amount",
    type: "number",
    required: true,
    inputMode: "numeric",
  },
  {
    name: "share_price",
    label: "Share Price",
    type: "number",
    required: true,
    inputMode: "numeric",
    defaultValue: 1000,
  },
  {
    name: "general_note",
    label: "Note",
    type: "textarea",
  },
];

const DEPOSIT_ENDPOINTS = {
  create: "/sub-form",
  update: "/sub-form",
  delete: "/sub-form",
};

const NEW_DEPOSIT_TEMPLATE = {
  share_price: 1000,
};
8;
const SHAREHOLDER_ENDPOINTS = {
  create: "/sub-form",
  update: "/sub-form",
  delete: "/sub-form",
};

const NEW_SHAREHOLDER_TEMPLATE = {
  nationality: "ኢትዮጵያዊ",
};

// shareholder form with deposit sub-form
// In your main shareholder component, add React.memo and useCallback
export default React.memo(function ShareholderForm() {
  const { shareholders, depositOptions } = useLoaderData<typeof loader>();
  const [currentShareholderId, setCurrentShareholderId] = useState<string>("");
  const [deposits, setDeposits] = useState<any[]>([]);

  const handleRecordChange = useCallback((record: Shareholder) => {
    setCurrentShareholderId(record.shareholder_id);
  }, []);

  // Debounced deposit fetching
  useEffect(() => {
    const fetchDeposits = async () => {
      if (currentShareholderId) {
        try {
          const response = await fetch(
            `/api/shareholders/${currentShareholderId}/deposits`
          );
          if (response.ok) {
            const shareholderDeposits = await response.json();
            setDeposits(
              Array.isArray(shareholderDeposits) ? shareholderDeposits : []
            );
          } else {
            setDeposits([]);
          }
        } catch (error) {
          console.error("Failed to fetch deposits:", error);
          setDeposits([]);
        }
      } else {
        setDeposits([]);
      }
    };

    const timeoutId = setTimeout(fetchDeposits, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [currentShareholderId]);

  const depositFieldsWithOptions: FieldConfig[] = useMemo(
    () =>
      DEPOSIT_FIELDS.map((field) => {
        if (field.name === "deposit_id") {
          return {
            ...field,
            options: depositOptions,
          };
        }
        return field;
      }),
    [depositOptions]
  );

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-6">
      <RecordManager
        initialRecords={shareholders}
        recordType="shareholder"
        fields={SHAREHOLDER_FIELDS}
        endpoints={SHAREHOLDER_ENDPOINTS}
        idField="shareholder_id"
        idPattern="FN{00000}"
        searchFields={["shareholder_id", "name_english", "name_amharic"]}
        newRecordTemplate={NEW_SHAREHOLDER_TEMPLATE}
        layout="vertical"
        title="Shareholder Management"
        onRecordChange={handleRecordChange}
      />

      {currentShareholderId && (
        <SubForm
          fields={depositFieldsWithOptions}
          records={deposits}
          parentId={currentShareholderId}
          parentIdField="shareholder_id"
          endpoints={DEPOSIT_ENDPOINTS}
          idField="deposit_id"
          idPattern="DP{00000}"
          title="Shareholder Deposits"
          onRecordsChange={setDeposits}
        />
      )}
    </div>
  );
});
