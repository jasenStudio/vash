import { PropsWithChildren } from "react";

import { SettingDialogCustom } from "@/components/ui-custom/setting-dialog/SettingDialogCustom";

interface Props extends PropsWithChildren {}

export const AuthLayout = ({ children }: Props) => {
  return (
    <div className="w-full h-dvh flex flex-col justify-center items-center ">
      <span className="absolute top-[10px] right-[10px]"></span>
      <div className="w-full absolute flex justify-end top-[20px] right-[10px]">
        <SettingDialogCustom />
      </div>
      {children}
    </div>
  );
};
