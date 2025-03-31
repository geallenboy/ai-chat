import { useModelList } from "@/hooks/use-model-list";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/hooks/use-preferences";
import { TModelKey } from "@/lib/mode-type";

const ModelSelect = () => {
  const [selectedModel, setSelectedModel] =
    useState<TModelKey>("gpt-3.5-turbo");
  const { getModelByKey, models } = useModelList();
  const { getPreferences, setPreferences } = usePreferences();
  const activeModel = getModelByKey(selectedModel);

  useEffect(() => {
    const fetchPreferences = async () => {
      const preferences = await getPreferences();
      setSelectedModel(preferences.defaultModel);
    };
    fetchPreferences();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"secondary"}
          className="pl-1 pr-3 gap-2 text-xs"
          size={"sm"}
        >
          {activeModel?.icon()} {activeModel?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 h-56 mr-2 mt-2 overflow-scroll">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.key}
            onClick={() => {
              setPreferences({ defaultModel: model.key }).then(() =>
                setSelectedModel(model.key)
              );
            }}
          >
            {model.icon()} {model.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModelSelect;
