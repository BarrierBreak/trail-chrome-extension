/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Input } from "@trail-ui/react";
import { CheckIcon, CloseIcon, ColorPickerIcon } from "@trail-ui/icons";
import {
  getLuminance,
  hexToRgb,
  checkForOpacity,
  getContrastRatio,
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

  const passIcon = <CheckIcon height={18} width={18} />;
  const failIcon = <CloseIcon height={18} width={18} />;

  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#FFFFFF");
  const [textColorArray, setTextColorArray] = useState([]);
  const [bgColorArray, setBgColorArray] = useState([]);
  const [fontSizeArray, setFontSizeArray] = useState([]);
  const [fontFamilyArray, setFontFamilyArray] = useState([]);
  const [standardTextArray, setStandardTextArray] = useState([]);
  const [largeTextArray, setLargeTextArray] = useState([]);
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const eyeDropper = new EyeDropper();

  const checkColorContrast = (hex1: string, hex2: string): number => {
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

  const ratio = checkColorContrast(foreground, background);
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

  const handleInputBlur = (
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

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId!, { action: "COLOR" }, (response) => {
        setTextColorArray(response.textColorArray);
        setBgColorArray(response.backgroundColorArray);
        setFontSizeArray(response.fontSizeArray);
        setFontFamilyArray(response.fontFamilyArray);

        const standardText = response.colorPairsArray.filter(
          (colorPair: any) => {
            const contrastRatio = getContrastRatio(
              parseRGBA(colorPair.color),
              parseRGBA(colorPair.backgroundColor)
            );
            return contrastRatio < 7;
          }
        );

        const largeText = response.colorPairsArray.filter((colorPair: any) => {
          const contrastRatio = getContrastRatio(
            parseRGBA(colorPair.color),
            parseRGBA(colorPair.backgroundColor)
          );

          const isLargeText =
            parseFloat(colorPair.fontSize) >= 24 ||
            (parseFloat(colorPair.fontSize) >= 18.5 &&
              colorPair.fontWeight >= 700);

          return contrastRatio < 4.5 && isLargeText;
        });

        setStandardTextArray(standardText);
        setLargeTextArray(largeText);
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
              onClick={() => openEyeDropper(setForeground)}
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
            maxLength={7}
            placeholder="Enter Foreground Color"
            onChange={(e) => handleColorChange(e, setForeground)}
            onBlur={(e) => handleInputBlur(e, setForeground, "#000000")}
          />
        </div>
        <div className="flex flex-col gap-4 w-[50%]">
          <div className="flex flex-col gap-1">
            <p>Background</p>
            <button
              aria-hidden="true"
              onClick={() => openEyeDropper(setBackground)}
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
            maxLength={7}
            placeholder="Enter Background Color"
            onChange={(e) => handleColorChange(e, setBackground)}
            onBlur={(e) => handleInputBlur(e, setBackground, "#FFFFFF")}
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
        <p className="text-base text-neutral-900 font-semibold">Color Palette</p>

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

        <div className="flex flex-col gap-4 pt-4 border-t border-neutral-200">
          <p className="text-base text-neutral-900 font-semibold">
            Contrast Issues : {standardTextArray.length + largeTextArray.length}
          </p>

          {standardTextArray.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-neutral-950">
                Standard Text : {standardTextArray.length} Issues
              </p>
              <div className="grid grid-cols-3 gap-4" role="list">
                {standardTextArray.map(
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
                              {checkForOpacity(colorPair.color).toUpperCase()}
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
                          <div className="flex justify-between pt-1">
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
                        </div>
                      </div>
                    </>
                  )
                )}
              </div>
            </div>
          )}

          {largeTextArray.length > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              <p className="text-sm text-neutral-950">
                Large Text : {largeTextArray.length} Issues
              </p>
              <div className="grid grid-cols-3 gap-4" role="list">
                {largeTextArray.map(
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
                              {checkForOpacity(colorPair.color).toUpperCase()}
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
                          <div className="flex justify-between pt-1">
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
                        </div>
                      </div>
                    </>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {fontSizeArray.length > 0 && (
        <div className="flex flex-col gap-4 pt-4 border-t border-neutral-200">
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
