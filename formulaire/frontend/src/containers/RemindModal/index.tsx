import {
  Box,
  Link,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Loader,
  DialogActions,
  Button,
  TextField,
} from "@cgi-learning-hub/ui";
import { FC, useEffect, useRef, useState } from "react";
import { Editor, EditorRef } from "@edifice.io/react/editor";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { useHome } from "~/providers/HomeProvider";
import { chipOptions, chooseContent, createFormUrl, initialStatusResponseState } from "./utils";
import { IButtonProps, IModalProps } from "~/core/types";
import { BreakpointVariant, ComponentVariant, TypographyFont, TypographyVariant } from "~/core/style/themeProps";
import {
  chipWrapper,
  mainContentColumnWrapper,
  StyledChip,
  subContentColumnWrapper,
  editorContainerStyle,
  dialogStyle,
  buttonStyle,
  loaderContainerStyle,
  HiddenContent,
} from "./style";
import { useGetFormDistributionsQuery } from "~/services/api/services/formulaireApi/distributionApi";
import { DisplayContentType } from "./enums";
import { IStatusResponseState } from "./types";
import { DistributionTable } from "~/components/DistributionTable";
import { transformDistributionsToTableData } from "~/core/models/distribution/utils";
import { PRIMARY_MAIN_COLOR } from "~/core/style/colors";
import { useSendReminderMutation } from "~/services/api/services/formulaireApi/formApi";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import { Badge } from "@mui/material";

