/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckIcon, CloseIcon } from "@trail-ui/icons";
import { Button, Input } from "@trail-ui/react";
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
    if (!("EyeDropper" in window)) {
      console.log("EyeDropper not supported");
      return;
    }

    eyeDropper
      .open()
      .then((colorSelectionResult: any) => {
        setForeground(colorSelectionResult.sRGBHex);
        console.log(colorSelectionResult.sRGBHex);
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  const checkBgColor = () => {
    if (!("EyeDropper" in window)) {
      console.log("EyeDropper not supported");
      return;
    }

    eyeDropper
      .open()
      .then((colorSelectionResult: any) => {
        setBackground(colorSelectionResult.sRGBHex);
        console.log(colorSelectionResult.sRGBHex);
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
            <Button
              onPress={checkFgColor}
              appearance="transparent"
              className="h-20 border border-neutral-200"
              style={{
                backgroundColor: foreground,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="#302e38"
              >
                <rect width="24" height="24" rx="12" />
                <g clipPath="url(#clip0_1352_10012)">
                  <path
                    d="M14.357 5.87163C15.3984 4.83023 17.0869 4.83023 18.1283 5.87163C19.1697 6.91302 19.1697 8.60146 18.1283 9.64286L16.2425 11.5286L16.4783 11.7644C16.7387 12.0247 16.7387 12.4469 16.4783 12.7072C16.218 12.9675 15.7959 12.9675 15.5355 12.7072L15.2999 12.4715L11.1567 16.6147C10.7845 16.9869 10.3103 17.2407 9.79406 17.3439L8.62462 17.5778C8.3665 17.6295 8.12944 17.7563 7.9433 17.9425L7.28596 18.5998C7.0256 18.8601 6.6035 18.8601 6.34314 18.5998L5.40034 17.657C5.13999 17.3967 5.13999 16.9745 5.40034 16.7142L6.05768 16.0568C6.24382 15.8707 6.3707 15.6336 6.42232 15.3755L6.6562 14.2061C6.75946 13.6898 7.0132 13.2157 7.38547 12.8434L11.5286 8.7003L11.2929 8.46457C11.0325 8.20423 11.0325 7.78211 11.2929 7.52177C11.5533 7.26141 11.9753 7.26141 12.2357 7.52177L12.4713 7.75736L14.357 5.87163ZM12.4714 9.64311L8.32828 13.7863C8.14214 13.9724 8.01527 14.2095 7.96365 14.4675L7.72976 15.637C7.62651 16.1533 7.37276 16.6274 7.0005 16.9997C7.37276 16.6274 7.8469 16.3736 8.36314 16.2704L9.53258 16.0365C9.7907 15.9849 10.0278 15.858 10.2139 15.6719L14.357 11.5287L12.4714 9.64311Z"
                    fill="#FEFEFE"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1352_10012">
                    <rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="translate(4 4)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </Button>
          </div>
          <Input
            startContent={<span>#</span>}
            defaultValue="000000"
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
            <Button
              onPress={checkBgColor}
              appearance="transparent"
              className="h-20 border border-neutral-200"
              style={{
                backgroundColor: background,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="#302e38"
              >
                <rect width="24" height="24" rx="12" />
                <g clipPath="url(#clip0_1352_10012)">
                  <path
                    d="M14.357 5.87163C15.3984 4.83023 17.0869 4.83023 18.1283 5.87163C19.1697 6.91302 19.1697 8.60146 18.1283 9.64286L16.2425 11.5286L16.4783 11.7644C16.7387 12.0247 16.7387 12.4469 16.4783 12.7072C16.218 12.9675 15.7959 12.9675 15.5355 12.7072L15.2999 12.4715L11.1567 16.6147C10.7845 16.9869 10.3103 17.2407 9.79406 17.3439L8.62462 17.5778C8.3665 17.6295 8.12944 17.7563 7.9433 17.9425L7.28596 18.5998C7.0256 18.8601 6.6035 18.8601 6.34314 18.5998L5.40034 17.657C5.13999 17.3967 5.13999 16.9745 5.40034 16.7142L6.05768 16.0568C6.24382 15.8707 6.3707 15.6336 6.42232 15.3755L6.6562 14.2061C6.75946 13.6898 7.0132 13.2157 7.38547 12.8434L11.5286 8.7003L11.2929 8.46457C11.0325 8.20423 11.0325 7.78211 11.2929 7.52177C11.5533 7.26141 11.9753 7.26141 12.2357 7.52177L12.4713 7.75736L14.357 5.87163ZM12.4714 9.64311L8.32828 13.7863C8.14214 13.9724 8.01527 14.2095 7.96365 14.4675L7.72976 15.637C7.62651 16.1533 7.37276 16.6274 7.0005 16.9997C7.37276 16.6274 7.8469 16.3736 8.36314 16.2704L9.53258 16.0365C9.7907 15.9849 10.0278 15.858 10.2139 15.6719L14.357 11.5287L12.4714 9.64311Z"
                    fill="#FEFEFE"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1352_10012">
                    <rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="translate(4 4)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </Button>
          </div>
          <Input
            startContent={<span>#</span>}
            defaultValue="FFFFFF"
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
