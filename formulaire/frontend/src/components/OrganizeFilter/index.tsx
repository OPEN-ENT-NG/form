import { FC, useState, MouseEvent, useMemo, useCallback, useEffect } from "react";
import { Box, Button, MenuItem } from "@cgi-learning-hub/ui";
import { Menu, Divider, Chip, Typography } from "@mui/material";
import { ComponentVariant, TypographyVariant } from "~/core/style/themeProps";

import { FORMULAIRE } from "~/core/constants";
import { useTranslation } from "react-i18next";
import { IFormChipProps, IMenuItemProps, IOrganizeFilterProps } from "./types";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  buttonStyle,
  chipContainerStyle,
  chipMenuItemStyle,
  filterArrowStyle,
  filterTitleStyle,
  menuAnchorOrigin,
  menuStyle,
  menuTransformOrigin,
  sortContainerStyle,
  sortMenuItem,
  sortTitleStyle,
} from "./style";
import { MenuItemState } from "./enum";
import { getNextMenuItemState } from "./utils";

export const OrganizeFilter: FC<IOrganizeFilterProps> = ({
  chipDatas = [],
  menuItemDatas = [],
  setSelectedChips,
  selectedChips = [],
  setSelectedMenuItem,
  selectedMenuItem,
  forceUniqueChips = false,
}) => {
  const { t } = useTranslation(FORMULAIRE);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const chipsEnabled = useMemo(() => chipDatas.length > 0 && !!setSelectedChips, [chipDatas, setSelectedChips]);
  const menuItemsEnabled = useMemo(
    () => menuItemDatas.length > 0 && !!setSelectedMenuItem,
    [menuItemDatas, setSelectedMenuItem],
  );
  const selectedMenuItemAscending = useMemo(
    () => selectedMenuItem?.state === MenuItemState.ASCENDING,
    [selectedMenuItem],
  );
  const isCurrentItemSelected = useCallback(
    (item: IMenuItemProps) => {
      return selectedMenuItem?.id === item.id;
    },
    [selectedMenuItem],
  );

  useEffect(() => {
    if (menuItemDatas.length > 0 && !selectedMenuItem && setSelectedMenuItem) {
      setSelectedMenuItem({
        ...menuItemDatas[0],
        state: MenuItemState.DESCENDING,
      });
    }
  }, [menuItemDatas, selectedMenuItem, setSelectedMenuItem]);

  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleChipClick = useCallback(
    (chip: IFormChipProps) => {
      if (!setSelectedChips) return;

      if (forceUniqueChips) {
        // If forceUniqueChips is true, only allow one chip to be selected at a time
        const isChipSelected = selectedChips.some((c) => c.id === chip.id);
        setSelectedChips(isChipSelected ? [] : [chip]);
        return;
      }
      // Original behavior: toggle the chip in the selection
      const updatedChips = selectedChips.some((c) => c.id === chip.id)
        ? selectedChips.filter((c) => c.id !== chip.id)
        : [...selectedChips, chip];
      setSelectedChips(updatedChips);
      return;
    },
    [selectedChips, setSelectedChips, forceUniqueChips],
  );

  const handleMenuItemClick = useCallback(
    (menuItem: IMenuItemProps) => {
      if (!setSelectedMenuItem) return;

      if (!selectedMenuItem || selectedMenuItem.id !== menuItem.id) {
        setSelectedMenuItem({
          ...menuItem,
          state: MenuItemState.DESCENDING,
        });
        return;
      }

      const nextState = getNextMenuItemState(selectedMenuItem.state);

      setSelectedMenuItem({
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
            <Typography variant={TypographyVariant.BODY2} sx={sortTitleStyle}>
              {t("formulaire.filter.title.sort")}
            </Typography>
            <Box sx={sortContainerStyle}>
              {menuItemDatas.map((item) => (
                <MenuItem
                  sx={sortMenuItem}
                  key={item.id}
                  selected={isCurrentItemSelected(item)}
                  onClick={() => {
                    handleMenuItemClick(item);
                  }}
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
            <Typography variant={TypographyVariant.BODY2} sx={filterTitleStyle}>
              {t("formulaire.filter.title.filter")}
            </Typography>
            <MenuItem
              disableRipple={true}
              onClick={(e) => {
                e.stopPropagation();
              }}
              sx={chipMenuItemStyle}
            >
              <Box sx={chipContainerStyle}>
                {chipDatas.map((chip, index) => (
                  <Chip
                    key={index}
                    label={<Typography variant={TypographyVariant.BODY2}>{t(chip.i18nKey)}</Typography>}
                    onClick={() => {
                      handleChipClick(chip);
                    }}
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
