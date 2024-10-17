/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { Button, Input, Select, SelectItem } from "@trail-ui/react";
import { CheckIcon, CloseIcon, ColorPickerIcon } from "@trail-ui/icons";
import {
  arrayToRgbString,
  calculateLuminance,
  checkForOpacity,
  getContrastRatio,
  hexToRgb,
  parseRGBA,
} from "./utils";

interface EyeDropper {
  open(): Promise<{ sRGBHex: string }>;
}

declare const EyeDropper: {
  prototype: EyeDropper;
  new (): EyeDropper;
};

const ColorContrast = () => {
  const instructions =
    "According to WCAG, contrast ratios should be at least 4.5 : 1 for normal text and 3 : 1 for large text. Check your color contrast below.";

  const eyeDropper = new EyeDropper();

  const passIcon = <CheckIcon height={18} width={18} />;
  const failIcon = <CloseIcon height={18} width={18} />;

  const [hexForeground, setHexForeground] = useState("#000000");
  const [hexaForeground, setHexaForeground] = useState("#000000FF");
  const [hexBackground, setHexBackground] = useState("#FFFFFF");
  const [rgbForeground, setRgbForeground] = useState("rgb(0, 0, 0)");
  const [rgbaForeground, setRgbaForeground] = useState("rgb(0, 0, 0, 1)");
  const [rgbBackground, setRgbBackground] = useState("rgb(255, 255, 255)");

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
  const [selectedFG, setSelectedFG] = useState("#000000");
  const [selectedBG, setSelectedBG] = useState("#FFFFFF");
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
    { label: "RGB", value: "rgb" },
    { label: "RGBa", value: "rgba" },
  ];

  const bgColorTypes = [
    { label: "HEX", value: "hex" },
    { label: "RGB", value: "rgb" },
  ];

  const getContrastIssue = useCallback(() => {
    setIsIssueVisible(false);
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
          setIsIssueVisible(false);
          alert("Please enter your Auth Token in the Auth Token dialog");
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });

    setIsIssueVisible(!isIssueVisible);
  }, [apiKey, isIssueVisible]);

  const handleContrastBtnClick = () => {
    getContrastIssue();
  };

  const ratio = parseFloat(allContrastRatio(selectedFG, selectedBG));

  const standardAA = ratio >= 4.5;
  const largeAA = ratio >= 3;
  const standardAAA = ratio >= 7;
  const largeAAA = ratio >= 4.5;

  const openFgEyeDropper = (setColor: (color: string) => void) => {
    setIsButtonPressed(true);

    if (!("EyeDropper" in window)) {
      console.log("EyeDropper not supported");
      setIsButtonPressed(false);
      return;
    }

    eyeDropper
      .open()
      .then((colorSelectionResult: any) => {
        if (fgType === "hex") {
          setSelectedFG(colorSelectionResult.sRGBHex);
          setColor(colorSelectionResult.sRGBHex);
        } else if (fgType === "hexa") {
          setSelectedFG(colorSelectionResult.sRGBHex + "FF");
          setColor(colorSelectionResult.sRGBHex + "FF");
        } else if (fgType === "rgb") {
          setSelectedFG(
            arrayToRgbString(hexToRgb(colorSelectionResult.sRGBHex))
          );
          setColor(arrayToRgbString(hexToRgb(colorSelectionResult.sRGBHex)));
        } else if (fgType === "rgba") {
          setSelectedFG(
            arrayToRgbString(hexToRgb(colorSelectionResult.sRGBHex)).slice(
              0,
              -1
            ) + ", 1)"
          );
          setColor(
            arrayToRgbString(hexToRgb(colorSelectionResult.sRGBHex)).slice(
              0,
              -1
            ) + ", 1)"
          );
        }

        setIsButtonPressed(false);
      })
      .catch((error: any) => {
        console.error(error);
        setIsButtonPressed(false);
      });
  };

  const openBgEyeDropper = (setColor: (color: string) => void) => {
    setIsButtonPressed(true);

    if (!("EyeDropper" in window)) {
      console.log("EyeDropper not supported");
      setIsButtonPressed(false);
      return;
    }

    eyeDropper
      .open()
      .then((colorSelectionResult: any) => {
        if (bgType === "hex") {
          setSelectedBG(colorSelectionResult.sRGBHex);
          setColor(colorSelectionResult.sRGBHex);
        } else if (bgType === "rgb") {
          setSelectedBG(
            arrayToRgbString(hexToRgb(colorSelectionResult.sRGBHex))
          );
          setColor(arrayToRgbString(hexToRgb(colorSelectionResult.sRGBHex)));
        }
        setIsButtonPressed(false);
      })
      .catch((error: any) => {
        console.error(error);
        setIsButtonPressed(false);
      });
  };

  function hexToRgba(hex: string, alpha: number = 1): string {
    hex = hex.replace(/^#/, "");
    let r: number, g: number, b: number;

    if (hex.length === 8 && fgType === "hexa") {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
      alpha = parseInt(hex.slice(6, 8), 16) / 255;
    } else if (hex.length === 6 && (fgType === "hex" || bgType === "hex")) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    } else if (hex.length === 4 && fgType === "hexa") {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
      alpha = parseInt(hex[3], 16) / 15;
    } else if (hex.length === 3 && (fgType === "hex" || bgType === "hex")) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else {
      return "0";
    }

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function rgbToRgba(color: string): string {
    const match = color.match(
      /rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\s*\)/
    );

    if (!match) {
      return "0";
    }

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    const alpha = match[4] ? parseFloat(match[4]) : 1;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function allContrastRatio(color1: string, color2: string): string {
    let rgbaColor1 = "";
    let rgbaColor2 = "";

    if (fgType === "hex" || fgType === "hexa") {
      rgbaColor1 = hexToRgba(color1);
    } else if (fgType === "rgb" || fgType === "rgba") {
      rgbaColor1 = rgbToRgba(color1);
    }

    if (bgType === "hex") {
      rgbaColor2 = hexToRgba(color2);
    } else if (bgType === "rgb") {
      rgbaColor2 = rgbToRgba(color2);
    }

    const [r1, g1, b1, alpha] = rgbaColor1
      .match(/\d+(\.\d+)?/g)!
      .map((value, index) => {
        return index < 3 ? Number(value) : parseFloat(value);
      });

    const [r2, g2, b2] = rgbaColor2.match(/\d+/g)!.map(Number).slice(0, 3);

    const finalR = alpha * r1 + (1 - alpha) * r2;
    const finalG = alpha * g1 + (1 - alpha) * g2;
    const finalB = alpha * b1 + (1 - alpha) * b2;

    const L1 = calculateLuminance(finalR, finalG, finalB);
    const L2 = calculateLuminance(r2, g2, b2);

    const lighterLuminance = Math.max(L1, L2);
    const darkerLuminance = Math.min(L1, L2);

    const ratio = (lighterLuminance + 0.05) / (darkerLuminance + 0.05);

    return ratio.toString().slice(0, 5);
  }

  const handleBlurHex = (e: any, setColor: (color: string) => void) => {
    if (e.target.value.length > 3 && e.target.value.length < 6) {
      setColor(`#${e.target.value.slice(0, 3)}`);
    }
  };

  const handleBlurHexa = (e: any, setColor: (color: string) => void) => {
    if (e.target.value.length > 4 && e.target.value.length < 8) {
      setColor(`#${e.target.value.slice(0, 4)}`);
    }
  };

  function selectFgColorType(colorType: string) {
    switch (colorType) {
      case "hex":
        return hexForeground;
      case "hexa":
        return hexaForeground;
      case "rgb":
        return rgbForeground;
      case "rgba":
        return rgbaForeground;
    }
  }

  function selectBgColorType(colorType: string) {
    switch (colorType) {
      case "hex":
        return hexBackground;
      case "rgb":
        return rgbBackground;
    }
  }

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

  const handleFgColorChange = (e: any, setColor: (color: string) => void) => {
    let value = e.target.value;
    setSelectedFG(value);

    if (fgType === "hex" || fgType === "hexa") {
      if (value.startsWith("#")) {
        value = value.slice(1).substring(0, 6);
      }
      setColor(`#${value.toUpperCase()}`);
    } else if (fgType === "rgb" || fgType === "rgba") {
      setColor(value);
    }
  };

  const handleBgColorChange = (e: any, setColor: (color: string) => void) => {
    let value = e.target.value;
    setSelectedBG(value);

    if (bgType === "hex") {
      if (value.startsWith("#")) {
        value = value.slice(1).substring(0, 6);
      }
      setColor(`#${value.toUpperCase()}`);
    } else {
      setColor(value);
    }
  };

  const displayStdText =
    selectedLevel === "AA" ? stdTextLevelAA : stdTextLevelAAA;
  const displayLargeText =
    selectedLevel === "AA" ? largeTextLevelAA : largeTextLevelAAA;

  return (
    <div className="flex flex-col gap-4 w-[452px] pr-4 pb-4">
      <div className="border-b border-neutral-200">
        <p
          role="heading"
          aria-level={2}
          className="text-base font-semibold text-neutral-900 pb-3"
        >
          Color Contrast
        </p>
        <p className="text-sm text-neutral-700 pb-3">{instructions}</p>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-4 w-[50%]">
          <div className="flex flex-col gap-1">
            <p>Foreground (FG)</p>
            <button
              aria-hidden="true"
              onClick={() =>
                openFgEyeDropper(
                  fgType === "hex"
                    ? setHexForeground
                    : fgType === "hexa"
                    ? setHexaForeground
                    : fgType === "rgb"
                    ? setRgbForeground
                    : setRgbaForeground
                )
              }
              className="flex items-center justify-center h-20 border border-neutral-200 rounded focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-4"
              aria-label="Foreground Color Picker"
              aria-pressed={isButtonPressed}
              style={{
                backgroundColor: selectFgColorType(fgType),
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
              label="FG Color Format"
              isSearchable={false}
              defaultSelectedKey={"hex"}
              onSelectionChange={(e) => {
                setFgType(e.toString());
              }}
              className="flex flex-row justify-between items-center mb-2"
              classNames={{
                label: "text-sm font-normal pb-0",
                popover: "font-poppins",
                trigger: "w-[65px] h-6 min-h-6",
                mainWrapper: "w-[unset]",
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
                defaultValue="#000000"
                aria-label="Foreground Color"
                value={hexForeground.slice(1).toUpperCase()}
                className="gap-0 border-neutral-200"
                placeholder="Enter Foreground Color"
                onChange={(e) => handleFgColorChange(e, setHexForeground)}
                onBlur={(e) => handleBlurHex(e, setHexForeground)}
              />
            )}

            {fgType === "hexa" && (
              <Input
                startContent={<span>#</span>}
                defaultValue="#000000FF"
                aria-label="Foreground Color"
                value={hexaForeground.slice(1).toUpperCase()}
                className="gap-0 border-neutral-200"
                placeholder="Enter Foreground Color"
                onChange={(e) => handleFgColorChange(e, setHexaForeground)}
                onBlur={(e) => handleBlurHexa(e, setHexaForeground)}
              />
            )}

            {fgType === "rgb" && (
              <Input
                defaultValue="rgb(0, 0, 0)"
                aria-label="Foreground Color"
                value={rgbForeground}
                className="gap-0 border-neutral-200"
                placeholder="Enter Foreground Color"
                onChange={(e) => handleFgColorChange(e, setRgbForeground)}
              />
            )}

            {fgType === "rgba" && (
              <Input
                defaultValue="rgb(0, 0, 0, 1)"
                aria-label="Foreground Color"
                value={rgbaForeground}
                className="gap-0 border-neutral-200"
                placeholder="Enter Foreground Color"
                onChange={(e) => handleFgColorChange(e, setRgbaForeground)}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 w-[50%]">
          <div className="flex flex-col gap-1">
            <p>Background (BG)</p>
            <button
              aria-hidden="true"
              onClick={() => {
                openBgEyeDropper(
                  bgType === "hex" ? setHexBackground : setRgbBackground
                );
              }}
              className="flex items-center justify-center h-20 border border-neutral-200 rounded focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-4"
              aria-label="Background Color Picker"
              aria-pressed={isButtonPressed}
              style={{
                backgroundColor: selectBgColorType(bgType),
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
              label="BG Color Format"
              isSearchable={false}
              defaultSelectedKey={"hex"}
              onSelectionChange={(e) => {
                setBgType(e.toString());
              }}
              className="flex flex-row justify-between items-center mb-2"
              classNames={{
                label: "text-sm font-normal pb-0",
                popover: "font-poppins",
                trigger: "w-[65px] h-6 min-h-6",
                mainWrapper: "w-[unset]",
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
                defaultValue="#FFFFFF"
                aria-label="Background Color"
                value={hexBackground.slice(1).toUpperCase()}
                className="gap-0 border-neutral-200"
                placeholder="Enter Background Color"
                onChange={(e) => handleBgColorChange(e, setHexBackground)}
                onBlur={(e) => handleBlurHex(e, setHexBackground)}
              />
            )}

            {bgType === "rgb" && (
              <Input
                defaultValue="rgb(255, 255, 255)"
                aria-label="Background Color"
                value={rgbBackground}
                className="gap-0 border-neutral-200"
                placeholder="Enter Background Color"
                onChange={(e) => handleBgColorChange(e, setRgbBackground)}
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p role="heading" aria-level={3} className="text-sm text-neutral-950">
          Preview
        </p>
        <p
          className="flex items-center justify-center h-10 mb-1 text-base font-semibold border border-dashed border-neutral-200 rounded"
          style={{
            color: selectFgColorType(fgType),
            backgroundColor: selectBgColorType(bgType),
          }}
        >
          The quick brown fox jumps over the lazy dog.
        </p>
      </div>
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
              {ratio !== 0 && ratio!
                ? `${ratio.toString().slice(0, 4)} : 1`
                : ""}
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
        <p
          role="heading"
          aria-level={2}
          className="text-base text-neutral-900 font-semibold"
        >
          Color Palette
        </p>
        {bgColorArray.length > 0 && (
          <div className="flex flex-col gap-2">
            <p
              role="heading"
              aria-level={3}
              className="text-sm text-neutral-950"
            >
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
            <p
              role="heading"
              aria-level={3}
              className="text-sm text-neutral-950"
            >
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

      {(apiKey || apiKey === "") && (
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
                <p
                  role="heading"
                  aria-level={2}
                  className="text-base text-neutral-900 font-semibold"
                >
                  {`Contrast Issues : ${
                    displayStdText.length + displayLargeText.length
                  }`}
                </p>
                <div className="flex items-center gap-2">
                  <Select
                    label="Conformance"
                    isSearchable={false}
                    defaultSelectedKey={"AA"}
                    onSelectionChange={(e) => setSelectedLevel(e.toString())}
                    className="flex flex-row items-center gap-2"
                    classNames={{
                      label: "text-sm font-normal pb-0",
                      popover: "font-poppins",
                      trigger: "w-[108px] h-8 min-h-8",
                      mainWrapper: "w-[unset]",
                    }}
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
              </div>

              <div className="flex flex-col gap-2">
                <p
                  role="heading"
                  aria-level={3}
                  className="text-sm text-neutral-950"
                >
                  {`Standard Text : ${displayStdText.length} ${
                    displayStdText.length === 1 ? "Issue" : "Issues"
                  }`}
                </p>
                {displayStdText.length > 0 ? (
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
                ) : (
                  <p className="flex justify-center text-sm rounded border border-neutral-200 p-2">
                    Great news! No color contrast issues were found for Standard
                    Text.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 my-2">
                <p
                  role="heading"
                  aria-level={3}
                  className="text-sm text-neutral-950"
                >
                  {`Large Text : ${displayLargeText.length} ${
                    displayLargeText.length === 1 ? "Issue" : "Issues"
                  }`}
                </p>
                {displayLargeText.length > 0 ? (
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
                ) : (
                  <p className="flex justify-center text-sm rounded border border-neutral-200 p-2">
                    Great news! No color contrast issues were found for Large
                    Text.
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {fontSizeArray.length > 0 && (
        <div className="flex flex-col gap-4">
          <p
            role="heading"
            aria-level={2}
            className="text-base text-neutral-900 font-semibold"
          >
            Font Size
          </p>
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
          <p
            role="heading"
            aria-level={2}
            className="text-base text-neutral-900 font-semibold"
          >
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
