/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { Button, Input, Select, SelectItem } from "@trail-ui/react";
import { CheckIcon, CloseIcon, ColorPickerIcon } from "@trail-ui/icons";
import { rgbaToHex } from "./utils";

interface EyeDropper {
  open(): Promise<{ sRGBHex: string }>;
}

// Function to get luminance of color
const getLuminance = (r: number, g: number, b: number): number => {
  const normalize = (value: number) => {
    const sRGB = value / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * normalize(r) + 0.7152 * normalize(g) + 0.0722 * normalize(b);
};

// Function to convert to hex and check for opacity
const checkForOpacity = (color: string) => {
  let hexColor = rgbaToHex(color);
  if (hexColor.endsWith("ff")) {
    hexColor = hexColor.slice(0, -2);
  }
  return hexColor;
};

// Function to blend colors based on opacity
const blendColors = (fg: number[], bg: number[], opacity: number) =>
  fg.map((c, i) => Math.round(c * opacity + bg[i] * (1 - opacity)));

// Function to parse rgba string into R, G, B, and A
function parseRGBA(rgba: string): number[] {
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

// Function to get contrast ratio
function getContrastRatio(fg: number[], bg: number[]) {
  const opacity = fg[3] !== undefined ? fg[3] : 1;

  const blendedColor = blendColors(fg, bg, opacity);

  const l1 = getLuminance(blendedColor[0], blendedColor[1], blendedColor[2]);
  const l2 = getLuminance(bg[0], bg[1], bg[2]);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

declare const EyeDropper: {
  prototype: EyeDropper;
  new (): EyeDropper;
};

const ColorContrast = () => {
  const instructions =
    "According to WCAG, contrast ratios should be at least 4.5 : 1 for normal text and 3 : 1 for large text. Check your color contrast below.";

  const passIcon = <CheckIcon height={18} width={18} />;
  const failIcon = <CloseIcon height={18} width={18} />;

  const [hexForeground, setHexForeground] = useState("#000000");
  const [hexaForeground, setHexaForeground] = useState("#000000FF");
  const [hexBackground, setHexBackground] = useState("#FFFFFF");

  const [textColorArray, setTextColorArray] = useState([]);
  const [bgColorArray, setBgColorArray] = useState([]);
  const [fontSizeArray, setFontSizeArray] = useState([]);
  const [fontFamilyArray, setFontFamilyArray] = useState([]);
  const [stdTextLevelAA, setStdTextLevelAA] = useState([]);
  const [stdTextLevelAAA, setStdTextLevelAAA] = useState([]);
  const [largeTextLevelAA, setLargeTextLevelAA] = useState([]);
  const [largeTextLevelAAA, setLargeTextLevelAAA] = useState([]);

  const [selectedLevel, setSelectedLevel] = useState("AA");
  const [fgType, setFgType] = useState("hex");
  const [bgType, setBgType] = useState("hex");
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isIssueVisible, setIsIssueVisible] = useState(false);

  const apiKey = localStorage.getItem("authToken");

  const levelsData = [
    { label: "Level AA", value: "AA" },
    { label: "Level AAA", value: "AAA" },
  ];

  const fgColorTypes = [
    { label: "HEX", value: "hex" },
    { label: "HEXa", value: "hexa" },
  ];

  const bgColorTypes = [{ label: "HEX", value: "hex" }];

  const getContrastIssue = useCallback(() => {
    setIsIssueVisible(!isIssueVisible);

    fetch("https://trail-api.barrierbreak.com/api/colorChecker", {
      method: "GET",
      headers: {
        Accept: "*/*",
        "User-Agent": "GreasyMonk",
        "x-api-key": `${apiKey}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 500) {
          alert("Please enter your Auth Token in the Auth Token dialog");
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, [apiKey, isIssueVisible]);

  const handleContrastBtnClick = () => {
    getContrastIssue();
  };

  const eyeDropper = new EyeDropper();

  function hexToRgb(hex: string): [number, number, number] {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  }

  function hexAtoRgbA(hexA: string): [number, number, number, number] {
    const [r, g, b] = hexToRgb(hexA.slice(0, 7));
    const a = parseInt(hexA.slice(7, 9), 16) / 255;
    return [r, g, b, a];
  }

  function relativeLuminance(r: number, g: number, b: number): number {
    const a = [r, g, b].map((value) => {
      const normalized = value / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : Math.pow((normalized + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }

  function hexToRgbaFromShort(hex: string): [number, number, number, number] {
    const r = parseInt(hex[1] + hex[1], 16);
    const g = parseInt(hex[2] + hex[2], 16);
    const b = parseInt(hex[3] + hex[3], 16);
    const a = parseInt(hex[4], 16) / 15;

    return [r, g, b, a];
  }

  function contrastRatioHexA(hexA: string, hex: string): string {
    let fgR: number, fgG: number, fgB: number, alpha: number;
    if (
      (hexaForeground.length === 5 || hexaForeground.length === 9) &&
      (hexBackground.length === 4 || hexBackground.length === 7)
    ) {
      if (hexaForeground.length === 9) {
        [fgR, fgG, fgB, alpha] = hexAtoRgbA(hexA);
      } else if (hexaForeground.length === 5) {
        [fgR, fgG, fgB, alpha] = hexToRgbaFromShort(hexA);
      } else {
        return "0";
      }

      const [bgR, bgG, bgB] = hexToRgb(hex);

      const finalR = alpha * fgR + (1 - alpha) * bgR;
      const finalG = alpha * fgG + (1 - alpha) * bgG;
      const finalB = alpha * fgB + (1 - alpha) * bgB;

      const L1 = Math.max(
        relativeLuminance(finalR, finalG, finalB),
        relativeLuminance(bgR, bgG, bgB)
      );
      const L2 = Math.min(
        relativeLuminance(finalR, finalG, finalB),
        relativeLuminance(bgR, bgG, bgB)
      );

      const contrast = (L1 + 0.05) / (L2 + 0.05);

      return contrast.toString().slice(0, 5);
    } else {
      return "0";
    }
  }

  function contrastRatio(foreground: string, background: string): string {
    function hexToRgb(hex: string): number[] {
      hex = hex.replace(/^#/, "");

      if (hex.length === 3) {
        hex = hex
          .split("")
          .map((char) => char + char)
          .join("");
      }

      const bigint = parseInt(hex, 16);
      return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    }

    function luminance(rgb: number[]): number {
      const [r, g, b] = rgb.map((value) => {
        value /= 255;
        return value <= 0.03928
          ? value / 12.92
          : Math.pow((value + 0.055) / 1.055, 2.4);
      });
      return r * 0.2126 + g * 0.7152 + b * 0.0722;
    }

    if (
      (hexForeground.length === 4 || hexForeground.length === 7) &&
      (hexBackground.length === 4 || hexBackground.length === 7)
    ) {
      const rgb1 = hexToRgb(foreground);
      const rgb2 = hexToRgb(background);

      const lum1 = luminance(rgb1);
      const lum2 = luminance(rgb2);

      const ratio =
        (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);

      return ratio.toString().slice(0, 5);
    }

    return "0";
  }

  const ratio =
    fgType === "hex"
      ? parseFloat(contrastRatio(hexForeground, hexBackground))
      : parseFloat(contrastRatioHexA(hexaForeground, hexBackground));

  const standardAA = ratio >= 4.5;
  const largeAA = ratio >= 3;
  const standardAAA = ratio >= 7;
  const largeAAA = ratio >= 4.5;

  const openEyeDropper = (setColor: (color: string) => void) => {
    setIsButtonPressed(true);

    if (!("EyeDropper" in window)) {
      console.log("EyeDropper not supported");
      setIsButtonPressed(false);
      return;
    }

    eyeDropper
      .open()
      .then((colorSelectionResult: any) => {
        setColor(colorSelectionResult.sRGBHex);
        setIsButtonPressed(false);
      })
      .catch((error: any) => {
        console.error(error);
        setIsButtonPressed(false);
      });
  };

  const handleBlurHex = (
    e: any,
    setColor: (color: string) => void,
    defaultColor: string
  ) => {
    if (e.target.value.length < 3) {
      setColor(defaultColor);
    } else if (e.target.value.length > 3 && e.target.value.length < 6) {
      setColor(`#${e.target.value.slice(0, 3)}`);
    }
  };

  const handleBlurHexa = (
    e: any,
    setColor: (color: string) => void,
    defaultColor: string
  ) => {
    if (e.target.value.length < 4) {
      setColor(defaultColor);
    } else if (e.target.value.length > 4 && e.target.value.length < 8) {
      setColor(`#${e.target.value.slice(0, 4)}`);
    }
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId!, { action: "COLOR" }, (response) => {
        setTextColorArray(response.textColorArray);
        setBgColorArray(response.backgroundColorArray);
        setFontSizeArray(response.fontSizeArray);
        setFontFamilyArray(response.fontFamilyArray);

        const standardTextAA = response.colorPairsArray.filter(
          (colorPair: any) => {
            const contrastRatio = getContrastRatio(
              parseRGBA(colorPair.color),
              parseRGBA(colorPair.backgroundColor)
            );

            return contrastRatio < 4.5 && contrastRatio !== 1;
          }
        );

        const standardTextAAA = response.colorPairsArray.filter(
          (colorPair: any) => {
            const contrastRatio = getContrastRatio(
              parseRGBA(colorPair.color),
              parseRGBA(colorPair.backgroundColor)
            );

            return contrastRatio < 7 && contrastRatio !== 1;
          }
        );

        const largeTextAA = response.colorPairsArray.filter(
          (colorPair: any) => {
            const contrastRatio = getContrastRatio(
              parseRGBA(colorPair.color),
              parseRGBA(colorPair.backgroundColor)
            );

            const isLargeText =
              parseFloat(colorPair.fontSize) >= 24 ||
              (parseFloat(colorPair.fontSize) >= 18.5 &&
                colorPair.fontWeight >= 700);

            return contrastRatio < 3 && isLargeText && contrastRatio !== 1;
          }
        );

        const largeTextAAA = response.colorPairsArray.filter(
          (colorPair: any) => {
            const contrastRatio = getContrastRatio(
              parseRGBA(colorPair.color),
              parseRGBA(colorPair.backgroundColor)
            );

            const isLargeText =
              parseFloat(colorPair.fontSize) >= 24 ||
              (parseFloat(colorPair.fontSize) >= 18.5 &&
                colorPair.fontWeight >= 700);

            return contrastRatio < 4.5 && isLargeText && contrastRatio !== 1;
          }
        );

        setStdTextLevelAA(standardTextAA);
        setStdTextLevelAAA(standardTextAAA);
        setLargeTextLevelAA(largeTextAA);
        setLargeTextLevelAAA(largeTextAAA);
      });
    });
  }, []);

  const handleColorChange = (e: any, setColor: (color: string) => void) => {
    let value = e.target.value;
    if (value.startsWith("#")) {
      value = value.slice(1).substring(0, 6);
    }
    setColor(`#${value.toUpperCase()}`);
  };

  const displayStdText =
    selectedLevel === "AA" ? stdTextLevelAA : stdTextLevelAAA;
  const displayLargeText =
    selectedLevel === "AA" ? largeTextLevelAA : largeTextLevelAAA;

  return (
    <div className="flex flex-col gap-4 w-[452px] pr-4 pb-4">
      <div className="border-b border-neutral-200">
        <p className="text-base font-semibold text-neutral-900 pb-3">
          Color Contrast
        </p>
        <p className="text-sm text-neutral-700 pb-3">{instructions}</p>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-4 w-[50%]">
          <div className="flex flex-col gap-1">
            <p>Foreground</p>
            <button
              aria-hidden="true"
              onClick={() =>
                openEyeDropper(
                  fgType === "hex" ? setHexForeground : setHexaForeground
                )
              }
              className="flex items-center justify-center h-20 border border-neutral-200 rounded focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-4"
              aria-label="Foreground Color Picker"
              aria-pressed={isButtonPressed}
              style={{
                backgroundColor:
                  fgType === "hex" ? hexForeground : hexaForeground,
              }}
            >
              <ColorPickerIcon
                height={24}
                width={24}
                className="text-neutral-700"
              />
            </button>
          </div>
          <div>
            <Select
              isSearchable={false}
              defaultSelectedKey={"hex"}
              onSelectionChange={(e) => {
                setFgType(e.toString());
              }}
              className="w-[70px]"
              classNames={{
                popover: "font-poppins",
                trigger: "h-6 min-h-6",
                selectorIcon: "w-4 h-4 right-1",
              }}
            >
              {fgColorTypes.map((item) => (
                <SelectItem
                  key={item.value}
                  id={item.value}
                  textValue={item.value}
                >
                  {item.label}
                </SelectItem>
              ))}
            </Select>

            {fgType === "hex" && (
              <Input
                startContent={<span>#</span>}
                defaultValue="000000"
                aria-label="Foreground Color"
                value={hexForeground.slice(1).toUpperCase()}
                className="gap-0 border-neutral-200"
                maxLength={7}
                placeholder="Enter Foreground Color"
                onChange={(e) => handleColorChange(e, setHexForeground)}
                onBlur={(e) => handleBlurHex(e, setHexForeground, "#000000")}
              />
            )}

            {fgType === "hexa" && (
              <Input
                startContent={<span>#</span>}
                defaultValue="000000FF"
                aria-label="Foreground Color"
                value={hexaForeground.slice(1).toUpperCase()}
                className="gap-0 border-neutral-200"
                maxLength={9}
                placeholder="Enter Foreground Color"
                onChange={(e) => handleColorChange(e, setHexaForeground)}
                onBlur={(e) =>
                  handleBlurHexa(e, setHexaForeground, "#000000FF")
                }
              />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 w-[50%]">
          <div className="flex flex-col gap-1">
            <p>Background</p>
            <button
              aria-hidden="true"
              onClick={() => openEyeDropper(setHexBackground)}
              className="flex items-center justify-center h-20 border border-neutral-200 rounded focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-4"
              aria-label="Background Color Picker"
              aria-pressed={isButtonPressed}
              style={{
                backgroundColor: hexBackground,
              }}
            >
              <ColorPickerIcon
                height={24}
                width={24}
                className="text-neutral-700"
              />
            </button>
          </div>
          <div>
            <Select
              isSearchable={false}
              defaultSelectedKey={"hex"}
              onSelectionChange={(e) => setBgType(e.toString())}
              className="w-[70px]"
              classNames={{
                popover: "font-poppins",
                trigger: "h-6 min-h-6",
                selectorIcon: "w-4 h-4 right-1",
              }}
            >
              {bgColorTypes.map((item) => (
                <SelectItem
                  key={item.value}
                  id={item.value}
                  textValue={item.value}
                >
                  {item.label}
                </SelectItem>
              ))}
            </Select>

            {bgType === "hex" && (
              <Input
                startContent={<span>#</span>}
                defaultValue="FFFFFF"
                aria-label="Background Color"
                value={hexBackground.slice(1).toUpperCase()}
                className="gap-0 border-neutral-200"
                maxLength={7}
                placeholder="Enter Background Color"
                onChange={(e) => handleColorChange(e, setHexBackground)}
                onBlur={(e) => handleBlurHex(e, setHexBackground, "#FFFFFF")}
              />
            )}
          </div>
        </div>
      </div>
      <p
        className="flex items-center justify-center h-8 my-1 text-base font-semibold border border-neutral-200 rounded"
        style={{
          color: fgType === "hex" ? hexForeground : hexaForeground,
          backgroundColor: hexBackground,
        }}
      >
        This is a sample text
      </p>
      <div className="flex gap-5">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm">Color Contrast</p>
          <div
            className={`w-[90px] h-[90px] flex flex-col justify-center items-center rounded-md
                  ${
                    ratio >= 7
                      ? "text-green-950 bg-green-100"
                      : ratio < 3
                      ? "text-red-950 bg-red-50"
                      : "text-neutral-950 bg-neutral-200"
                  }
                } `}
          >
            <p className="text-xl font-semibold">
              {ratio !== 0 ? `${ratio.toString().slice(0, 4)} : 1` : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 text-sm pl-5 border-l border-neutral-200">
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex justify-between w-[90px] pl-2 pr-1.5 py-1 rounded ${
                  standardAA
                    ? "text-green-950 bg-green-100"
                    : "text-red-950 bg-red-50"
                } `}
              >
                <p className="font-medium">
                  {standardAA ? "AA Pass" : "AA Fail"}
                </p>
                {standardAA ? passIcon : failIcon}
              </div>
              <p className="text-neutral-950">Standard Text</p>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex justify-between w-[90px] pl-2 pr-1.5 py-1 rounded ${
                  largeAA
                    ? "text-green-950 bg-green-100"
                    : "text-red-950 bg-red-50"
                } `}
              >
                <p className="font-medium">{largeAA ? "AA Pass" : "AA Fail"}</p>
                {largeAA ? passIcon : failIcon}
              </div>
              <p className="text-neutral-950">Large Text</p>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex justify-between w-[90px] pl-2 pr-1.5 py-1 rounded ${
                  largeAA
                    ? "text-green-950 bg-green-100"
                    : "text-red-950 bg-red-50"
                } `}
              >
                <p className="font-medium">{largeAA ? "AA Pass" : "AA Fail"}</p>
                {largeAA ? passIcon : failIcon}
              </div>
              <p className="text-neutral-950">Non-Text</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex justify-between w-[90px] pl-2 pr-1.5 py-1 rounded ${
                  standardAAA
                    ? "text-green-950 bg-green-100"
                    : "text-red-950 bg-red-50"
                } `}
              >
                <p className="font-medium">
                  {standardAAA ? "AAA Pass" : "AAA Fail"}
                </p>
                {standardAAA ? passIcon : failIcon}
              </div>
              <p className="text-neutral-950">Standard Text</p>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex justify-between w-[90px] pl-2 pr-1.5 py-1 rounded ${
                  largeAAA
                    ? "text-green-950 bg-green-100"
                    : "text-red-950 bg-red-50"
                } `}
              >
                <p className="font-medium">
                  {largeAAA ? "AAA Pass" : "AAA Fail"}
                </p>
                {largeAAA ? passIcon : failIcon}
              </div>
              <p className="text-neutral-950">Large Text</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-4 border-t border-neutral-200">
        <p className="text-base text-neutral-900 font-semibold">
          Color Palette
        </p>
        {bgColorArray.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-neutral-950">
              Background Colors : {bgColorArray.length}
            </p>
            <div className="grid grid-cols-4 gap-3" role="list">
              {bgColorArray.map((bgColor) => (
                <div
                  className="flex flex-col w-[100px] h-[90px] gap-[2px] items-center border border-neutral-200 rounded-md"
                  role="listitem"
                >
                  <div
                    className="h-[60px] w-full rounded rounded-b-none"
                    style={{
                      backgroundColor: bgColor,
                      border: `1px solid ${bgColor}`,
                      borderBottom: `1px solid #e5e7eb`,
                    }}
                  ></div>
                  <p className="text-sm text-neutral-950 p-1">
                    {checkForOpacity(bgColor).toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {textColorArray.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            <p className="text-sm text-neutral-950">
              Text Colors : {textColorArray.length}
            </p>
            <div className="grid grid-cols-4 gap-3" role="list">
              {textColorArray.map((textColor) => (
                <div
                  className="flex flex-col w-[100px] h-[90px] gap-[2px] items-center border border-neutral-200 rounded-md"
                  role="listitem"
                >
                  <div
                    className="h-[60px] w-full rounded rounded-b-none"
                    style={{
                      backgroundColor: textColor,
                      border: `1px solid ${textColor}`,
                      borderBottom: `1px solid #e5e7eb`,
                    }}
                  ></div>
                  <p className="text-sm text-neutral-950 p-1">
                    {checkForOpacity(textColor).toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {apiKey && (
        <>
          {!isIssueVisible ? (
            <div className="flex items-center justify-center w-full">
              <div className="w-full h-[1px] bg-neutral-200"></div>
              <Button
                appearance="primary"
                onPress={handleContrastBtnClick}
                className="w-fit mx-4"
              >
                Check Contrast Issues
              </Button>
              <div className="w-full h-[1px] bg-neutral-200"></div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 py-4 border-y border-neutral-200">
              <div className="flex justify-between items-center">
                <p className="text-base text-neutral-900 font-semibold">
                  {`Contrast Issues : ${
                    displayStdText.length + displayLargeText.length
                  }`}
                </p>
                <Select
                  isSearchable={false}
                  defaultSelectedKey={"AA"}
                  onSelectionChange={(e) => setSelectedLevel(e.toString())}
                  className="w-[110px]"
                  classNames={{ popover: "font-poppins" }}
                >
                  {levelsData.map((item) => (
                    <SelectItem
                      key={item.value}
                      id={item.value}
                      textValue={item.value}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {displayStdText.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-neutral-950">
                    Standard Text : {displayStdText.length} Issues
                  </p>
                  <div className="grid grid-cols-3 gap-4" role="list">
                    {displayStdText.map(
                      (colorPair: {
                        color: string;
                        backgroundColor: string;
                        fontSize: string;
                        fontWeight: number;
                      }) => (
                        <>
                          <div
                            className="flex flex-col gap-2 p-2 items-center border rounded-lg"
                            role="listitem"
                          >
                            <div
                              className="flex items-center justify-center h-10 w-[100px] my-2 text-sm rounded border border-neutral-200"
                              style={{
                                backgroundColor: colorPair.backgroundColor,
                                color: colorPair.color,
                                fontWeight: colorPair.fontWeight,
                                fontSize: colorPair.fontSize,
                              }}
                            >
                              Text
                            </div>
                            <div className="flex flex-col gap-1 w-[90px]">
                              <div className="flex justify-between">
                                <p>FG</p>
                                <p>
                                  {checkForOpacity(
                                    colorPair.color
                                  ).toUpperCase()}
                                </p>
                              </div>
                              <div className="flex justify-between pb-2 mb-1 border-b border-neutral-200">
                                <p>BG</p>
                                <p>
                                  {checkForOpacity(
                                    colorPair.backgroundColor
                                  ).toUpperCase()}
                                </p>
                              </div>
                              {selectedLevel === "AA" ? (
                                <div className="flex justify-between">
                                  <p>AA</p>
                                  {getContrastRatio(
                                    parseRGBA(colorPair.color),
                                    parseRGBA(colorPair.backgroundColor)
                                  ) >= 4.5 ? (
                                    <p>
                                      <CheckIcon
                                        height={16}
                                        width={16}
                                        className="text-green-800"
                                      />
                                    </p>
                                  ) : (
                                    <p>
                                      <CloseIcon
                                        height={16}
                                        width={16}
                                        className="text-red-800"
                                      />
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <div className="flex justify-between">
                                  <p>AAA</p>
                                  <p>
                                    <CloseIcon
                                      height={16}
                                      width={16}
                                      className="text-red-800"
                                    />
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )
                    )}
                  </div>
                </div>
              )}

              {displayLargeText.length > 0 && (
                <div className="flex flex-col gap-2 my-2">
                  <p className="text-sm text-neutral-950">
                    Large Text : {displayLargeText.length} Issues
                  </p>
                  <div className="grid grid-cols-3 gap-4" role="list">
                    {displayLargeText.map(
                      (colorPair: {
                        color: string;
                        backgroundColor: string;
                        fontSize: string;
                        fontWeight: number;
                      }) => (
                        <>
                          <div
                            className="flex flex-col gap-2 p-2 items-center border rounded-lg"
                            role="listitem"
                          >
                            <div
                              className="flex items-center justify-center h-10 w-[100px] my-2 text-sm rounded border border-neutral-200"
                              style={{
                                backgroundColor: colorPair.backgroundColor,
                                color: colorPair.color,
                                fontWeight: colorPair.fontWeight,
                                fontSize: colorPair.fontSize,
                              }}
                            >
                              Text
                            </div>
                            <div className="flex flex-col gap-1 w-[90px]">
                              <div className="flex justify-between">
                                <p>FG</p>
                                <p>
                                  {checkForOpacity(
                                    colorPair.color
                                  ).toUpperCase()}
                                </p>
                              </div>
                              <div className="flex justify-between pb-2 border-b border-neutral-200">
                                <p>BG</p>
                                <p>
                                  {checkForOpacity(
                                    colorPair.backgroundColor
                                  ).toUpperCase()}
                                </p>
                              </div>
                              {selectedLevel === "AA" ? (
                                <div className="flex justify-between">
                                  <p>AA</p>
                                  {getContrastRatio(
                                    parseRGBA(colorPair.color),
                                    parseRGBA(colorPair.backgroundColor)
                                  ) >= 3 &&
                                  (parseFloat(colorPair.fontSize) >= 24 ||
                                    (parseFloat(colorPair.fontSize) >= 18.5 &&
                                      colorPair.fontWeight >= 700)) ? (
                                    <p>
                                      <CheckIcon
                                        height={16}
                                        width={16}
                                        className="text-green-800"
                                      />
                                    </p>
                                  ) : (
                                    <p>
                                      <CloseIcon
                                        height={16}
                                        width={16}
                                        className="text-red-800"
                                      />
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <div className="flex justify-between">
                                  <p>AAA</p>
                                  <p>
                                    <CloseIcon
                                      height={16}
                                      width={16}
                                      className="text-red-800"
                                    />
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {fontSizeArray.length > 0 && (
        <div className="flex flex-col gap-4">
          <p className="text-base text-neutral-900 font-semibold">Font Size</p>
          <div className="grid grid-cols-5 gap-4" role="list">
            {fontSizeArray.map((fontSize) => (
              <div
                className="text-sm text-neutral-950 border border-neutral-200 rounded text-center py-1"
                role="listitem"
              >
                {fontSize}
              </div>
            ))}
          </div>
        </div>
      )}

      {fontFamilyArray.length > 0 && (
        <div className="flex flex-col gap-4 pt-4 border-t border-neutral-200">
          <p className="text-base text-neutral-900 font-semibold">
            Font Family
          </p>
          <div className="flex flex-wrap gap-4" role="list">
            {fontFamilyArray.map((fontFamily) => (
              <span
                className="w-fit text-sm text-neutral-950 border border-neutral-200 rounded text-center px-2 py-1"
                role="listitem"
              >
                {fontFamily}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorContrast;
