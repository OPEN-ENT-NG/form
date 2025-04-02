import { FC, useState, MouseEvent, useMemo, useCallback, useEffect } from "react";
import { Box, Button, MenuItem } from "@cgi-learning-hub/ui";
import { Menu, Divider, Chip, Typography } from "@mui/material";
import { ComponentVariant, TypographyVariant } from "~/core/style/themeProps";

import { FORMULAIRE } from "~/core/constants";
import { useTranslation } from "react-i18next";
import { ChipProps, menuAnchorOrigin, MenuItemProps, menuTransformOrigin, OrganizeFilterProps } from "./types";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  buttonStyle,
  chipContainerStyle,
  chipMenuItemStyle,
  filterArrowStyle,
  filterTitleStyle,
  menuStyle,
  sortContainerStyle,
  sortMenuItem,
  sortTitleStyle,
} from "./style";
import { MenuItemState } from "./enum";
import { getNextMenuItemState } from "./utils";

export const OrganizeFilter: FC<OrganizeFilterProps> = ({
  chipData = [],
  menuItemData = [],
  setSelectedChips,
  selectedChips = [],
  setSelectedMenuItem,
  selectedMenuItem,
}) => {
  const { t } = useTranslation(FORMULAIRE);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const chipsEnabled = useMemo(() => chipData.length > 0 && !!setSelectedChips, [chipData, setSelectedChips]);
  const menuItemsEnabled = useMemo(
    () => menuItemData.length > 0 && !!setSelectedMenuItem,
    [menuItemData, setSelectedMenuItem],
  );
  const selectedMenuItemAscending = useMemo(
    () => selectedMenuItem?.state === MenuItemState.ASCENDING,
    [selectedMenuItem],
  );
  const isCurrentItemSelected = useCallback(
    (item: MenuItemProps) => {
      return selectedMenuItem?.id === item.id;
    },
    [selectedMenuItem],
  );

  useEffect(() => {
    if (menuItemData.length > 0 && !selectedMenuItem && setSelectedMenuItem) {
      setSelectedMenuItem({
        ...menuItemData[0],
        state: MenuItemState.DESCENDING,
      });
    }
  }, [menuItemData, selectedMenuItem, setSelectedMenuItem]);

  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleChipClick = useCallback(
    (chip: ChipProps) => {
      if (!setSelectedChips) return;

      const updatedChips = selectedChips.some((c) => c.id === chip.id)
        ? selectedChips.filter((c) => c.id !== chip.id)
        : [...selectedChips, chip];

      setSelectedChips(updatedChips);
    },
    [selectedChips, setSelectedChips],
  );

  const handleMenuItemClick = useCallback(
    (menuItem: MenuItemProps) => {
      if (!setSelectedMenuItem) return;

      if (!selectedMenuItem || selectedMenuItem.id !== menuItem.id) {
        return setSelectedMenuItem({
          ...menuItem,
          state: MenuItemState.DESCENDING,
        });
      }

      const nextState = getNextMenuItemState(selectedMenuItem.state);

      return setSelectedMenuItem({
        ...menuItem,
        state: nextState,
      });
    },
    [selectedMenuItem, setSelectedMenuItem],
  );

  return (
    <Box>
      <Button variant={ComponentVariant.OUTLINED} onClick={handleClick} sx={buttonStyle}>
        <FilterAltIcon />
        {t("formulaire.organize")}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        anchorOrigin={menuAnchorOrigin}
        transformOrigin={menuTransformOrigin}
        sx={menuStyle}
      >
        {menuItemsEnabled && (
          <>
            <Typography variant={TypographyVariant.H6} sx={sortTitleStyle}>
              {t("formulaire.filter.title.sort")}
            </Typography>
            <Box sx={sortContainerStyle}>
              {menuItemData.map((item) => (
                <MenuItem
                  sx={sortMenuItem}
                  key={item.id}
                  selected={isCurrentItemSelected(item)}
                  onClick={() => handleMenuItemClick(item)}
                >
                  {isCurrentItemSelected(item) &&
                    (selectedMenuItemAscending ? (
                      <ArrowUpwardIcon sx={filterArrowStyle} />
                    ) : (
                      <ArrowDownwardIcon sx={filterArrowStyle} />
                    ))}
                  <Typography>{t(item.i18nKey)}</Typography>
                </MenuItem>
              ))}
            </Box>
          </>
        )}

        {menuItemsEnabled && chipsEnabled && <Divider />}

        {chipsEnabled && (
          <>
            <Typography variant={TypographyVariant.H6} sx={filterTitleStyle}>
              {t("formulaire.filter.title.filter")}
            </Typography>
            <MenuItem disableRipple={true} onClick={(e) => e.stopPropagation()} sx={chipMenuItemStyle}>
              <Box sx={chipContainerStyle}>
                {chipData.map((chip, index) => (
                  <Chip
                    key={index}
                    label={<Typography variant={TypographyVariant.BODY2}>{t(chip.i18nKey)}</Typography>}
                    onClick={() => handleChipClick(chip)}
                    color={selectedChips.some((c) => c.id === chip.id) ? "primary" : "default"}
                  />
                ))}
              </Box>
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};
