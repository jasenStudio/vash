import { useSidebar } from "@/components/ui/sidebar";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
const currentYear = new Date().getFullYear();
interface Props {
  className: string;
}
export const FooterCustom: FC<Props> = React.memo(({ className }) => {
  const { state } = useSidebar();
  const { t } = useTranslation();

  return (
    <footer
      className={`transition-all duration-300 ${
        state === "expanded" ? "ml-64 " : "ml-0 "
      } ${className} fixed bottom-0 left-0 z-20 w-full p-2 px-4 bg-white  shadow md:flex md:items-center md:justify-between md:p-4 md:px-6
         dark:bg-background dark:border-gray-600`}
      style={{
        width: `calc(100% - ${state === "expanded" ? "16rem" : "0rem"})`,
      }}
    >
      <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
        © {currentYear} <a className="hover:underline">VASH™</a>.{" "}
        {t("footer.allRightsReserved")}
      </span>
      <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        {/* <li>
            <a href="#" className="hover:underline me-4 md:me-6">
              About
            </a>
          </li> */}
        <li>
          <a href="#" className="hover:underline me-4 md:me-6">
            {t("footer.privacyPolicy")}
          </a>
        </li>
        {/* <li>
            <a href="#" className="hover:underline me-4 md:me-6">
              Licensing
            </a>
          </li> */}
        <li>
          <a href="#" className="hover:underline">
            {t("footer.contact")}
          </a>
        </li>
      </ul>
      <div className="px-4 py-6 bg-transparent dark:bg-background md:flex md:items-center md:justify-between">
        <div className="flex mt-4 sm:justify-center md:mt-0 space-x-5 rtl:space-x-reverse">
          <a
            href="#"
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 17"
            >
              <path
                fillRule="evenodd"
                d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">Twitter page</span>
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">GitHub account</span>
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 0h-14c-2.762 0-5 2.238-5 5v14c0 2.762 2.238 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.762-2.238-5-5-5zm-11.12 19.314h-2.746v-8.962h2.746v8.962zm-1.374-10.162c-.877 0-1.436-.609-1.436-1.373 0-.782.573-1.373 1.468-1.373.894 0 1.436.591 1.445 1.373 0 .764-.551 1.373-1.477 1.373zm12.494 10.162h-2.746v-4.477c0-1.116-.398-1.877-1.394-1.877-.76 0-1.213.511-1.412 1.003-.073.179-.091.429-.091.681v4.67h-2.746v-8.962h2.746v1.168c.372-.577 1.025-1.396 2.498-1.396 1.821 0 3.187 1.186 3.187 3.731v5.459z" />
            </svg>
            <span className="sr-only">LinkedIn account</span>
          </a>
        </div>
      </div>
    </footer>
  );
});
