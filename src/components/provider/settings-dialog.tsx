// components/settings/settings-dialog.tsx
"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GearSix } from "@phosphor-icons/react";
import { ModelIcon } from "@/components/icons/model-icon";
import { OpenAISettings } from "@/components/settings/openai";
import { AnthropicSettings } from "@/components/settings/anthropic";
import { GeminiSettings } from "@/components/settings/gemini";
import { useSettingsStore, TSettingMenuKey } from "@/stores/settings-store";

export const SettingsDialog = () => {
  const { isSettingsOpen, selectedMenu, dismiss, selectMenu } =
    useSettingsStore();

  const settingMenu: {
    name: string;
    key: TSettingMenuKey;
    icon: () => React.ReactNode;
    component: React.ReactNode;
  }[] = [
    {
      name: "Profile",
      key: "profile",
      icon: () => <GearSix size={16} weight="bold" />,
      component: <div>Profile</div>,
    },
    {
      name: "Prompts",
      key: "prompts",
      icon: () => <GearSix size={16} weight="bold" />,
      component: <div>Prompts</div>,
    },
    {
      name: "Roles",
      key: "roles",
      icon: () => <GearSix size={16} weight="bold" />,
      component: <div>Roles</div>,
    },
  ];

  const modelsMenu: {
    name: string;
    key: TSettingMenuKey;
    icon: () => React.ReactNode;
    component: React.ReactNode;
  }[] = [
    {
      name: "OpenAI",
      key: "openai",
      icon: () => <ModelIcon size={"medium"} type="openai" />,
      component: <OpenAISettings />,
    },
    {
      name: "Anthropic",
      key: "anthropic",
      icon: () => <ModelIcon size={"medium"} type="anthropic" />,
      component: <AnthropicSettings />,
    },
    {
      name: "Gemini",
      key: "gemini",
      icon: () => <ModelIcon size={"medium"} type="gemini" />,
      component: <GeminiSettings />,
    },
  ];

  const allMenu = [...settingMenu, ...modelsMenu];
  const selectedItem = allMenu.find((m) => m.key === selectedMenu);

  return (
    <Dialog
      open={isSettingsOpen}
      onOpenChange={(val) => (val ? null : dismiss())}
    >
      <DialogContent className="min-w-[800px] min-h-[80vh] flex flex-row overflow-hidden border border-white/5 p-0">
        {/* <DialogTitle className="sr-only">Command Palette</DialogTitle> */}
        <div className="w-[250px] bg-black/10 p-2 flex flex-col">
          <p className="px-4 py-2 text-xs font-semibold text-white/30">
            GENERAL
          </p>
          {settingMenu.map((menu) => (
            <Button
              key={menu.key}
              variant={selectedMenu === menu.key ? "secondary" : "ghost"}
              onClick={() => selectMenu(menu.key)}
              className="justify-start gap-3 px-3"
              size="default"
            >
              {menu.icon()} {menu.name}
            </Button>
          ))}
          <p className="px-4 py-2 text-xs font-semibold text-white/30">
            MODELS
          </p>
          {modelsMenu.map((menu) => (
            <Button
              key={menu.key}
              variant={selectedMenu === menu.key ? "secondary" : "ghost"}
              onClick={() => selectMenu(menu.key)}
              className="justify-start gap-3 px-3"
              size="default"
            >
              {menu.icon()} {menu.name}
            </Button>
          ))}
        </div>
        <div className="w-full h-full">{selectedItem?.component}</div>
      </DialogContent>
    </Dialog>
  );
};
