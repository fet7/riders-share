import DisplaySamples from "./component-list";
import type { Sample } from "./validation";

type DisplayDataProps = {
  samples: Sample[];
  setEditSample: (sample: Sample) => void;
  setIsModalOpen: (isModalOpen: boolean) => void;
};

export function DisplayData({
  samples,
  setEditSample,
  setIsModalOpen,
}: DisplayDataProps) {
  return (
    <div className="space-y-4">
      {samples.length > 0 ? (
        <DisplaySamples
          samples={samples}
          setEditSample={setEditSample}
          setIsModalOpen={setIsModalOpen}
        />
      ) : (
        <p className="text-gray-500">
          No samples found. Start by creating one.
        </p>
      )}
    </div>
  );
}