import { IModalProps } from "~/core/types";

export interface ISendingConfirmationModalProps extends IModalProps {
  captchaResponse: string;
}
