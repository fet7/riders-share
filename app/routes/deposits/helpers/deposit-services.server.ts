// app/helpers/deposit-services.server.ts
import { query } from "~/lib/services/db.server";
import type { Deposit } from "./validation";

// ✅ Get all deposits
export async function getAllDeposits() {
  return query<Deposit>("SELECT * FROM deposits ORDER BY deposit_id");
}

// ✅ Insert new deposit
type InsertDepositParams = Omit<
  Deposit,
  "updated_by" | "deposit_id" | "created_at" | "updated_at"
> & { deposit_id?: string };

export async function insertDeposit(data: InsertDepositParams) {
  const {
    deposit_id,
    deposit_date,
    shareholder_name,
    depositor_name,
    ref_num,
    deposit_amount,
    bank_name,
    account_type,
    general_note,
    created_by,
  } = data;

  return query(
    `INSERT INTO deposits (
      deposit_id,
      deposit_date,
      shareholder_name,
      depositor_name,
      ref_num,
      deposit_amount,
      bank_name,
      account_type,
      general_note,
      created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      deposit_id,
      deposit_date,
      shareholder_name,
      depositor_name,
      ref_num,
      deposit_amount,
      bank_name,
      account_type,
      general_note,
      created_by,
    ]
  );
}

// ✅ Update deposit
type UpdateDepositParams = Partial<
  Omit<Deposit, "deposit_id" | "created_at" | "updated_at">
> & {
  deposit_id: string;
};

// app/helpers/deposit-services.server.ts - fix the UPDATE query
export async function updateDeposit({
  deposit_id,
  deposit_date,
  shareholder_name,
  depositor_name,
  ref_num,
  deposit_amount,
  bank_name,
  account_type,
  general_note,
  updated_by,
}: UpdateDepositParams) {
  return query(
    `UPDATE deposits
     SET
      deposit_date = ?,
      shareholder_name = ?,
      depositor_name = ?,
      ref_num = ?,
      deposit_amount = ?,
      bank_name = ?,
      account_type = ?,
      general_note = ?,
      updated_by = ?
     WHERE deposit_id = ?`,
    [
      deposit_date,
      shareholder_name,
      depositor_name,
      ref_num,
      deposit_amount,
      bank_name,
      account_type,
      general_note,
      updated_by,
      deposit_id,
    ]
  );
}

// export async function updateDeposit({
//   deposit_id,
//   deposit_date,
//   shareholder_name,
//   depositor_name,
//   ref_num,
//   deposit_amount,
//   bank_name,
//   account_type,
//   general_note,
//   updated_by,
// }: UpdateDepositParams) {
//   return query(
//     `UPDATE deposits
//      SET
//       deposit_date = ?,
//       shareholder_name = ?,
//       depositor_name = ?,
//       ref_num = ?,
//       deposit_amount = ?,
//       bank_name = ?,
//       account_type = ?,
//       general_note = ?,
//       updated_by = ?
//      WHERE deposit_id = ?`,
//     [
//       deposit_date,
//       shareholder_name,
//       depositor_name,
//       ref_num,
//       deposit_amount,
//       bank_name,
//       account_type,
//       general_note,
//       updated_by,
//       deposit_id,
//     ]
//   );
// }

// ✅ Delete deposit
export async function deleteDeposit(deposit_id: string) {
  return query("DELETE FROM deposits WHERE deposit_id = ?", [deposit_id]);
}

// ✅ Get a single deposit
export async function getDepositById(deposit_id: string) {
  return query<Deposit>("SELECT * FROM deposits WHERE deposit_id = ?", [
    deposit_id,
  ]);
}
