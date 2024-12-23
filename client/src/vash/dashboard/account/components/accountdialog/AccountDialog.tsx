import { FC } from "react";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
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
import { formAccountSchema } from "@/constants";
import { useAccountDialog } from "../../hooks";

const formSchema = formAccountSchema;
const AccountDialog: FC = () => {
  const accountCreateMutation = useAccountMutation();
  const { t } = useTranslation();

  const { isOpen, account, onClose, dialogType, actionType, form } =
    useAccountDialog({ formAccountSchema: formSchema });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(account);
    console.log(account?.id);
    console.log(values);

    accountCreateMutation.mutate(values.account_email, {
      onSuccess: () => form.reset(),
    });
  }

  if (dialogType !== "account") return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[22rem]">
        <DialogHeader>
          <DialogTitle>{actionType}</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="account_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>account_email</FormLabel>
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
                    <FormLabel>status</FormLabel>
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
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-between">
              <Button onClick={onClose} variant="ghost">
                {t("common.close")}
              </Button>
              <Button
                className="bg-button-primary text-white hover:bg-button-primary-foreground"
                disabled={accountCreateMutation.isPending}
                type="submit"
              >
                {accountCreateMutation.isPending
                  ? "cargando..."
                  : "Crear account"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AccountDialog;
