import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {}

export const AccountLayout = ({ children }: Props) => {
  return <>{children}</>;
};
