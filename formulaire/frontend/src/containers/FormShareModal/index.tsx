import { FC } from "react";
import { ModalProps } from "~/types";
import { useHome } from "~/providers/HomeProvider";
import { ShareModal } from "~/common/ShareModal";

export const FormShareModal: FC<ModalProps> = ({ isOpen, handleClose }) => {
  const { selectedForms } = useHome();
  const handleShareSuccess = () => {
    handleClose();
  };
  const shareOptions = {
    resourceId: selectedForms[0].id.toString(),
    resourceCreatorId: selectedForms[0].owner_id,
    resourceRights: selectedForms[0].rights,
  };

  return (
    <ShareModal
      isOpen={isOpen}
      shareOptions={shareOptions}
      onCancel={handleClose}
      onSuccess={handleShareSuccess}
    ></ShareModal>
  );
};
