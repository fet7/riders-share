import { query } from "~/lib/services/db.server";
import type { Sample } from "./validation";

export async function getAll() {
  return query<Sample>("SELECT * FROM samples ORDER BY created_at DESC");
}

type InsertParams = {
  name: string;
  description?: string;
  image?: string;
};

export async function insertData({ name, description, image }: InsertParams) {
  query("INSERT INTO samples (name, description, image) VALUES (?, ?, ?)", [
    name,
    description,
    image,
  ]);
}

type UpdateParams = {
  name: string;
  description?: string;
  id: string;
};

export async function updateData({ name, description, id }: UpdateParams) {
  return query("UPDATE samples SET name = ?, description = ? WHERE id = ?", [
    name,
    description,
    id,
  ]);
}

export async function deleteData({ id }: { id: string }) {
  return await query("DELETE FROM samples WHERE id = ?", [id]);
}

export async function selectImage({ id }: { id: string }) {
  return query<Pick<Sample, "id" | "image">>(
    "SELECT id, image FROM samples WHERE id = ?",
    [id]
  );
}
