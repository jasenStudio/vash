import { FC, memo } from "react";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { useAccountMutation } from "@/vash/dashboard/account/hooks/use-account-mutation";
import { formAccountSchema } from "@/constants/formSchemas";
import { useAccountDialog } from "../../hooks";
import { useAccountUpdateMutation } from "@/vash/dashboard/account/hooks/use-account-update-mutation";
import { ButtonDialog, ButtonDialogCancel } from "..";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";

const formSchema = formAccountSchema;
export const FormAccountDialog: FC = memo(() => {
  const { t } = useTranslation();
  const accountCreateMutation = useAccountMutation();
  const accountUpdateMutation = useAccountUpdateMutation();

  const {
    isOpen,
    account,
    onClose,
    dialogType,
    actionType,
    form,
    typeComponent,
  } = useAccountDialog({ formAccountSchema: formSchema });

  const isUpdate =
    actionType === "update"
      ? accountUpdateMutation.isPending
      : accountCreateMutation.isPending;

  const formTitleByAction =
    actionType === "create"
      ? t("entities.account.create")
      : t("entities.account.update");

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { status, ...rest } = values;
    const castingStatus = status === "true" ? true : false;

    actionType === "update"
      ? accountUpdateMutation.mutate({
          id: account!.id!,
          payload: {
            status: castingStatus,
            created_at: account!.created_at,
            ...rest,
          },
        })
      : accountCreateMutation.mutate(values.account_email, {
          onSuccess: () => form.reset(),
        });
  }

  if (typeComponent !== "dialog" && dialogType !== "account") return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[22rem]">
        <DialogHeader>
          <DialogTitle>{formTitleByAction}</DialogTitle>
        </DialogHeader>

        <DialogDescription hidden>
          Dialog for create or update account
        </DialogDescription>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="account_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("entities.account.form.email")}</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage enableTranslation />
                </FormItem>
              )}
            />

            {actionType === "update" && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("entities.account.form.status")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">
                          {t("common.active")}
                        </SelectItem>
                        <SelectItem value="false">
                          {t("common.inactive")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-between">
              <ButtonDialogCancel onClose={onClose} />
              <ButtonDialog isPending={isUpdate} actionType={actionType!} />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
