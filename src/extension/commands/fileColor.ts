import { type QuickPickItem, window as codeWindow } from 'vscode';
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
  { label: 'Default', hex: '#45403d' },

  { label: 'Black', hex: '#665c54' },
  { label: 'Blue', hex: '#7daea3' },
  { label: 'Cyan', hex: '#89b482' },
  { label: 'Green', hex: '#a9b665' },
  { label: 'Orange', hex: '#e78a4e' },
  { label: 'Pink', hex: '#d3869b' },
  { label: 'Red', hex: '#ea6962' },
  { label: 'White', hex: '#ebdbb2' },
  { label: 'Yellow', hex: '#e3ae5a' },

  { label: 'Dim Blue', hex: '#68948a' },
  { label: 'Dim Cyan', hex: '#72966c' },
  { label: 'Dim Green', hex: '#8f9a52' },
  { label: 'Dim Orange', hex: '#bd6f3e' },
  { label: 'Dim Pink', hex: '#ab6c7d' },
  { label: 'Dim Red', hex: '#b85651' },
  { label: 'Dim Yellow', hex: '#c18f41' },

  { label: 'Custom Color', hex: 'Custom HEX Code' },
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
