import { Link, useNavigate } from "react-router-dom";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed, Mail, UserPlus, UserRound } from "lucide-react";

import { formRegisterSchema } from "@/constants/formSchemas/formRegisteSchema";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

import { useAuthStore } from "@/vash/store/auth/useAuthStore";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const formSchema = formRegisterSchema;
//TODO FEEDBACK USERNAME EXIST
const RegisterPage = () => {
  const [password, setPassword] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState(true);
  const startRegister = useAuthStore((state) => state.register);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      user_name: "",
      confirmPassword: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { confirmPassword, termsAndConditions, email, user_name, ...user } =
      values;
    const response = await startRegister({
      email: email.toLowerCase(),
      user_name: user_name.toLowerCase(),
      ...user,
    });

    if (!response) return;

    toast.success("Usuario registrado", { duration: 5000 });
    setTimeout(() => {
      navigate("/sign-in");
    }, 1000);
  }
  return (
    <>
      {/* first opcion */}
      <div className="w-full sm:w-[750px]">
        <div className="pl-10 mb-8 sm:mb-8 lg:mb-8 self-start pt-container-auth">
          <h2 className="text-4xl sm:text-3xl lg:text-4xl font-bold">
            {t("auth.register")}
          </h2>
          <span> {t("auth.haveAnAccount")} </span>
          <Link
            className="ml-2 text-gray-700 dark:text-gray-400 font-semibold "
            to="/sign-in"
          >
            {t("auth.login")}
          </Link>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full px-10  sm:grid sm:grid-cols-2 sm:justify-center sm:items-enter gap-4 pb-container-auth"
          >
            {/* input correo electronico */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.email")}</FormLabel>
                  <FormControl>
                    <Input
                      iconLeft
                      icon={
                        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      }
                      placeholder="Ej: xxxxx@gmail.com"
                      {...field}
                      className="border-slate-400 py-7 rounded-sm"
                    />
                  </FormControl>

                  <FormMessage> </FormMessage>
                </FormItem>
              )}
            />
            {/* input usuario */}
            <FormField
              control={form.control}
              name="user_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.username")}</FormLabel>
                  <FormControl>
                    <Input
                      iconLeft
                      icon={
                        <UserRound className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      }
                      placeholder="Ej: johndoe"
                      {...field}
                      className="border-slate-400 py-7 rounded-sm"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Input password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-1">
                  <FormLabel id="password">{t("auth.password")}</FormLabel>
                  <FormControl>
                    <Input
                      type={password ? "password" : "text"}
                      placeholder="Ej: Xxxxxxx."
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
                      style={{}}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* input confirmation password */}

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel id="confirmPassword">
                    {t("auth.confirmPassword")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={confirmPassword ? "password" : "text"}
                      placeholder="Ej: Xxxxxxx."
                      iconLeft
                      icon={
                        !confirmPassword ? (
                          <Eye
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            onClick={() => {
                              setConfirmPassword(true);
                            }}
                          />
                        ) : (
                          <EyeClosed
                            onClick={() => {
                              setConfirmPassword(false);
                            }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400  "
                          />
                        )
                      }
                      {...field}
                      className="border-slate-400 py-7 rounded-sm"
                      style={{}}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* terminos y condiciones */}
            <FormField
              control={form.control}
              name="termsAndConditions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4 shadow col-span-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      {t("auth.readAndAgree")}
                      <span className="dark:text-gray-100 underline font-bold">
                        {t("auth.termsAndConditions")}
                      </span>{" "}
                      {t("common.and")}
                      <span className="dark:text-gray-100 underline font-bold">
                        {t("auth.privacyPolicy")}
                      </span>
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              role="button"
              aria-label="Create Account"
              className="bg-button-primary hover:bg-button-primary-foreground  text-xl font-bold py-4 rounded-sm w-full dark:text-white"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-pulse ">
                    {t("auth.creatingAccount")}
                  </span>
                </>
              ) : (
                <>
                  <span className="flex justify-center items-center">
                    <UserPlus className="mr-2" aria-hidden="true" />
                    {t("auth.createAccount")}
                  </span>
                </>
              )}
            </button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default RegisterPage;
