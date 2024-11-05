import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
interface Props extends PropsWithChildren {}

export const AccountLayout = ({ children }: Props) => {
  return (
    <>
      <div>{children}</div>
    </>
  );
};
