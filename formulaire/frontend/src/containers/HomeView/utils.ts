import { ModalType } from "~/core/enums";
import { useEffect, useRef, useState, RefObject } from "react";
import { useModal } from "~/providers/ModalProvider";
import { ComponentVariant } from "~/core/style/themeProps";
import { IButtonProps } from "~/core/types";

export const useGetHomeHeaderButtons = (): IButtonProps[] => {
  const { toggleModal } = useModal();
  return [
    {
      titleI18nkey: "formulaire.form.import.button",
      variant: ComponentVariant.OUTLINED,
      action: () => {
        toggleModal(ModalType.FORM_IMPORT);
      },
    },
    {
      titleI18nkey: "formulaire.form.create.button",
      variant: ComponentVariant.CONTAINED,
      action: () => {
        toggleModal(ModalType.FORM_PROP_CREATE);
      },
    },
  ];
};

export const useElementHeight = <T extends HTMLElement>(): [RefObject<T>, number] => {
  const elementRef = useRef<T>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.unobserve(element);
      resizeObserver.disconnect();
    };
  }, []);

  return [elementRef, height];
};
