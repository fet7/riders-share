// app/routes/deposits.tsx
import { useLoaderData } from "react-router";
import { RecordManager } from "./components/record-manager";
import { handleDepositAction } from "./helpers/deposit-action-handler";
import { getAllDeposits } from "./helpers/deposit-services.server";
import type { FieldConfig } from "./types/field-config";

export async function loader() {
  const deposits = await getAllDeposits();
  return { deposits };
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const actionType = formData.get("_action") as "create" | "update" | "delete";

  const deposit_id = formData.get("deposit_id")?.toString();

  // Convert FormData to object with proper string conversion
  const data: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (key !== "_action") {
      data[key] = value.toString();
    }
  }

  const result = await handleDepositAction({ actionType, deposit_id, data });

  // ✅ Return consistent structure for RecordManager with processed flag and validation errors
  return {
    ...result,
    actionType,
    processed: false,
    record: Array.isArray(result.deposit) ? result.deposit[0] : result.deposit,
    errors: result.errors || null,
  };
}

const DEPOSIT_FIELDS: FieldConfig[] = [
  {
    name: "deposit_id",
    label: "Deposit ID",
    type: "text",
    readOnly: true,
  },
  {
    name: "deposit_date",
    label: "Deposit Date",
    type: "date",
    required: true,
  },
  {
    name: "shareholder_name",
    label: "Shareholder Name",
    type: "text",
  },
  {
    name: "depositor_name",
    label: "Depositor Name",
    type: "text",
  },
  {
    name: "ref_num",
    label: "Reference Number",
    type: "text",
  },
  {
    name: "deposit_amount",
    label: "Deposit Amount",
    type: "number",
    required: true,
    inputMode: "numeric",
  },
  {
    name: "bank_name",
    label: "Bank Name",
    type: "text",
    required: true,
  },
  {
    name: "account_type",
    label: "Account Type",
    type: "select",
    options: [
      { label: "Share", value: "Share" },
      { label: "Service", value: "Service" },
    ],
    defaultValue: "Share",
  },
  {
    name: "general_note",
    label: "General Note",
    type: "textarea",
  },
];

const DEPOSIT_ENDPOINTS = {
  create: "/deposits",
  update: "/deposits",
  delete: "/deposits",
};

const NEW_DEPOSIT_TEMPLATE = {
  deposit_date: new Date().toISOString().split("T")[0], // Today's date
  account_type: "Share",
  deposit_amount: 0,
};

export default function DepositForm() {
  const { deposits } = useLoaderData<typeof loader>();

  return (
    <RecordManager
      initialRecords={deposits}
      recordType="deposit"
      fields={DEPOSIT_FIELDS}
      endpoints={DEPOSIT_ENDPOINTS}
      idField="deposit_id"
      idPattern="DP{00000}"
      searchFields={[
        "deposit_id",
        "shareholder_name",
        "depositor_name",
        "ref_num",
      ]}
      newRecordTemplate={NEW_DEPOSIT_TEMPLATE}
      layout="vertical"
      title="Deposit Management"
    />
  );
}
