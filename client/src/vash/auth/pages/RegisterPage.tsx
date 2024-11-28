import { Link, useNavigate } from "react-router-dom";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed, Mail, UserRound } from "lucide-react";

import { formRegisterSchema } from "@/constants/formSchemas/formRegisteSchema";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

import { useAuthStore } from "@/vash/store/auth/useAuthStore";
import { toast } from "sonner";

const formSchema = formRegisterSchema;

export const RegisterPage = () => {
  const [password, setPassword] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState(true);
  const startRegister = useAuthStore((state) => state.register);
  const navigate = useNavigate();

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
    const { confirmPassword, termsAndConditions, ...user } = values;
    const response = await startRegister(user);

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
            Crear Cuenta
          </h2>
          <span> ¿Ya tienes una cuenta?</span>
          <Link
            className="ml-2 text-gray-700 dark:text-gray-400 font-semibold "
            to="/sign-in"
          >
            Iniciar sesión
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
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input
                      iconLeft
                      icon={
                        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      }
                      placeholder="xxxxx@gmail.com"
                      {...field}
                      className="border-slate-400 py-7 rounded-sm"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* input usuario */}
            <FormField
              control={form.control}
              name="user_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <FormControl>
                    <Input
                      iconLeft
                      icon={
                        <UserRound className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      }
                      placeholder="EJ:jhon-doe"
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
                  <FormLabel id="password">Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type={password ? "password" : "text"}
                      placeholder="xxxxxxxxxxx"
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
                    Confirmar Contraseña
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={confirmPassword ? "password" : "text"}
                      placeholder="xxxxxxxxxxx"
                      iconLeft
                      icon={
                        !confirmPassword ? (
                          <Eye
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            onClick={() => {
                              setConfirmPassword(true);
                              console.log("aqui");
                            }}
                          />
                        ) : (
                          <EyeClosed
                            onClick={() => {
                              setConfirmPassword(false);
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
                      He leído y acepto los{" "}
                      <span className="dark:text-gray-400 underline font-bold">
                        términos y condiciones
                      </span>{" "}
                      y la{" "}
                      <span className="dark:text-gray-400 underline font-bold">
                        política de privacidad
                      </span>
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-button-primary hover:bg-button-primary-foreground  text-xl font-bold py-8 rounded-sm w-full dark:text-white"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-pulse ">Creando...</span>
                </>
              ) : (
                "Crea Cuenta"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
