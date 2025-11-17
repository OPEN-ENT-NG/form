import { ReactNode, useState } from "react";

import { ID, PutShareResponse, RightStringified, ShareRight } from "@edifice.io/client";
import { UseMutationResult } from "@tanstack/react-query";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import {
  Avatar,
  Button as EdificeButton,
  Checkbox,
  Combobox,
  LoadingScreen,
  Tooltip,
  VisuallyHidden,
} from "@edifice.io/react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@cgi-learning-hub/ui";
import { IconBookmark, IconInfoCircle, IconRafterDown } from "@edifice.io/react/icons";
import { ShareBookmark } from "./ShareBookmark";
import { ShareBookmarkLine } from "./ShareBookmarkLine";
import { useSearch } from "./hooks/useSearch";
import useShare from "./hooks/useShare";
import { useShareBookmark } from "./hooks/useShareBookmark";
import { buildPublicLink, userHasRight } from "./utils";
import { COMMON, FORMULAIRE } from "~/core/constants";
import { useShareModal } from "~/providers/ShareModalProvider";
import {
  BoxComponentType,
  BreakpointVariant,
  ComponentVariant,
  TypographyFontStyle,
  TypographyVariant,
} from "~/core/style/themeProps";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { flexStartBoxStyle } from "~/core/style/boxStyles";
import { toast } from "react-toastify";
import { useGlobal } from "~/providers/GlobalProvider";
import { TEXT_PRIMARY_COLOR } from "~/core/style/colors";

export type ShareOptions = {
  resourceId: ID;
  resourceRights: RightStringified[];
  resourceCreatorId: string;
};

export type ShareResourceMutation = UseMutationResult<
  PutShareResponse,
  unknown,
  {
    resourceId: string;
    rights: ShareRight[];
  }
>;

interface IShareResourceModalProps {
  /** Handle open/close state */
  isOpen: boolean;
  /**
   * Expect resourceId,
   * new rights array (replace shared array),
   * creatorId
   * of a resource */
  shareOptions: ShareOptions;
  /**
   * Use the `shareResource` props when you need to do Optimistic UI
   * otherwise ShareModal handles everything
   * Must use React Query */
  shareResource?: ShareResourceMutation;
  /**
   * To pass any specific app related component (e.g: Blog)
   */
  children?: ReactNode;
  /**
   * onSuccess callback when a resource is successfully shared
   */
  onSuccess: () => void;
  /**
   * onCancel handler to close ShareModal
   */
  onCancel: () => void;
  appCode: string;
}

