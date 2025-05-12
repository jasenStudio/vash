import { useTranslation } from "react-i18next";

type ColumnKey = "email" | "status" | "actions" | "created_at" | "select";

export const useUiColumns = (columnName: ColumnKey | string) => {
  const { t } = useTranslation();

  const columns: Record<ColumnKey, string> = {
    email: t("common.email"),
    status: t("common.status"),
    select: t("common.select"),
    actions: t("common.actions"),
    created_at: t("common.created_at"),
  };

  return columns[columnName.toLowerCase() as ColumnKey] || columnName;
};
