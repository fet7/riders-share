import type { Sample } from "./validation";

export function DisplayName({ name }: Pick<Sample, "name">) {
  return <h2 className="text-sm font-semibold text-gray-900">{name}</h2>;
}

export function DisplayDescription({
  description,
}: Pick<Sample, "description">) {
  return <p className="text-xs text-gray-600">{description}</p>;
}

export function DisplayImage({ image, name }: Pick<Sample, "image" | "name">) {
  return (
    <img src={image} alt={name} className="w-16 h-16 rounded-md object-cover" />
  );
}