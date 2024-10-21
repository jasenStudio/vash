import "./App.css";
import { Button } from "@/components/ui/button";
import { AppRoutes } from "./routes/AppRoutes";
export const VashApp = () => {
  return (
    <>
      <AppRoutes />{" "}
      <Button className="bg-emerald-500 hover:bg-emerald-800">Click me</Button>
    </>
  );
};
