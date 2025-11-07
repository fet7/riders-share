import { useLoaderData } from "react-router";
import { RecordManager } from "./components/record-manager";
import { handleAction } from "./helpers/action-handler";
import { getAllShareholders } from "./helpers/services.server";
import type { FieldConfig } from "./types/field-config";

export async function loader() {
  const shareholders = await getAllShareholders();
  return { shareholders };
}

// app/routes/shareholders.tsx (or your route file)
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const actionType = formData.get("_action") as "create" | "update" | "delete";

  const shareholder_id = formData.get("shareholder_id")?.toString();
  const data = Object.fromEntries(formData);

  const result = await handleAction({ actionType, shareholder_id, data });

  // ✅ Return consistent structure for RecordManager with processed flag and validation errors
  return {
    ...result,
    actionType,
    processed: false, // Add this flag
    record: Array.isArray(result.shareholder)
      ? result.shareholder[0]
      : result.shareholder,
    // Include validation errors if they exist
    errors: result.errors || null,
  };
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

const SHAREHOLDER_ENDPOINTS = {
  create: "/shareholders",
  update: "/shareholders",
  delete: "/shareholders",
};

const NEW_SHAREHOLDER_TEMPLATE = {
  nationality: "ኢትዮጵያዊ",
};

export default function ShareholderForm() {
  const { shareholders } = useLoaderData<typeof loader>();

  return (
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
    />
  );
}
