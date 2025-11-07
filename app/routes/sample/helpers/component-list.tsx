import { DeleteForm } from "./component-form-delete";
import { DisplayDescription, DisplayImage, DisplayName } from "./component-data";
import type { Sample } from "./validation";
import { EditButton } from "./component-input";

type DisplaySamplesProps = {
  samples: Sample[];
  setEditSample: (sample: Sample) => void;
  setIsModalOpen: (isModalOpen: boolean) => void;
};

export default function ({
  samples,
  setEditSample,
  setIsModalOpen,
}: DisplaySamplesProps) {
  const handleEdit = (sample: Sample) => {
    setEditSample(sample);
    setIsModalOpen(true);
  };

  return samples.map((sample) => (
    <div
      key={sample.id}
      className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex justify-between items-center"
    >
      <div className="flex items-center space-x-4">
        <div>
          <DisplayName name={sample.name} />
          <DisplayDescription description={sample.description} />
        </div>
        {sample.image && (
          <DisplayImage image={sample.image} name={sample.name} />
        )}
      </div>
      <div className="flex space-x-2">
        <EditButton sample={sample} handleEdit={handleEdit} />
        <DeleteForm id={sample.id} />
      </div>
    </div>
  ));
}