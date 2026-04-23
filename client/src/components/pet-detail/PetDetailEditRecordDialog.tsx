import { EditMedicalRecordForm } from "./PetDetailRecordForm";
import { dialogBackdrop, dialogPanel, h3 } from "../../lib/ui-styles";
import type { MedicalRecord } from "../../types";

export type PetDetailEditRecordDialogProps = {
  record: MedicalRecord | null;
  onDismiss: () => void;
  onSaved: () => void;
};

export function PetDetailEditRecordDialog({ record, onDismiss, onSaved }: PetDetailEditRecordDialogProps) {
  if (!record) {
    return null;
  }

  return (
    <div className={dialogBackdrop} role="presentation" onMouseDown={onDismiss}>
      <div className={dialogPanel} onMouseDown={(e) => e.stopPropagation()}>
        <h3 className={h3}>Edit record</h3>
        <EditMedicalRecordForm
          record={record}
          onSuccess={() => {
            onDismiss();
            onSaved();
          }}
          onCancel={onDismiss}
        />
      </div>
    </div>
  );
}
