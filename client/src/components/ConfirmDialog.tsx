import { memo } from "react";
import {
  btnDanger,
  btnOutline,
  btnPrimary,
  dialogActions,
  dialogBackdrop,
  dialogPanel,
  h2,
  muted,
  stack,
} from "../lib/ui-styles";

type Props = {
  open: boolean;
  title: string;
  body: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
};

export const ConfirmDialog = memo(function ConfirmDialog({ open, title, body, danger, onCancel, onConfirm }: Props) {
  if (!open) return null;

  return (
    <div className={dialogBackdrop} role="presentation" onMouseDown={onCancel}>
      <div className={dialogPanel} role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        <div className={stack}>
          <h2 className={h2}>{title}</h2>
          <p className={muted}>{body}</p>
        </div>
        <div className={dialogActions}>
          <button type="button" className={btnOutline} onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className={danger ? btnDanger : btnPrimary} onClick={() => void onConfirm()}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
});
