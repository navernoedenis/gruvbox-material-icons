import { window as codeWindow, type QuickPickItem } from 'vscode';
import {
  getDefaultConfig,
  logger,
  translate,
  validateHEXColorCode,
} from '../../core';
import { getThemeConfig, setThemeConfig } from '../shared/config';

type FileColor = {
  label: string;
  hex: string;
};

const iconPalette: FileColor[] = [
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

/** Command to toggle the file icons. */
export const changeFileColor = async () => {
  try {
    const status = checkFileColorStatus();
    const response = await showQuickPickItems(status);
    if (response) {
      handleQuickPickActions(response);
    }
  } catch (error) {
    logger.error(error);
  }
};

/** Show QuickPick items to select preferred color for the file icons. */
const showQuickPickItems = (currentColor: string) => {
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
const handleQuickPickActions = async (value: QuickPickItem) => {
  if (!value || !value.description) return;
  if (value.description === 'Custom Color') {
    const value = await codeWindow.showInputBox({
      placeHolder: translate('colorSelect.hexCode'),
      ignoreFocusOut: true,
      validateInput: validateColorInput,
    });
    if (value) {
      setColorConfig(value);
    }
  } else {
    const hexCode = iconPalette.find((c) => c.label === value.description)?.hex;
    if (hexCode) {
      setColorConfig(hexCode);
    }
  }
};

const validateColorInput = (colorInput: string) => {
  if (!validateHEXColorCode(colorInput)) {
    return translate('colorSelect.wrongHexCode');
  }
  return undefined;
};

/** Check status of the file color */
export const checkFileColorStatus = (): string => {
  const defaultConfig = getDefaultConfig();
  return getThemeConfig<string>('files.color') ?? defaultConfig.files.color;
};

const setColorConfig = (value: string) => {
  setThemeConfig('files.color', value.toLowerCase(), true);
};

const isColorActive = (color: FileColor, currentColor: string): boolean => {
  if (color.label === 'Custom Color') {
    return !iconPalette.some(
      (c) => c.hex.toLowerCase() === currentColor.toLowerCase()
    );
  }
  return color.hex.toLowerCase() === currentColor.toLowerCase();
};
