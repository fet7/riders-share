import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { nanoid } from "nanoid";
import path from "path";

export async function saveImage(
  imageFile: File | null
): Promise<string | undefined> {
  if (!imageFile || imageFile.size === 0) return;

  const ext = path.extname(imageFile.name);
  const fileName = `${nanoid()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public/uploads");

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const arrayBuffer = await imageFile.arrayBuffer();
  await writeFile(path.join(uploadDir, fileName), Buffer.from(arrayBuffer));

  return `/uploads/${fileName}`;
} 