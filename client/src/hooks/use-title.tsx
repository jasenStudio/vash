import { useUiTitleStore } from "@/vash/store/ui/useUititleStore";
import { useEffect } from "react";

export const useTitle = (title: string) => {
  const setTitle = useUiTitleStore((state) => state.setTitle);

  useEffect(() => {
    setTitle(title);
  }, []);
};
