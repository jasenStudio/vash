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
  FormDescription,
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

import { useDialog } from "@/vash/store/ui/useDialog";
import { FC } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Account } from "@/domain";
import React from "react";

const AccountDialog: FC = () => {
  const isOpen = useDialog((state) => state.isOpen);
  const onClose = useDialog((state) => state.onClose);
  const dialogType = useDialog((state) => state.dialogType);
  const actionType = useDialog((state) => state.actionType);
  const { data: account } = useDialog(
    (state) => state.data as { data: Account }
  );

  const formSchema = z.object({
    account_email: z
      .string({
        required_error: "El correo electrónico es requerido",
      })
      .email(),
    status: z.string().default("true"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account_email: "",
      status: "true",
    },
  });

  React.useEffect(() => {
    if (actionType === "update" && account) {
      form.reset({
        account_email: account.account_email,
        status: String(account.status),
      });
    } else {
      form.reset({
        account_email: "",
        status: "true",
      });
    }
  }, [account, actionType, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(account);
    console.log(account?.id);
    console.log(values);
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
                  <FormMessage />
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

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AccountDialog;
