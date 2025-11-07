import { BaseForm } from "~/components/forms/base-form";
import { FormInput, FormTextarea } from "~/components/forms/form-inputs";
import type { Shareholder } from "~/lib/validation/shareholder";

interface ShareholderFormProps {
    editShareholder?: Shareholder | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}


export function ShareholderForm({editShareholder, open, onOpenChange}: ShareholderFormProps) {{
    const isEdit = !!editShareholder;

    return (
        <BaseForm
          title={isEdit ? "Edit Shareholder" : "Add Shareholder"}
          open={open}
          onOpenChange={onOpenChange}
          action="/app/shareholder"
          editId={editShareholder?.shareholder_id}
          submitText={isEdit ? "Update shareholder" : "Create Shareholder"}
        >
            <input type="hidden" name="_action" value={isEdit ? "update" : "create"}/>

            <FormInput
              name="shareholder_id"
              label="Shareholder ID"
              required
              defaultValue={editShareholder?.shareholder_id}
              placeholder="Enter unique shareholder ID"
            />
            <FormInput
                name="name_english"
                label="Name (English)"
                required
                defaultValue={editShareholder?.name_english}
                placeholder="Enter name in English"
            />
            <FormInput
                name="name_amharic"
                label="Name (Amharic)"
                defaultValue={editShareholder?.name_amharic}
                placeholder="Enter name in Amharic"
            />
            <FormInput
                name="nationality"
                label="Nationality"
                defaultValue={editShareholder?.nationality || "ኢትዮጵያዊ"}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    name="city"
                    label="City"
                    defaultValue={editShareholder?.city}
                />

                <FormInput
                    name="sub_city"
                    label="Sub-City"
                    defaultValue={editShareholder?.sub_city}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    name="wereda"
                    label="Wereda"
                    defaultValue={editShareholder?.wereda}
                />

                <FormInput
                    name="house_num"
                    label="House Number"
                    defaultValue={editShareholder?.house_num}
                />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
            name="phone_primary"
            label="Phone (Primary)"
            type="tel"
            defaultValue={editShareholder?.phone_primary}
            />

            <FormInput
            name="phone_secondary"
            label="Phone (Secondary)"
            type="tel"
            defaultValue={editShareholder?.phone_secondary}
            />
        </div>
            <FormInput
                name="email"
                label="Email"
                type="email"
                defaultValue={editShareholder?.email}
                placeholder="example@email.com"
            />

            <FormInput
                name="national_id_num"
                label="National ID (Fayda)"
                defaultValue={editShareholder?.national_id_num}
                placeholder="16-digit Fayda number"
            />

            <FormTextarea
                name="general_note"
                label="General Note"
                defaultValue={editShareholder?.general_note}
                placeholder="Additional notes..."
            />
        </BaseForm>
    )
}}
