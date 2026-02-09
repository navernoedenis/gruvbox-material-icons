import { window as codeWindow, type QuickPickItem } from 'vscode';
import {
  getDefaultConfig,
  logger,
  translate,
  validateHEXColorCode,
} from '../../core';
import { getThemeConfig, setThemeConfig } from '../shared/config';

type FolderColor = {
  label: string;
  hex: string;
};

const iconPalette: FolderColor[] = [
  { label: 'Base', hex: '#45403d' },
  { label: 'Custom Color', hex: 'Custom HEX Code' },

  { label: 'Black', hex: '#665c54' },
  { label: 'Blue', hex: '#7daea3' },
  { label: 'Blue Dim', hex: '#68948a' },
  { label: 'Cyan', hex: '#89b482' },
  { label: 'Cyan Dim', hex: '#72966c' },
  { label: 'Green', hex: '#a9b665' },
  { label: 'Green Dim', hex: '#8f9a52' },
  { label: 'Orange', hex: '#e78a4e' },
  { label: 'Orange Dim', hex: '#bd6f3e' },
  { label: 'Pink', hex: '#d3869b' },
  { label: 'Pink Dim', hex: '#ab6c7d' },
  { label: 'Purple', hex: '#9b6f96' },
  { label: 'Purple Dim', hex: '#7a4f72' },
  { label: 'Red', hex: '#ea6962' },
  { label: 'Red Dim', hex: '#b85651' },
  { label: 'Violet', hex: '#7276a6' },
  { label: 'Violet Dim', hex: '#5c6089' },
  { label: 'White', hex: '#ebdbb2' },
  { label: 'Yellow', hex: '#e3ae5a' },
  { label: 'Yellow Dim', hex: '#c18f41' },
];

/** Command to toggle the folder icons. */
export const changeFolderColor = async () => {
  try {
    const status = checkFolderColorStatus();
    const response = await showFolderColorQuickPickItems(status);
    if (response) {
      handleFolderColorQuickPickActions(response, 'folders.color');
    }
  } catch (error) {
    logger.error(error);
  }
};

/** Show QuickPick items to select preferred color for the folder icons. */
export const showFolderColorQuickPickItems = (currentColor: string) => {
  const options = iconPalette.map(
    (color): QuickPickItem => ({
      description: color.label,
      label: isColorActive(color, currentColor) ? '\u2714' : '\u25FB',
    })
  );

  return codeWindow.showQuickPick(options, {
    placeHolder: translate('colorSelect.color'),
    ignoreFocusOut: false,
    matchOnDescription: true,
  });
};

/** Handle the actions from the QuickPick. */
export const handleFolderColorQuickPickActions = async (
  value: QuickPickItem,
  configSection: string
) => {
  if (!value || !value.description) return;
  if (value.description === 'Custom Color') {
    const value = await codeWindow.showInputBox({
      placeHolder: translate('colorSelect.hexCode'),
      ignoreFocusOut: true,
      validateInput: validateColorInput,
    });
    if (value) {
      setColorConfig(value, configSection);
    }
  } else {
    const hexCode = iconPalette.find((c) => c.label === value.description)?.hex;
    if (hexCode) {
      setColorConfig(hexCode, configSection);
    }
  }
};

const validateColorInput = (colorInput: string) => {
  if (!validateHEXColorCode(colorInput)) {
    return translate('colorSelect.wrongHexCode');
  }
  return undefined;
};

/** Check status of the folder color */
export const checkFolderColorStatus = (): string => {
  const defaultConfig = getDefaultConfig();
  const folderColorConfig = getThemeConfig<string>('folders.color');
  return folderColorConfig ?? defaultConfig.folders.color!;
};

const setColorConfig = (value: string, configSection: string) => {
  setThemeConfig(configSection, value.toLowerCase(), true);
};

const isColorActive = (color: FolderColor, currentColor: string): boolean => {
  if (color.label === 'Custom Color') {
    return !iconPalette.some(
      (c) => c.hex.toLowerCase() === currentColor.toLowerCase()
    );
  }
  return color.hex.toLowerCase() === currentColor.toLowerCase();
};
