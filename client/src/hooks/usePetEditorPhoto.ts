import type { ChangeEvent } from "react";
import { useCallback, useEffect, useReducer } from "react";
import { PET_IMAGE_MAX_BYTES, PET_IMAGE_MAX_LABEL } from "../lib/pet-image-limits";

type PhotoState = {
  file: File | null;
  previewUrl: string | null;
  savedUrl: string | null;
};

const initialPhoto: PhotoState = { file: null, previewUrl: null, savedUrl: null };

type PhotoAction =
  | { type: "pick"; file: File | null; nextPreview: string | null }
  | { type: "set_saved_url"; url: string | null };

function revokeIfBlob(url: string | null) {
  if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
}

function photoReducer(state: PhotoState, action: PhotoAction): PhotoState {
  switch (action.type) {
    case "pick": {
      revokeIfBlob(state.previewUrl);
      return { ...state, file: action.file, previewUrl: action.nextPreview };
    }
    case "set_saved_url":
      return { ...state, savedUrl: action.url };
    default:
      return state;
  }
}

export type UsePetEditorPhotoOptions = {
  /** Too-large file, or `null` when a valid file is chosen (clears prior file validation message). */
  onFileValidationMessage?: (message: string | null) => void;
};

export function usePetEditorPhoto(options: UsePetEditorPhotoOptions = {}) {
  const { onFileValidationMessage } = options;
  const [state, dispatch] = useReducer(photoReducer, initialPhoto);

  useEffect(() => {
    return () => revokeIfBlob(state.previewUrl);
  }, [state.previewUrl]);

  const setSavedImageUrl = useCallback((url: string | null) => {
    dispatch({ type: "set_saved_url", url });
  }, []);

  const handlePhotoInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0] ?? null;

      if (!f) {
        onFileValidationMessage?.(null);
        dispatch({ type: "pick", file: null, nextPreview: null });
        return;
      }

      if (f.size > PET_IMAGE_MAX_BYTES) {
        onFileValidationMessage?.(`Image too large (max ${PET_IMAGE_MAX_LABEL}).`);
        dispatch({ type: "pick", file: null, nextPreview: null });
        e.target.value = "";
        return;
      }

      onFileValidationMessage?.(null);
      dispatch({ type: "pick", file: f, nextPreview: URL.createObjectURL(f) });
    },
    [onFileValidationMessage],
  );

  return {
    photo: state.file,
    previewUrl: state.previewUrl,
    savedImageUrl: state.savedUrl,
    setSavedImageUrl,
    handlePhotoInputChange,
  };
}
