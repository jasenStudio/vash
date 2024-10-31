import { ModeToggle } from "@/components/ui/mode-toggle";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
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
import { Eye, EyeClosed, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string(),
});

export const LoginPage: FC = () => {
  const [password, setPassword] = useState(true);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <>
      <div className="w-full sm:w-[450px]">
        <div className="absolute ml-10 right-5 top-5">
          <ModeToggle />
        </div>
        <div className="pl-10 mb-10">
          <h2 className="text-4xl font-bold">Iniciar Sesión</h2>
          <span>¿No tienes una cuenta?</span>
          <Link className="ml-2 text-gray-400 font-semibold " to="/sign-up">
            Crear Cuenta
          </Link>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full px-10"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel id="username">
                    Usuario o Correo Electrónico
                  </FormLabel>
                  <FormControl>
                    {/* <UserRound className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
                    <Input
                      type="email"
                      iconLeft
                      icon={
                        <UserRound className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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

            {/*  Input password */}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
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
            <Button
              type="submit"
              className="text-xl font-bold py-8 rounded-sm w-full dark:text-white"
              style={{ backgroundColor: "#09186f" }}
            >
              Ingresar
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
