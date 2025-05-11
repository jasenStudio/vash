import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {}

const SubscriptionLayout = ({ children }: Props) => {
  return <>{children}</>;
};

export default SubscriptionLayout;
