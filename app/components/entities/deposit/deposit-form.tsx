
import { BaseForm } from "~/components/forms/base-form";
import { FormInput, FormTextarea } from "~/components/forms/form-inputs";
import { DatePickerField } from "~/components/forms/date-picker";
import type { Deposit } from "~/lib/validation/deposit";
import type { FetcherWithComponents } from "react-router";

interface DepositFormProps {
  editDeposit?: Deposit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fetcher: FetcherWithComponents<any>;
}

export function DepositForm({
  editDeposit,
  open,
  onOpenChange,
  fetcher,
}: DepositFormProps) {
  const isEdit = !!editDeposit;

  // Get field errors from fetcher
  const fieldErrors = fetcher.data?.errors?.properties || {};

  return (
    <BaseForm
      title={isEdit ? "Edit Deposit" : "Add Deposit"}
      open={open}
      onOpenChange={onOpenChange}
      action="/app/deposit"
      editId={editDeposit?.deposit_id}
      submitText={isEdit ? "Update Deposit" : "Create Deposit"}
      isSubmitting={fetcher.state === "submitting"}
    >
      <input type="hidden" name="_action" value={isEdit ? "update" : "create"} />

      <FormInput
        name="deposit_id"
        label="Deposit ID"
        required
        defaultValue={editDeposit?.deposit_id}
        placeholder="Enter unique deposit ID"
        error={fieldErrors.deposit_id?.errors?.[0]?.message}
      />

      {/* Enhanced Date Picker */}
      <DatePickerField
        name="deposit_date"
        label="Deposit Date"
        required
        error={fieldErrors.deposit_date?.errors?.[0]?.message}
      />

      <FormInput
        name="shareholder_name"
        label="Shareholder Name"
        defaultValue={editDeposit?.shareholder_name}
        placeholder="Enter shareholder name"
      />

      <FormInput
        name="depositor_name"
        label="Depositor Name"
        defaultValue={editDeposit?.depositor_name}
        placeholder="Enter depositor name"
      />

      <FormInput
        name="ref_num"
        label="Reference Number"
        defaultValue={editDeposit?.ref_num}
        placeholder="Enter reference number"
      />

      <FormInput
        name="deposit_amount"
        label="Deposit Amount"
        type="number"
        required
        defaultValue={editDeposit?.deposit_amount?.toString()}
        placeholder="Enter deposit amount"
        error={fieldErrors.deposit_amount?.errors?.[0]?.message}
      />

      <FormInput
        name="bank_name"
        label="Bank Name"
        defaultValue={editDeposit?.bank_name}
        placeholder="Enter bank name"
      />

      <div className="space-y-2">
        <label htmlFor="account_type" className="text-sm font-medium">
          Account Type
        </label>
        <select
          id="account_type"
          name="account_type"
          defaultValue={editDeposit?.account_type || "Share"}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="Share">Share</option>
          <option value="Saving">Saving</option>
          <option value="Current">Current</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <FormTextarea
        name="general_note"
        label="General Note"
        defaultValue={editDeposit?.general_note}
        placeholder="Additional notes..."
      />
    </BaseForm>
  );
}