export default function ShareResourceModal({
  isOpen,
  shareOptions,
  shareResource,
  children,
  onSuccess,
  onCancel,
  appCode,
}: IShareResourceModalProps) {
  const { resourceId, resourceCreatorId, resourceRights } = shareOptions;
  const { userFormsRights } = useShareModal();
  const [isLoading, setIsLoading] = useState(true);

  const {
    state: { isSharing, shareRights, shareRightActions },
    dispatch: shareDispatch,
    myAvatar,
    currentIsAuthor,
    handleShare,
    toggleRight,
    handleDeleteRow,
  } = useShare({
    appCode,
    resourceId,
    resourceCreatorId,
    resourceRights,
    shareResource,
    setIsLoading,
    onSuccess,
  });

  const {
    state: { searchResults, searchInputValue },
    showSearchAdmlHint,
    showSearchLoading,
    showSearchNoResults,
    getSearchMinLength,
    handleSearchInputChange,
    handleSearchResultsChange,
  } = useSearch({
    appCode,
    resourceId,
    resourceCreatorId,
    shareRights,
    shareDispatch,
  });

  const {
    refBookmark,
    showBookmark,
    handleBookmarkChange,
    toggleBookmark,
    toggleBookmarkInput,
    bookmark,
    handleOnSave,
    showBookmarkInput,
  } = useShareBookmark({ shareRights, shareDispatch });

  const { isMobile } = useGlobal();

  const { t: tEdifice } = useTranslation(COMMON);
  const { t: tForm } = useTranslation(FORMULAIRE);

  const searchPlaceholder = showSearchAdmlHint()
    ? isMobile
      ? tForm("formulaire.share.search.placeholder.mobile.adml")
      : tEdifice("explorer.search.adml.hint")
    : isMobile
    ? tForm("formulaire.share.search.placeholder.mobile")
    : tEdifice("explorer.modal.share.search.placeholder");

  const publicLink = buildPublicLink(userFormsRights, resourceId);

  const handleCopyPublicLink = async () => {
    if (!publicLink) return;

    try {
      await navigator.clipboard.writeText(publicLink);
      toast.success(tForm("formulaire.link.copy.success"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      toast.error(tForm("formulaire.link.copy.error"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Failed to copy text: ", err);
    }
  };

  return createPortal(
    <Dialog open={isOpen} onClose={onCancel} maxWidth={BreakpointVariant.MD} fullWidth>
      <DialogTitle color={TEXT_PRIMARY_COLOR} variant={TypographyVariant.H2} fontWeight={TypographyFontStyle.BOLD}>
        {tEdifice("share.title")}
      </DialogTitle>
      <DialogContent>
        <Typography color={TEXT_PRIMARY_COLOR} variant={TypographyVariant.H3}>
          {tEdifice("explorer.modal.share.usersWithAccess")}
        </Typography>
        <Box className="table-responsive">
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <Box component={BoxComponentType.TABLE} className="table border align-middle mb-0">
              <Box component={BoxComponentType.THEAD} className="bg-secondary">
                <Box component={BoxComponentType.TR}>
                  <Box component={BoxComponentType.TH} scope="col" className="w-32">
                    <VisuallyHidden>{tEdifice("explorer.modal.share.avatar.shared.alt")}</VisuallyHidden>
                  </Box>
                  <Box component={BoxComponentType.TH} scope="col">
                    <VisuallyHidden>{tEdifice("explorer.modal.share.search.placeholder")}</VisuallyHidden>
                  </Box>
                  {shareRightActions
                    .filter((shareRightAction) => shareRightAction.id !== "read")
                    .map((shareRightAction) => (
                      <th key={shareRightAction.displayName} scope="col" className="text-center text-white">
                        {tForm("formulaire." + shareRightAction.displayName)}
                      </th>
                    ))}
                  <Box component={BoxComponentType.TH} scope="col">
                    <VisuallyHidden>{tEdifice("close")}</VisuallyHidden>
                  </Box>
                </Box>
              </Box>
              <Box component={BoxComponentType.TBODY}>
                <Box component={BoxComponentType.TR}>
                  <Box component={BoxComponentType.TH} scope="row">
                    <Avatar
                      alt={tEdifice("explorer.modal.share.avatar.me.alt")}
                      size="xs"
                      src={myAvatar}
                      variant="circle"
                    />
                  </Box>
                  <Box component={BoxComponentType.TD}>{tEdifice("share.me")}</Box>
                  {shareRightActions
                    .filter((shareRightAction) => shareRightAction.id !== "read")
                    .map((shareRightAction) => (
                      <Box
                        component={BoxComponentType.TD}
                        key={shareRightAction.displayName}
                        style={{ width: "80px" }}
                        className="text-center text-white"
                      >
                        <Checkbox
                          checked={
                            currentIsAuthor() ||
                            userHasRight(userFormsRights, parseInt(resourceId), shareRightAction.id)
                          }
                          disabled
                        />
                      </Box>
                    ))}
                  <Box component={BoxComponentType.TD} style={{ width: "80px" }}></Box>
                </Box>
                <ShareBookmarkLine
                  showBookmark={showBookmark}
                  shareRightActions={shareRightActions}
                  shareRights={shareRights}
                  onDeleteRow={handleDeleteRow}
                  toggleRight={toggleRight}
                  toggleBookmark={toggleBookmark}
                />
              </Box>
            </Box>
          )}
        </Box>
        <Box className="mt-16">
          <EdificeButton
            color="tertiary"
            leftIcon={<IconBookmark />}
            rightIcon={
              <IconRafterDown
                title={tEdifice("show")}
                className="w-16 min-w-0"
                style={{
                  transition: "rotate 0.2s ease-out",
                  rotate: showBookmarkInput ? "-180deg" : "0deg",
                }}
              />
            }
            type="button"
            variant="ghost"
            className="fw-normal"
            onClick={() => {
              toggleBookmarkInput(!showBookmarkInput);
            }}
          >
            {tEdifice("share.save.sharebookmark")}
          </EdificeButton>
          {showBookmarkInput && (
            <ShareBookmark
              refBookmark={refBookmark}
              bookmark={bookmark}
              onBookmarkChange={handleBookmarkChange}
              onSave={handleOnSave}
            />
          )}
        </Box>
        <Box component={BoxComponentType.HR} />
        <Box className="mb-16 d-flex align-items-center">
          <Typography color={TEXT_PRIMARY_COLOR} variant={TypographyVariant.H3} className="me-8">
            {tEdifice("explorer.modal.share.search")}
          </Typography>
          <Tooltip
            message={
              "Vos favoris de partage s’affichent en priorité dans votre liste lorsque vous recherchez un groupe ou une personne, vous pouvez les retrouver dans l’annuaire."
            }
            placement="top"
          >
            <IconInfoCircle className="c-pointer" height="18" />
          </Tooltip>
        </Box>
        <Box className="row">
          <Box className="col-12" sx={{ input: { minWidth: "26rem", borderRadius: "1.2rem" } }}>
            <Combobox
              value={searchInputValue}
              placeholder={searchPlaceholder}
              isLoading={showSearchLoading()}
              noResult={showSearchNoResults()}
              options={searchResults}
              searchMinLength={getSearchMinLength()}
              onSearchInputChange={handleSearchInputChange}
              onSearchResultsChange={(results) => {
                void handleSearchResultsChange(results);
              }}
            />
          </Box>
        </Box>
        {children}
        {publicLink && (
          <Box>
            <Box component={BoxComponentType.HR} />
            <Box className="mb-16 d-flex align-items-center">
              <Typography color={TEXT_PRIMARY_COLOR} variant={TypographyVariant.H3} className="me-8">
                {tForm("formulaire.share.link.access")}
              </Typography>
            </Box>
            <Box sx={flexStartBoxStyle}>
              <Typography fontStyle={"italic"}>{publicLink}</Typography>
              <Box onClick={() => handleCopyPublicLink} sx={{ cursor: "pointer" }}>
                <ContentCopyIcon sx={{ marginLeft: "1rem", fontSize: "1.5rem" }} />
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant={ComponentVariant.OUTLINED} onClick={onCancel}>
          {tEdifice("explorer.cancel")}
        </Button>
        <Button variant={ComponentVariant.CONTAINED} onClick={() => void handleShare()} disabled={isSharing}>
          {tEdifice("share")}
        </Button>
      </DialogActions>
    </Dialog>,
    document.getElementById("portal") as HTMLElement,
  );
}
