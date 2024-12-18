//* react & react router dom
import { FC, useState } from "react";
import { Link } from "react-router-dom";

//* zod & react hook form
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

//* shacdn/ui
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

//* icons
import { Eye, EyeClosed, LogIn, UserRound } from "lucide-react";

//* custom import
import { formLoginSchema } from "@/constants";

//* store
import { useAuthStore } from "@/vash/store/auth/useAuthStore";
import { toast } from "sonner";

import { useTranslation } from "react-i18next";

const formSchema = formLoginSchema;

const LoginPage: FC = () => {
  const [password, setPassword] = useState(true);
  const { t } = useTranslation();
  const login = useAuthStore((state) => state.login);
  const clearMessage = useAuthStore((state) => state.clearMessage);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "johndoe@gmail.com",
      password: "123456",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await login(values.username, values.password);

    if (!response)
      setTimeout(() => {
        const { msgError, status } = useAuthStore.getState();
        status === "unauthenticated" && toast.error(msgError);
        clearMessage();
      }, 100);
  }

  return (
    <>
      <div className="w-full sm:w-[450px]">
        <div className="sm:pl-10 mb-10 pt-container-auth">
          <h2 className="text-4xl font-bold">{t("auth.login")}</h2>

          <span>{t("auth.notHaveAccount")}</span>
          <Link
            className="ml-2 text-gray-700 dark:text-gray-400 font-semibold "
            to="/sign-up"
          >
            {t("auth.register")}
          </Link>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-[325px] sm:w-full px-0 sm:px-10 pb-container-auth"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.username")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: johndoe-019 o johndoe@contosos.com"
                      iconLeft
                      icon={
                        <UserRound className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      }
                      {...field}
                      id="username"
                      className="border-slate-400 py-7 rounded-sm"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/*  Input password */}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-1">
                  <FormLabel id="password">{t("auth.password")}</FormLabel>
                  <FormControl>
                    <Input
                      type={password ? "password" : "text"}
                      placeholder={password ? "xxxxxxxx" : "Ej:avSV-123"}
                      iconLeft
                      icon={
                        !password ? (
                          <Eye
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            onClick={() => {
                              setPassword(true);
                              console.log("aqui");
                            }}
                          />
                        ) : (
                          <EyeClosed
                            onClick={() => {
                              setPassword(false);
                              console.log("aqui");
                            }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400  "
                          />
                        )
                      }
                      {...field}
                      className="border-slate-400 py-7 rounded-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* button */}
            <button
              disabled={isSubmitting}
              type="submit"
              role="button"
              aria-label="Sign in"
              className="bg-button-primary  hover:bg-button-primary-foreground text-xl font-bold py-4 rounded-sm w-full dark:text-white"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Iniciando...</span>
              ) : (
                <span className="flex justify-center items-center">
                  <LogIn className="mr-2" aria-hidden="true" />
                  {t("auth.login")}
                </span>
              )}
            </button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default LoginPage;
