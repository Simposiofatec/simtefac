function hexToRgb(hex: string) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return { r, g, b };
}

function isHexDark(hex: string) {
  const rgb = hexToRgb(hex);
  const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
  return luminance < 0.5;
}

function darkenHexColor(hexColor: string, percentage: number) {
  // Convert hex color string to RGB values
  const red = parseInt(hexColor.slice(1, 3), 16);
  const green = parseInt(hexColor.slice(3, 5), 16);
  const blue = parseInt(hexColor.slice(5, 7), 16);

  // Calculate darker RGB values
  const darkRed = Math.floor(red * (1 - percentage / 100));
  const darkGreen = Math.floor(green * (1 - percentage / 100));
  const darkBlue = Math.floor(blue * (1 - percentage / 100));

  // Convert darker RGB values back to hex color string
  const darkHexColor = `#${darkRed.toString(16).padStart(2, '0')}${darkGreen.toString(16).padStart(2, '0')}${darkBlue.toString(16).padStart(2, '0')}`;

  return darkHexColor;
}

export { hexToRgb, isHexDark, darkenHexColor }