import { ModeToggle } from "@/components/ui/mode-toggle";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {}
export const AuthLayout = ({ children }: Props) => {
  return (
    <div className="w-full h-dvh flex flex-col justify-center items-center ">
      <span className="absolute top-[10px] right-[10px]">
        <ModeToggle />
      </span>

      {children}
    </div>
  );
};
