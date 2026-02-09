import chroma from 'chroma-js';
import { isValidColor } from './colors';

export const materialPalette = {
  base: '#45403d',
  black: '#665c54',
  white: '#ebdbb2',

  blue: '#7daea3',
  blueDim: '#68948a',
  cyan: '#89b482',
  cyanDim: '#72966c',
  green: '#a9b665',
  greenDim: '#8f9a52',
  orange: '#e78a4e',
  orangeDim: '#bd6f3e',
  pink: '#d3869b',
  pinkDim: '#ab6c7d',
  purple: '#9b6f96',
  purpleDim: '#7a4f72',
  red: '#ea6962',
  redDim: '#b85651',
  violet: '#7276a6',
  violetDim: '#5c6089',
  yellow: '#e3ae5a',
  yellowDim: '#c18f41',
};

/**
 * Gets the material color from the material palette
 * @param key the key of the material color e.g. 'blue-grey-500'
 */
export const getMaterialColorByKey = (key: string): string | undefined => {
  if (key in materialPalette) {
    return materialPalette[key as keyof typeof materialPalette];
  }

  return undefined;
};

/**
 * Given a color, returns the closest material color from the
 * material palette.
 */
export const closerMaterialColorTo = (color: string): string => {
  const palette = Object.values(materialPalette);

  if (!isValidColor(color)) {
    throw new Error(`The given color "${color}" is not valid!`);
  }

  color = chroma(color).hex();

  const distances = palette
    .map((paletteColor) => ({
      // calculate the distance between the color and the palette color
      distance: chroma.deltaE(paletteColor, color),
      color: paletteColor,
    }))
    .sort((a, b) => a.distance - b.distance);

  return distances[0].color;
};
