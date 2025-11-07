import { query } from "~/lib/services/db.server";
import type { Shareholder, ShareholderCreate, ShareholderUpdate } from "../validation/shareholder";

export async function getAllShareholders(): Promise<Shareholder[]> {
  const results = await query<Shareholder>(
    "SELECT * FROM shareholders ORDER BY created_at DESC"
  );
  return results;
}

export async function getShareholderById(id: string): Promise<Shareholder | null> {
  const results = await query<Shareholder>(
    "SELECT * FROM shareholders WHERE shareholder_id = ?",
    [id]
  );
  return results[0] || null;
}

export async function createShareholder(data: ShareholderCreate): Promise<Shareholder> {
  const sql = `
    INSERT INTO shareholders
    (shareholder_id, name_english, name_amharic, nationality, city, sub_city, wereda,
     house_num, phone_primary, phone_secondary, email, national_id_num, general_note, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await query(sql, [
    data.shareholder_id,
    data.name_english,
    data.name_amharic || "",
    data.nationality || "ኢትዮጵያዊ",
    data.city || "",
    data.sub_city || "",
    data.wereda || "",
    data.house_num || "",
    data.phone_primary || "",
    data.phone_secondary || "",
    data.email || "",
    data.national_id_num || "",
    data.general_note || "",
    data.created_by || "system",
  ]);

  const inserted = await getShareholderById(data.shareholder_id);
  if (!inserted) throw new Error("Failed to create shareholder");

  return inserted;
}

export async function updateShareholder(id: string, data: ShareholderUpdate): Promise<Shareholder> {
  const sql = `
    UPDATE shareholders
    SET name_english = ?, name_amharic = ?, nationality = ?, city = ?, sub_city = ?,
        wereda = ?, house_num = ?, phone_primary = ?, phone_secondary = ?, email = ?,
        national_id_num = ?, general_note = ?, updated_by = ?
    WHERE shareholder_id = ?
  `;

  await query(sql, [
    data.name_english,
    data.name_amharic,
    data.nationality,
    data.city,
    data.sub_city,
    data.wereda,
    data.house_num,
    data.phone_primary,
    data.phone_secondary,
    data.email,
    data.national_id_num,
    data.general_note,
    data.updated_by || "system",
    id,
  ]);

  const updated = await getShareholderById(id);
  if (!updated) throw new Error("Failed to update shareholder");

  return updated;
}

export async function deleteShareholder(id: string): Promise<void> {
  await query("DELETE FROM shareholders WHERE shareholder_id = ?", [id]);
}
