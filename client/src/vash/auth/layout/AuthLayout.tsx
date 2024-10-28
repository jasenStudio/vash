import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {}
export const AuthLayout = ({ children }: Props) => {
  return (
    <div className="w-full h-dvh flex justify-center items-center">
      {children}
    </div>
  );
};
