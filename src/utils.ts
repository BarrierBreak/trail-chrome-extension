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
    case "errors":
      return "Fail";
    case "warnings":
      return "Manual";
    case "pass":
      return "Pass";
    case "notices":
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
