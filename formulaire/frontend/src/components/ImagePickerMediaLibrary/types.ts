export type ImagePickerMediaLibraryProps = {
  information?: string;
  onImageChange?: (src: string | null) => void;
  width?: string;
  height?: string;
  initialSrc?: string;
};
