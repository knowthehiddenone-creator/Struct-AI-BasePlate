import { Check, Pencil } from "lucide-react";
import { ExtractedParams } from "../../lib/types";
import JsonViewer from "../ui/JsonViewer";
import Button from "../ui/Button";

export default function Step03_JSONPreview({
  params,
  onNext,
  onEdit,
}: {
  params: ExtractedParams;
  onNext: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="bg-surface border border-borderLight rounded-card shadow-card p-7">
      <h2 className="text-xl font-semibold text-textPrimary mb-1">Extracted Parameters</h2>
      <p className="text-sm text-textSecondary mb-5">
        Review what the AI extracted from your description. Missing values appear as <span className="italic">null</span>.
      </p>

      <JsonViewer data={params} />

      <div className="flex flex-wrap gap-3 mt-6">
        <Button onClick={onNext} variant="primary">
          <Check size={16} /> Looks Correct → Next
        </Button>
        <Button onClick={onEdit} variant="outline">
          <Pencil size={16} /> Edit Manually
        </Button>
      </div>
    </div>
  );
}
