//* react & react router dom
import { FC, useState } from "react";
import { Link } from "react-router-dom";

//* zod & react hook form
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

//* shacdn/ui
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

//* icons
import { Eye, EyeClosed, UserRound } from "lucide-react";

//* custom import
import { formLoginSchema } from "@/constants";

//* store
import { useAuthStore } from "@/vash/store/auth/useAuthStore";
import { toast } from "sonner";

const formSchema = formLoginSchema;

export const LoginPage: FC = () => {
  const [password, setPassword] = useState(true);
  const login = useAuthStore((state) => state.login);
  const clearMessage = useAuthStore((state) => state.clearMessage);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "jsalgadoecheverria@gmail.com",
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
      <div className="w-full sm:w-[450px] show-title animate-fade-down animate-once">
        <div className="sm:pl-10 mb-10">
          <h2 className="text-4xl font-bold">Iniciar Sesión</h2>

          <span>¿No tienes una cuenta?</span>
          <Link
            className="ml-2 text-gray-700 dark:text-gray-400 font-semibold "
            to="/sign-up"
          >
            Crear Cuenta
          </Link>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-[325px] sm:w-full px-0 sm:px-10"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
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
                  <FormLabel id="password">Contraseña</FormLabel>
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
            <Button
              disabled={isSubmitting}
              type="submit"
              className="text-xl font-bold py-8 rounded-sm w-full dark:text-white"
              style={{ backgroundColor: "#09186f" }}
            >
              {isSubmitting ? (
                <span className="animate-pulse">Iniciando...</span>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
