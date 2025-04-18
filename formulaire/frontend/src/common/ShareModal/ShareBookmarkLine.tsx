import { ShareRight, ShareRightAction, ShareRightActionDisplayName, ShareRightWithVisibles } from "@edifice.io/client";
import { Avatar, Button, IconButton, Checkbox } from "@edifice.io/react";
import { Box } from "@cgi-learning-hub/ui";
import { IconBookmark, IconClose, IconRafterDown } from "@edifice.io/react/icons";
import { useTranslation } from "react-i18next";

import { hasRight } from "./utils/hasRight";
import { showShareRightLine } from "./utils/showShareRightLine";
import { BoxComponentType } from "~/core/style/themeProps";

export const ShareBookmarkLine = ({
  shareRights,
  showBookmark,
  toggleBookmark,
  shareRightActions,
  toggleRight,
  onDeleteRow,
}: {
  shareRights: ShareRightWithVisibles;
  shareRightActions: ShareRightAction[];
  showBookmark: boolean;
  toggleRight: (shareRight: ShareRight, actionName: ShareRightActionDisplayName) => void;
  toggleBookmark: () => void;
  onDeleteRow: (shareRight: ShareRight) => void;
}) => {
  const { t } = useTranslation();
  return shareRights.rights.map((shareRight: ShareRight) => {
    return (
      showShareRightLine(shareRight, showBookmark) && (
        <Box
          component={BoxComponentType.TR}
          key={shareRight.id}
          className={shareRight.isBookmarkMember ? "bg-light" : ""}
        >
          <Box component={BoxComponentType.TD}>
            {shareRight.type !== "sharebookmark" && (
              <Avatar
                alt={t("explorer.modal.share.avatar.shared.alt")}
                size="xs"
                src={shareRight.avatarUrl}
                variant="circle"
              />
            )}

            {shareRight.type === "sharebookmark" && <IconBookmark />}
          </Box>
          <Box component={BoxComponentType.TD}>
            <Box className="d-flex">
              {shareRight.type === "sharebookmark" && (
                <Button
                  color="tertiary"
                  rightIcon={
                    <IconRafterDown
                      title={t("show")}
                      className="w-16 min-w-0"
                      style={{
                        transition: "rotate 0.2s ease-out",
                        rotate: showBookmark ? "-180deg" : "0deg",
                      }}
                    />
                  }
                  type="button"
                  variant="ghost"
                  className="fw-normal ps-0"
                  onClick={toggleBookmark}
                >
                  {shareRight.displayName}
                </Button>
              )}
              {shareRight.type !== "sharebookmark" && shareRight.displayName}
              {shareRight.type === "user" && ` (${t(shareRight.profile || "")})`}
            </Box>
          </Box>
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
                  checked={hasRight(shareRight, shareRightAction)}
                  onChange={() => {
                    toggleRight(shareRight, shareRightAction.id);
                  }}
                />
              </Box>
            ))}
          <Box component={BoxComponentType.TD}>
            {!shareRight.isBookmarkMember && (
              <IconButton
                aria-label={t("close")}
                color="tertiary"
                icon={<IconClose />}
                type="button"
                variant="ghost"
                title={t("close")}
                onClick={() => {
                  onDeleteRow(shareRight);
                }}
              />
            )}
          </Box>
        </Box>
      )
    );
  });
};
