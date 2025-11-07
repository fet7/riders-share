import { query } from "~/services/db.server";
import type { Shareholder, ShareholderDeposit } from "./validation";

// ✅ Get all shareholders
export async function getAllShareholders() {
  return query<Shareholder>(
    "SELECT * FROM shareholders ORDER BY shareholder_id"
  );
}

// ✅ Insert new shareholder
type InsertShareholderParams = Omit<
  Shareholder,
  "updated_by" | "shareholder_id"
> & { shareholder_id?: string };

export async function insertShareholder(data: InsertShareholderParams) {
  const {
    shareholder_id,
    name_english,
    name_amharic,
    nationality,
    city,
    sub_city,
    wereda,
    house_num,
    phone_primary,
    phone_secondary,
    email,
    national_id_num,
    general_note,
    created_by,
  } = data;

  return query(
    `INSERT INTO shareholders (
      shareholder_id,
      name_english,
      name_amharic,
      nationality,
      city,
      sub_city,
      wereda,
      house_num,
      phone_primary,
      phone_secondary,
      email,
      national_id_num,
      general_note,
      created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      shareholder_id,
      name_english,
      name_amharic,
      nationality,
      city,
      sub_city,
      wereda,
      house_num,
      phone_primary,
      phone_secondary,
      email,
      national_id_num,
      general_note,
      created_by,
    ]
  );
}

// ✅ Update shareholder
type UpdateShareholderParams = Partial<Omit<Shareholder, "shareholder_id">> & {
  shareholder_id: string;
};

export async function updateShareholder({
  shareholder_id,
  name_english,
  name_amharic,
  nationality,
  city,
  sub_city,
  wereda,
  house_num,
  phone_primary,
  phone_secondary,
  email,
  national_id_num,
  general_note,
  updated_by,
}: UpdateShareholderParams) {
  return query(
    `UPDATE shareholders
     SET
      name_english = ?,
      name_amharic = ?,
      nationality = ?,
      city = ?,
      sub_city = ?,
      wereda = ?,
      house_num = ?,
      phone_primary = ?,
      phone_secondary = ?,
      email = ?,
      national_id_num = ?,
      general_note = ?,
      updated_by = ?,
      updated_at = CURRENT_TIMESTAMP
     WHERE shareholder_id = ?`,
    [
      name_english,
      name_amharic,
      nationality,
      city,
      sub_city,
      wereda,
      house_num,
      phone_primary,
      phone_secondary,
      email,
      national_id_num,
      general_note,
      updated_by,
      shareholder_id,
    ]
  );
}

// ✅ Delete shareholder
export async function deleteShareholder(shareholder_id: string) {
  return query("DELETE FROM shareholders WHERE shareholder_id = ?", [
    shareholder_id,
  ]);
}

// ✅ Get a single shareholder
export async function getShareholderById(shareholder_id: string) {
  return query<Shareholder>(
    "SELECT * FROM shareholders WHERE shareholder_id = ?",
    [shareholder_id]
  );
}

// services.server.ts - deposit services
// ✅ Get all deposits for a shareholder
export async function getShareholderDeposits(shareholder_id: string) {
  return query<ShareholderDeposit>(
    "SELECT * FROM shareholder_deposits WHERE shareholder_id = ? ORDER BY created_at DESC",
    [shareholder_id]
  );
}

// ✅ Insert new deposit
export async function insertShareholderDeposit(data: ShareholderDeposit) {
  const {
    shareholder_id,
    deposit_id,
    transaction_amount,
    share_price,
    general_note,
    created_by,
  } = data;

  return query(
    `INSERT INTO shareholder_deposits (
      shareholder_id,
      deposit_id,
      transaction_amount,
      share_price,
      general_note,
      created_by
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      shareholder_id,
      deposit_id,
      transaction_amount,
      share_price,
      general_note,
      created_by,
    ]
  );
}

// ✅ Update deposit
export async function updateShareholderDeposit(data: ShareholderDeposit) {
  const {
    shareholder_id,
    deposit_id,
    transaction_amount,
    share_price,
    general_note,
    updated_by,
  } = data;

  return query(
    `UPDATE shareholder_deposits
     SET
      transaction_amount = ?,
      share_price = ?,
      general_note = ?,
      updated_by = ?,
      updated_at = CURRENT_TIMESTAMP
     WHERE shareholder_id = ? AND deposit_id = ?`,
    [
      transaction_amount,
      share_price,
      general_note,
      updated_by,
      shareholder_id,
      deposit_id,
    ]
  );
}

// ✅ Delete deposit
export async function deleteShareholderDeposit(
  shareholder_id: string,
  deposit_id: string
) {
  return query(
    "DELETE FROM shareholder_deposits WHERE shareholder_id = ? AND deposit_id = ?",
    [shareholder_id, deposit_id]
  );
}

// ✅ Get available deposit IDs (for dropdown)
export async function getAvailableDepositIds() {
  return query<{ deposit_id: string }>(
    "SELECT deposit_id FROM deposits ORDER BY deposit_id"
  );
}
