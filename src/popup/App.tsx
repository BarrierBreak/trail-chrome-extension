import { ChevronDownIcon } from "@trail-ui/icons";
import {
  Button,
  Input,
  Label,
  Menu,
  MenuItem,
  MenuTrigger,
  Selection,
} from "@trail-ui/react";
import { useEffect, useRef, useState } from "react";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedTool, setSelectedTool] = useState<Selection>(new Set([]));

  const handleSave = () => {
    localStorage.setItem("authToken", inputRef.current?.value || "");
    chrome.runtime.sendMessage({ type: "RELOAD" }, () => {});
    window.close();
  };

  useEffect(() => {
    const selectedToolArray = Array.from(selectedTool);

    const tools = [
      "tab-order",
      "headings",
      "list-tags",
      "landmarks",
      "alt-text",
      "links",
      "forms",
    ];

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0].id;

      tools.forEach((tool) => {
        const messageType = selectedToolArray.includes(tool)
          ? `show-${tool}`
          : `hide-${tool}`;
        chrome.tabs.sendMessage(tabId!, { type: messageType }, () => {});
      });
    });
  }, [selectedTool]);

  return (
    <div className={`${isOpen ? "h-[410px]" : ""} w-[320px] p-6 font-poppins`}>
      <Label className="text-neutral-700 text-base font-medium">
        Auth Token
      </Label>
      <div className="flex justify-between mt-1 mb-3 pb-3 border-b border-neutral-200">
        <Input
          id="authToken"
          variant="compact"
          ref={inputRef}
          defaultValue={localStorage.getItem("authToken") || ""}
          placeholder="Enter your Auth Token"
          className="w-[180px] text-neutral-900 text-base"
        />
        <Button onPress={handleSave} className="w-[80px]" appearance="primary">
          Save
        </Button>
      </div>

      <div className="flex gap-4">
        <MenuTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
          <Button
            appearance="default"
            aria-controls="bookmarklet-menu"
            className="w-full pl-2 justify-between text-base data-[pressed=true]:border-purple-600 data-[pressed=true]:bg-purple-100"
            endContent={<ChevronDownIcon width={16} height={16} />}
          >
            Bookmarklets
          </Button>
          <Menu
            id="bookmarklet-menu"
            selectionMode="multiple"
            selectedKeys={selectedTool}
            onSelectionChange={setSelectedTool}
            className="w-[264px]"
            classNames={{ popover: "font-poppins" }}
          >
            <MenuItem id="tab-order" classNames={{ title: "text-base" }}>
              Tab Order
            </MenuItem>
            <MenuItem id="headings" classNames={{ title: "text-base" }}>
              Headings
            </MenuItem>
            <MenuItem id="list-tags" classNames={{ title: "text-base" }}>
              List
            </MenuItem>
            <MenuItem id="landmarks" classNames={{ title: "text-base" }}>
              Landmark
            </MenuItem>
            <MenuItem id="alt-text" classNames={{ title: "text-base" }}>
              Alt Text
            </MenuItem>
            <MenuItem id="links" classNames={{ title: "text-base" }}>
              Links
            </MenuItem>
            <MenuItem id="forms" classNames={{ title: "text-base" }}>
              Forms
            </MenuItem>
          </Menu>
        </MenuTrigger>
      </div>
    </div>
  );
}

export default App;
