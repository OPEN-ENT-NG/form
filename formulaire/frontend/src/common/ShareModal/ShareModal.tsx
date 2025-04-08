import { ReactNode, useState } from "react";

import { ID, PutShareResponse, RightStringified, ShareRight } from "@edifice.io/client";
import { UseMutationResult } from "@tanstack/react-query";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { Avatar, Button, Combobox, LoadingScreen, Tooltip, VisuallyHidden } from "@edifice.io/react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Checkbox,
} from "@cgi-learning-hub/ui";
import { IconBookmark, IconInfoCircle, IconRafterDown } from "@edifice.io/react/icons";
import { ShareBookmark } from "./ShareBookmark";
import { ShareBookmarkLine } from "./ShareBookmarkLine";
import { useSearch } from "./hooks/useSearch";
import useShare from "./hooks/useShare";
import { useShareBookmark } from "./hooks/useShareBookmark";
import { userHasRight } from "./utils/hasRight";
import { FORMULAIRE } from "~/core/constants";
import { BreakpointVariant, TypographyFont, TypographyVariant } from "~/core/style/themeProps";
import { useShareModal } from "~/providers/ShareModalProvider";

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
  },
  unknown
>;

interface ShareResourceModalProps {
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
}

export default function ShareResourceModal({
  isOpen,
  shareOptions,
  shareResource,
  children,
  onSuccess,
  onCancel,
}: ShareResourceModalProps) {
  const { resourceId, resourceCreatorId, resourceRights } = shareOptions;
  console.log(shareOptions);
  const { userFormsRight } = useShareModal();
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

  const { t: tEdifice } = useTranslation();
  const { t: tForm } = useTranslation(FORMULAIRE);

  const searchPlaceholder = showSearchAdmlHint()
    ? tEdifice("explorer.search.adml.hint")
    : tEdifice("explorer.modal.share.search.placeholder");

  return createPortal(
    <Dialog id="share_modal" maxWidth={BreakpointVariant.MD} open={isOpen} onClose={onCancel} fullWidth>
      <DialogTitle variant={TypographyVariant.H2} fontWeight={TypographyFont.BOLD}>
        {tEdifice("share.title")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText variant={TypographyVariant.H3} sx={{ mb: 2 }}>
          {tEdifice("explorer.modal.share.usersWithAccess")}
        </DialogContentText>
        <Box className="table-responsive">
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <Box
              component="table"
              className="table border align-middle mb-0"
              sx={{ borderCollapse: "collapse !important" }}
            >
              <Box component="thead" sx={{ backgroundColor: "var(--theme-palette-primary-main) !important" }}>
                <Box component="tr">
                  <Box component="th" scope="col" className="w-32">
                    <VisuallyHidden>{tEdifice("explorer.modal.share.avatar.shared.alt")}</VisuallyHidden>
                  </Box>
                  <Box component="th" scope="col">
                    <VisuallyHidden>{tEdifice("explorer.modal.share.search.placeholder")}</VisuallyHidden>
                  </Box>
                  {shareRightActions
                    .filter((shareRightAction) => shareRightAction.id !== "read")
                    .map((shareRightAction) => (
                      <th key={shareRightAction.displayName} scope="col" className="text-center text-white">
                        {tForm("formulaire." + shareRightAction.displayName)}
                      </th>
                    ))}
                  <Box component="th" scope="col">
                    <VisuallyHidden>{tEdifice("close")}</VisuallyHidden>
                  </Box>
                </Box>
              </Box>
              <Box component="tbody">
                <Box component="tr">
                  <Box component="th" scope="row">
                    <Avatar
                      alt={tEdifice("explorer.modal.share.avatar.me.alt")}
                      size="xs"
                      src={myAvatar}
                      variant="circle"
                    />
                  </Box>
                  <Box component="td">{tEdifice("share.me")}</Box>
                  {shareRightActions
                    .filter((shareRightAction) => shareRightAction.id !== "read")
                    .map((shareRightAction) => (
                      <Box
                        component="td"
                        key={shareRightAction.displayName}
                        style={{ width: "80px" }}
                        className="text-center text-white"
                      >
                        <Checkbox
                          checked={
                            currentIsAuthor() || userHasRight(userFormsRight, parseInt(resourceId), shareRightAction.id)
                          }
                          sx={{
                            "&.Mui-checked": {
                              color: "var(--theme-palette-primary-main)",
                              opacity: 0.5,
                            },
                            "& .MuiSvgIcon-root": { fontSize: 24 },
                          }}
                          disabled
                        />
                      </Box>
                    ))}
                  <Box component="td"></Box>
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
          <Button
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
            onClick={() => toggleBookmarkInput(!showBookmarkInput)}
          >
            {tEdifice("share.save.sharebookmark")}
          </Button>
          {showBookmarkInput && (
            <ShareBookmark
              refBookmark={refBookmark}
              bookmark={bookmark}
              onBookmarkChange={handleBookmarkChange}
              onSave={handleOnSave}
            />
          )}
        </Box>
        <Box component="hr" />
        <DialogContentText variant={TypographyVariant.H3} sx={{ alignItems: "center", display: "flex", mb: 2 }}>
          <Box className="me-8">{tEdifice("explorer.modal.share.search")}</Box>
          <Tooltip
            message={
              "Vos favoris de partage s’affichent en priorité dans votre liste lorsque vous recherchez un groupe ou une personne, vous pouvez les retrouver dans l’annuaire."
            }
            placement="top"
          >
            <IconInfoCircle className="c-pointer" height="18" />
          </Tooltip>
        </DialogContentText>
        <Box className="row">
          <Box className="col-10">
            <Combobox
              value={searchInputValue}
              placeholder={searchPlaceholder}
              isLoading={showSearchLoading()}
              noResult={showSearchNoResults()}
              options={searchResults}
              searchMinLength={getSearchMinLength()}
              onSearchInputChange={handleSearchInputChange}
              onSearchResultsChange={handleSearchResultsChange}
            />
          </Box>
        </Box>
        {children}
      </DialogContent>
      <DialogActions>
        <Button type="button" color="tertiary" variant="ghost" onClick={onCancel}>
          {tEdifice("explorer.cancel")}
        </Button>

        <Button
          type="button"
          color="primary"
          variant="filled"
          isLoading={isSharing}
          onClick={handleShare}
          disabled={isSharing}
          style={{
            backgroundColor: "var(--theme-palette-primary-main)",
            borderColor: "var(--theme-palette-primary-main)",
          }}
        >
          {tEdifice("share")}
        </Button>
      </DialogActions>
    </Dialog>,
    document.getElementById("portal") as HTMLElement,
  );
}
