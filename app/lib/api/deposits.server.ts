import { query } from "~/lib/services/db.server";
import type { Deposit, DepositCreate, DepositUpdate } from "~/lib/validation/deposit";

export async function getAllDeposits(): Promise<Deposit[]> {
  const results = await query<Deposit>(
    "SELECT * FROM deposits ORDER BY deposit_date DESC, created_at DESC"
  );
  return results;
}

export async function getDepositById(id: string): Promise<Deposit | null> {
  const results = await query<Deposit>(
    "SELECT * FROM deposits WHERE deposit_id = ?",
    [id]
  );
  return results[0] || null;
}

export async function createDeposit(data: DepositCreate): Promise<Deposit> {
  const sql = `
    INSERT INTO deposits
    (deposit_id, deposit_date, shareholder_name, depositor_name, ref_num,
     deposit_amount, bank_name, account_type, general_note, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await query(sql, [
    data.deposit_id,
    data.deposit_date,
    data.shareholder_name || "",
    data.depositor_name || "",
    data.ref_num || "",
    data.deposit_amount,
    data.bank_name || "",
    data.account_type || "Share",
    data.general_note || "",
    data.created_by || "system",
  ]);

  const inserted = await getDepositById(data.deposit_id);
  if (!inserted) throw new Error("Failed to create deposit");

  return inserted;
}

export async function updateDeposit(id: string, data: DepositUpdate): Promise<Deposit> {
  const sql = `
    UPDATE deposits
    SET deposit_date = ?, shareholder_name = ?, depositor_name = ?, ref_num = ?,
        deposit_amount = ?, bank_name = ?, account_type = ?, general_note = ?, updated_by = ?
    WHERE deposit_id = ?
  `;

  await query(sql, [
    data.deposit_date,
    data.shareholder_name,
    data.depositor_name,
    data.ref_num,
    data.deposit_amount,
    data.bank_name,
    data.account_type,
    data.general_note,
    data.updated_by || "system",
    id,
  ]);

  const updated = await getDepositById(id);
  if (!updated) throw new Error("Failed to update deposit");

  return updated;
}

export async function deleteDeposit(id: string): Promise<void> {
  await query("DELETE FROM deposits WHERE deposit_id = ?", [id]);
}
