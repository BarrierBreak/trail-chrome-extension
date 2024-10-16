/* eslint-disable @typescript-eslint/no-explicit-any */

// Function to convert RGBA to Hex
export function rgbaToHex(rgba: string): string {
  const rgbaValues = rgba.match(/\d+(\.\d+)?/g);
  if (rgbaValues) {
    const r = parseInt(rgbaValues[0]);
    const g = parseInt(rgbaValues[1]);
    const b = parseInt(rgbaValues[2]);
    const a = rgbaValues[3] ? Math.round(parseFloat(rgbaValues[3]) * 255) : 255; // Default alpha to 255 if not provided
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}${a
      .toString(16)
      .padStart(2, "0")}`;
  }
  return "";
}

// Function to convert Hex to RGB
export function hexToRgb(hex: string): [number, number, number] {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

// Function to check if color has 100%opacity
export const checkForOpacity = (color: string) => {
  let hexColor = rgbaToHex(color);

  if (hexColor.endsWith("ff")) {
    hexColor = hexColor.slice(0, -2);
  }
  return hexColor;
};

// Function to blend colors based on opacity
export const blendColors = (fg: number[], bg: number[], opacity: number) =>
  fg.map((c, i) => Math.round(c * opacity + bg[i] * (1 - opacity)));

// Function to parse rgba string into R, G, B and A
export function parseRGBA(rgba: string): number[] {
  const match = rgba.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)/
  );

  if (!match) return [];

  const r = Number(match[1]);
  const g = Number(match[2]);
  const b = Number(match[3]);
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

  return [r, g, b, a];
}

// Function to format RGB values to string
export function arrayToRgbString(rgbArray: [number, number, number]): string {
  const [r, g, b] = rgbArray;
  return `rgb(${r}, ${g}, ${b})`;
}

// Function to calculate luminance
export function calculateLuminance(r: number, g: number, b: number): number {
  const a = [r / 255, g / 255, b / 255].map((value) => {
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

// Function to calculate color contrast ratio
export function getContrastRatio(fg: number[], bg: number[]) {
  const opacity = fg[3] !== undefined ? fg[3] : 1;
  const blendedColor = blendColors(fg, bg, opacity);

  const l1 = calculateLuminance(
    blendedColor[0],
    blendedColor[1],
    blendedColor[2]
  );
  const l2 = calculateLuminance(bg[0], bg[1], bg[2]);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Function to convert number to alphabet
export function numberToAlphabet(num: number): string {
  if (num < 1) {
    console.error("Number must be greater than or equal to 1");
  }

  let result = "";
  while (num > 0) {
    const remainder = (num - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    num = Math.floor((num - 1) / 26);
  }
  return result;
}

// Function to get alt text for images
export const getAltText = (issueType: string) => {
  switch (issueType) {
    case "error":
      return "Fail";
    case "warning":
      return "Manual";
    case "pass":
      return "Pass";
    case "notice":
      return "BP";
    default:
      break;
  }
};

// Function to format input for color contrast
export function formatInput(input: string): any {
  let fontsize = "";
  let fontweight = "";
  let fg = "";
  let bg = "";
  let ratio = "";

  const regex = /(\w+)--([^=]+)/g;
  let match;

  while ((match = regex.exec(input)) !== null) {
    const key = match[1];
    const value = match[2];
    switch (key) {
      case "fontsize":
        fontsize = `${parseInt(value)}px`;
        break;
      case "fontweight":
        fontweight = parseInt(value) >= 700 ? "Bold" : "";
        break;
      case "forec":
        fg = rgbaToHex(value);
        break;
      case "backc":
        bg = rgbaToHex(value);
        break;
      case "ratio":
        ratio = parseFloat(parseFloat(value.slice(0, -2)).toFixed(2)) + ":1";
        break;
      default:
        break;
    }
  }

  return { fontsize, fontweight, fg, bg, ratio };
}
