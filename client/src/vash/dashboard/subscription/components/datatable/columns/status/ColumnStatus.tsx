import { memo } from "react";
import { useTranslation } from "react-i18next";

export const ColumnStatus = memo(({ status }: { status: string }) => {
  const { t } = useTranslation();
  const castStatus =
    status === "true" ? t("common.active") : t("common.inactive");

  return <div className="font-medium">{castStatus}</div>;
});
