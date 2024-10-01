/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckIcon, CloseIcon, ColorPickerIcon } from "@trail-ui/icons";
import { Input } from "@trail-ui/react";
import { useEffect, useState } from "react";
import { rgbaToHex } from "./utils";

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

  const passIcon = <CheckIcon height={18} width={18} />;
  const failIcon = <CloseIcon height={18} width={18} />;

  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#FFFFFF");
  const [textColorArray, setTextColorArray] = useState([]);
  const [bgColorArray, setBgColorArray] = useState([]);
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const eyeDropper = new EyeDropper();

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    hex = hex.replace(/^#/, "");

    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((h) => h + h)
        .join("");
    }

    const bigint = parseInt(hex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  const getLuminance = (r: number, g: number, b: number): number => {
    const normalize = (value: number) => {
      const sRGB = value / 255;
      return sRGB <= 0.03928
        ? sRGB / 12.92
        : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    };

    const luminance =
      0.2126 * normalize(r) + 0.7152 * normalize(g) + 0.0722 * normalize(b);
    return luminance;
  };

  const contrastRatio = (hex1: string, hex2: string): number => {
    if (
      (foreground.length === 4 || foreground.length === 7) &&
      (background.length === 4 || background.length === 7)
    ) {
      const rgb1 = hexToRgb(hex1);
      const rgb2 = hexToRgb(hex2);

      const luminance1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
      const luminance2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

      const L1 = Math.max(luminance1, luminance2);
      const L2 = Math.min(luminance1, luminance2);

      return (L1 + 0.05) / (L2 + 0.05);
    }
    return 0;
  };

  const ratio = contrastRatio(foreground, background);
  const normalAA = ratio >= 4.5;
  const largeAA = ratio >= 3;
  const normalAAA = ratio >= 7;
  const largeAAA = ratio >= 4.5;

  const checkFgColor = () => {
    setIsButtonPressed(true);

    if (!("EyeDropper" in window)) {
      console.log("EyeDropper not supported");
      return;
    }

    eyeDropper
      .open()
      .then((colorSelectionResult: any) => {
        setForeground(colorSelectionResult.sRGBHex);
        setIsButtonPressed(false);
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  const checkBgColor = () => {
    setIsButtonPressed(true);

    if (!("EyeDropper" in window)) {
      console.log("EyeDropper not supported");
      return;
    }

    eyeDropper
      .open()
      .then((colorSelectionResult: any) => {
        setBackground(colorSelectionResult.sRGBHex);
        setIsButtonPressed(false);
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  const handleForegroundBlur = (e: any) => {
    if (e.target.value.length < 3) {
      setForeground("#000000");
    } else if (e.target.value.length > 3 && e.target.value.length < 6) {
      setForeground(`#${e.target.value.slice(0, 3)}`);
    }
  };

  const handleBackgroundBlur = (e: any) => {
    if (e.target.value.length < 3) {
      setBackground("#FFFFFF");
    } else if (e.target.value.length > 3 && e.target.value.length < 6) {
      setBackground(`#${e.target.value.slice(0, 3)}`);
    }
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId!, { action: "COLOR" }, (response) => {
        setTextColorArray(response.textColorArray);
        setBgColorArray(response.backgroundColorArray);
      });
    });
  }, []);

  const checkForOpacity = (color: string) => {
    let hexColor = rgbaToHex(color);
    if (hexColor.endsWith("ff")) {
      hexColor = hexColor.slice(0, -2);
    }
    return hexColor;
  };

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
              onClick={checkFgColor}
              className="flex items-center justify-center h-20 border border-neutral-200 rounded focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-4"
              aria-label="Foreground Color Picker"
              aria-pressed={isButtonPressed}
              style={{
                backgroundColor: foreground,
              }}
            >
              <ColorPickerIcon
                height={24}
                width={24}
                className="text-neutral-700"
              />
            </button>
          </div>
          <Input
            startContent={<span>#</span>}
            defaultValue="000000"
            aria-label="Foreground Color"
            value={foreground.slice(1).toUpperCase()}
            className="gap-0 border-neutral-200"
            maxLength={6}
            placeholder="Enter Foreground Color"
            onChange={(e) => {
              setForeground(`#${e.target.value}`);
              e.target.value.toUpperCase();
            }}
            onBlur={(e) => handleForegroundBlur(e)}
          />
        </div>
        <div className="flex flex-col gap-4 w-[50%]">
          <div className="flex flex-col gap-1">
            <p>Background</p>
            <button
              aria-hidden="true"
              onClick={checkBgColor}
              className="flex items-center justify-center h-20 border border-neutral-200 rounded focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-4"
              aria-label="Background Color Picker"
              aria-pressed={isButtonPressed}
              style={{
                backgroundColor: background,
              }}
            >
              <ColorPickerIcon
                height={24}
                width={24}
                className="text-neutral-700"
              />
            </button>
          </div>
          <Input
            startContent={<span>#</span>}
            defaultValue="FFFFFF"
            aria-label="Background Color"
            value={background.slice(1).toUpperCase()}
            className="gap-0 border-neutral-200"
            maxLength={6}
            placeholder="Enter Background Color"
            onChange={(e) => {
              setBackground(`#${e.target.value}`);
              e.target.value.toUpperCase();
            }}
            onBlur={(e) => handleBackgroundBlur(e)}
          />
        </div>
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
              {ratio !== 0 ? `${ratio.toFixed(2)} : 1` : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 text-sm pl-5 border-l border-neutral-200">
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex justify-between w-[90px] pl-2 pr-1.5 py-1 rounded ${
                  normalAA
                    ? "text-green-950 bg-green-100"
                    : "text-red-950 bg-red-50"
                } `}
              >
                <p className="font-medium">
                  {normalAA ? "AA Pass" : "AA Fail"}
                </p>
                {normalAA ? passIcon : failIcon}
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
                  normalAAA
                    ? "text-green-950 bg-green-100"
                    : "text-red-950 bg-red-50"
                } `}
              >
                <p className="font-medium">
                  {normalAAA ? "AAA Pass" : "AAA Fail"}
                </p>
                {normalAAA ? passIcon : failIcon}
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
        <p className="text-base text-neutral-900 font-semibold">Colors</p>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-neutral-950">
            Background Colors : {bgColorArray.length}
          </p>
          <div className="grid grid-cols-6 gap-x-3 gap-y-2">
            {bgColorArray.map((bgColor) => (
              <div className="flex flex-col gap-[2px] items-center">
                <div
                  className="h-6 w-16 rounded border border-neutral-200"
                  style={{ backgroundColor: bgColor }}
                ></div>
                <p className="text-sm text-neutral-950">
                  {checkForOpacity(bgColor).toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-4 border-t border-neutral-200">
          <p className="text-sm text-neutral-950">
            Text Colors : {textColorArray.length}
          </p>
          <div className="grid grid-cols-6 gap-x-3 gap-y-2">
            {textColorArray.map((textColor) => (
              <div className="flex flex-col gap-[2px] items-center">
                <div
                  className="h-6 w-16 rounded border border-neutral-200"
                  style={{ backgroundColor: textColor }}
                ></div>
                <p className="text-sm text-neutral-950">
                  {checkForOpacity(textColor).toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorContrast;