export const RemindModal: FC<IModalProps> = ({ isOpen, handleClose }) => {
  const { t } = useTranslation(FORMULAIRE);
  const { selectedForms, resetSelected } = useHome();
  const [displayContent, setDisplayContent] = useState<DisplayContentType>(DisplayContentType.LOADING);
  const [statusResponse, setStatusResponse] = useState<IStatusResponseState>(initialStatusResponseState);
  const [sendReminder] = useSendReminderMutation();
  const [showRemind, setShowRemind] = useState<boolean>(false);
  const { isAnsweredActive, isNotAnsweredActive } = statusResponse;
  const { id: formId, title: formTitle } = selectedForms[0];
  const rootElement = document.getElementById("root");
  const host = rootElement?.getAttribute("data-host") ?? null;
  const formUrl = createFormUrl(host, formId);
  const defaultDescription = t("formulaire.remind.default.body", {
    0: formUrl || "",
    1: formUrl || "",
  });
  const [description, setDescription] = useState<string>(defaultDescription);
  const [remindObject, setRemindObject] = useState<string>("");
  const editorRef = useRef<EditorRef>(null);
  const { data: distributions, isLoading: isDistributionsLoading } = useGetFormDistributionsQuery(formId);
  const tableDatas = distributions
    ? transformDistributionsToTableData(distributions, isAnsweredActive, isNotAnsweredActive)
    : [];

  const remindDescription =
    isAnsweredActive && isNotAnsweredActive
      ? "formulaire.remind.description.multipleTrue"
      : "formulaire.remind.description.multipleFalse";

  const handleSubmit = async () => {
    if (!formUrl || !description) return;

    try {
      const mail = {
        link: formUrl,
        subject: remindObject.trim().length === 0 ? t("formulaire.remind.default.subject") : remindObject,
        body: description,
      };

      await sendReminder({ formId: formId.toString(), mail }).unwrap();
      resetSelected();
      handleClose();
    } catch (error) {
      console.error("Error sending reminder:", error);
    }
  };

  const handleCancelRemind = () => {
    setShowRemind(false);
  };

  const handleChipClick = (clickedKey: keyof IStatusResponseState) => {
    setStatusResponse((prev) => {
      // build a brand new object where only clickedKey is true
      const newState = {} as IStatusResponseState;
      (Object.keys(prev) as (keyof IStatusResponseState)[]).forEach((key) => {
        newState[key] = key === clickedKey;
      });
      return newState;
    });
  };

  const followContent = (
    <>
      <Typography>
        {t("formulaire.checkremind.name")} <strong>{formTitle} </strong> :
      </Typography>
      <Box sx={chipWrapper}>
        {chipOptions.map((option) => (
          <StyledChip
            key={option.key}
            isActive={statusResponse[option.key]}
            label={t(option.label)}
            onClick={() => {
              handleChipClick(option.key);
            }}
          />
        ))}
        <Badge
          badgeContent={tableDatas.length}
          color="primary"
          showZero
          sx={{
            marginTop: "1rem",
            "& .MuiBadge-badge": {
              fontSize: "1.2rem",
              minWidth: 24,
              height: 24,
              borderRadius: "50%",
            },
          }}
        >
          <GroupRoundedIcon />
        </Badge>
      </Box>
      {distributions?.length && (
        <Box>
          <DistributionTable distributions={tableDatas} />
        </Box>
      )}
    </>
  );

  const writeRemindContent = (
    <>
      <Typography>{t(remindDescription)}</Typography>
      <Box sx={{ display: "flex", alignItems: "center", width: "60%" }}>
        <Typography sx={{ width: "16rem" }}>{t("formulaire.remind.subject.label")}</Typography>
        <TextField
          variant="standard"
          fullWidth
          value={remindObject}
          onChange={(e) => {
            setRemindObject(e.target.value);
          }}
        />
      </Box>
      <Box sx={{ ...editorContainerStyle, display: showRemind ? "block" : "none" }}>
        {isOpen && (
          <Editor
            id="postContent"
            content={description}
            mode="edit"
            ref={editorRef}
            onContentChange={() => {
              setDescription(editorRef.current?.getContent("html") as string);
            }}
          />
        )}
      </Box>

      <Box sx={subContentColumnWrapper}>
        <Typography>{t("formulaire.remind.link")}</Typography>
        {formUrl ? (
          <Link
            href={formUrl}
            sx={{
              color: PRIMARY_MAIN_COLOR,
              textDecoration: "none",
            }}
          >
            {formUrl}
          </Link>
        ) : (
          //todo : add empty i18n key
          <Typography>{}</Typography>
        )}
      </Box>
    </>
  );

  const noDistributionsContent = <Typography paddingBottom={"3rem"}>{t("formulaire.remind.noDistrib")}</Typography>;
  const loaderContent = (
    <Box sx={loaderContainerStyle}>
      <Loader />
    </Box>
  );

  const renderContent = () => {
    return (
      <>
        <HiddenContent isVisible={displayContent === DisplayContentType.WRITE_REMIND}>
          {writeRemindContent}
        </HiddenContent>
        {displayContent === DisplayContentType.NO_DISTRIBUTIONS && noDistributionsContent}
        {displayContent === DisplayContentType.LOADING && loaderContent}
        {displayContent === DisplayContentType.FOLLOW && followContent}
      </>
    );
  };

  const renderActions: () => IButtonProps[] = () => {
    switch (displayContent) {
      case DisplayContentType.WRITE_REMIND:
        return [
          {
            titleI18nkey: "formulaire.cancel",
            action: handleCancelRemind,
            variant: ComponentVariant.OUTLINED,
          },
          {
            titleI18nkey: "formulaire.confirm",
            action: () => {
              void handleSubmit();
            },
            variant: ComponentVariant.CONTAINED,
          },
        ];
      case DisplayContentType.NO_DISTRIBUTIONS:
        return [{ titleI18nkey: "formulaire.close", action: handleClose, variant: ComponentVariant.OUTLINED }];
      case DisplayContentType.LOADING:
        return [{ titleI18nkey: "formulaire.close", action: handleClose, variant: ComponentVariant.OUTLINED }];
      case DisplayContentType.FOLLOW:
        return [
          { titleI18nkey: "formulaire.close", action: handleClose, variant: ComponentVariant.OUTLINED },
          {
            titleI18nkey: "formulaire.remind.title",
            action: () => {
              setShowRemind(true);
            },
            variant: ComponentVariant.CONTAINED,
          },
        ];
      default:
        return [{ titleI18nkey: "formulaire.close", action: handleClose, variant: ComponentVariant.OUTLINED }];
    }
  };

  useEffect(() => {
    setDisplayContent(chooseContent(isDistributionsLoading, distributions, showRemind));
  }, [isDistributionsLoading, distributions, showRemind]);

  useEffect(() => {
    if (!isOpen) {
      setShowRemind(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth={BreakpointVariant.MD} fullWidth sx={dialogStyle}>
      <DialogTitle variant={TypographyVariant.H2} fontWeight={TypographyFont.BOLD}>
        {t("formulaire.remind.title")}
      </DialogTitle>
      <DialogContent sx={mainContentColumnWrapper}>{renderContent()}</DialogContent>
      <DialogActions>
        {renderActions().map((button) => (
          <Button
            key={button.titleI18nkey}
            variant={button.variant ?? ComponentVariant.CONTAINED}
            onClick={() => {
              button.action();
            }}
            sx={buttonStyle}
          >
            {t(button.titleI18nkey)}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};
