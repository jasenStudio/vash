import React, { FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  className: string;
}
const currentYear = new Date().getFullYear();
export const FooterCustomMobile: FC<Props> = React.memo(({ className }) => {
  const { t } = useTranslation();
  return (
    <footer
      className={`fixed bottom-0 left-0 z-20 w-full p-4 bg-white border-t 
  border-gray-200 shadow text-center
   dark:bg-background dark:border-transparent ${className}`}
    >
      <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
        © {currentYear} <a className="hover:underline">VASH™</a>.{" "}
        {t("footer.allRightsReserved")}
      </span>
    </footer>
  );
});
