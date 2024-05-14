import chroma, { deltaE } from 'chroma-js';
import { isValidColor } from './colors';

export const materialPalette = {
  black: '#665c54',
  blue: '#7daea3',
  cyan: '#89b482',
  green: '#a9b665',
  orange: '#e78a4e',
  pink: '#d3869b',
  red: '#ea6962',
  white: '#ebdbb2',
  yellow: '#e3ae5a',

  'dim-blue': '#68948a',
  'dim-cyan': '#72966c',
  'dim-green': '#8f9a52',
  'dim-orange': '#bd6f3e',
  'dim-pink': '#ab6c7d',
  'dim-red': '#b85651',
  'dim-yellow': '#c18f41',
};

/**
 * Gets the material color from the material palette
 * @param key the key of the material color e.g. 'blue-grey-500'
 */
export function getMaterialColorByKey(key: string): string | undefined {
  if (key in materialPalette) {
    return materialPalette[key as keyof typeof materialPalette];
  }

  return undefined;
}

/**
 * Given a color, returns the closest material color from the
 * material palette.
 */
export function closerMaterialColorTo(color: string): string {
  const palette = Object.values(materialPalette);

  if (!isValidColor(color)) {
    throw new Error(`The given color "${color}" is not valid!`);
  }

  color = chroma(color).hex();

  const distances = palette
    .map((paletteColor) => ({
      // calculate the distance between the color and the palette color
      distance: deltaE(paletteColor, color),
      color: paletteColor,
    }))
    .sort((a, b) => a.distance - b.distance);

  return distances[0].color;
}
