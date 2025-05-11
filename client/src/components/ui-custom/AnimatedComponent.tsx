import { PropsWithChildren } from "react";
import { motion, Variants } from "framer-motion";

const transitionDefault: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
};

interface Props extends PropsWithChildren {
  pageTransition?: Variants;
  transition?: {
    duration: number;
  };
}

export const AnimatedComponent = ({
  children,
  pageTransition = transitionDefault,
  transition,
}: Props) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      transition={transition}
    >
      {children}
    </motion.div>
  );
};
