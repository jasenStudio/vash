import React, { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

//* TODO Traslate breadcrumb
// import { useTranslation } from "react-i18next";

export const BreadcrumbsCustom = memo(() => {
  // const { t } = useTranslation();

  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link className="capitalize sm:text-[16px] font-semibold" to="/">
            {" "}
            home{" "}
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      {pathnames.reduce<JSX.Element[]>((acc, name, index) => {
        const path = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        acc.push(
          isLast ? (
            <React.Fragment key={path}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <span className="capitalize sm:text-[16px] font-semibold text-white">
                    {" "}
                    {name}
                  </span>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ) : (
            <React.Fragment key={path}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    className="capitalize sm:text-[16px] font-semibold"
                    to={path}
                  >
                    {" "}
                    {name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          )
        );
        return acc;
      }, [])}
    </BreadcrumbList>
  );
});
