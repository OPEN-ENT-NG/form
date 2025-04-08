import { WorkspaceElement } from "@edifice.io/client";

export interface IImagePickerMediaLibraryProps {
  information?: string;
  onImageChange?: (src: string | null) => void;
  width?: string;
  height?: string;
  initialSrc?: string;
}

export type MediaLibraryResult = WorkspaceElement[] | WorkspaceElement;
