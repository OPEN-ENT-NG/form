import { ReactNode, useState } from "react";

import { ID, PutShareResponse, RightStringified, ShareRight } from "@edifice.io/client";
import { UseMutationResult } from "@tanstack/react-query";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { Avatar, Button, Checkbox, Combobox, Heading, LoadingScreen, Modal, Tooltip, VisuallyHidden } from "@edifice.io/react";
import { Box } from "@cgi-learning-hub/ui";
import { IconBookmark, IconInfoCircle, IconRafterDown } from "@edifice.io/react/icons";
import { ShareBookmark } from "./ShareBookmark";
import { ShareBookmarkLine } from "./ShareBookmarkLine";
import { useSearch } from "./hooks/useSearch";
import useShare from "./hooks/useShare";
import { useShareBookmark } from "./hooks/useShareBookmark";
import { userHasRight } from "./utils/hasRight";
import { FORMULAIRE } from "~/core/constants";
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
    <Modal id="share_modal" size="lg" isOpen={isOpen} onModalClose={onCancel}>
      <Modal.Header onModalClose={onCancel}>
        {tEdifice("share.title")}
      </Modal.Header>
      <Modal.Body>
      <Heading headingStyle="h4" level="h3" className="mb-16">
          {tEdifice("explorer.modal.share.usersWithAccess")}
      </Heading>
        <Box className="table-responsive">
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <Box
              component="table"
              className="table border align-middle mb-0"
            >
              <Box component="thead" className="bg-secondary">
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
        <Heading
          headingStyle="h4"
          level="h3"
          className="mb-16 d-flex align-items-center"
        >
          <Box className="me-8">{tEdifice("explorer.modal.share.search")}</Box>
          <Tooltip
            message={
              "Vos favoris de partage s’affichent en priorité dans votre liste lorsque vous recherchez un groupe ou une personne, vous pouvez les retrouver dans l’annuaire."
            }
            placement="top"
          >
            <IconInfoCircle className="c-pointer" height="18" />
          </Tooltip>
        </Heading>
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
      </Modal.Body>
      <Modal.Footer>
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
        >
          {tEdifice("share")}
        </Button>
      </Modal.Footer>
    </Modal>,
    document.getElementById("portal") as HTMLElement,
  );
}
