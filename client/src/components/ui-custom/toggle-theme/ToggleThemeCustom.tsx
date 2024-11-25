import { useTheme } from "@/vash/providers/theme-provider";
import "./ToggleThemeCustom.css";

export const ToggleModeCustom = () => {
  const { setTheme, theme } = useTheme();
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };
  return (
    <div
      onClick={toggleTheme}
      className={`toggle ${theme === "dark" ? "night border-toggle" : ""}`}
    >
      <div className={`notch ${theme === "dark" ? "notch-position" : ""}`}>
        <div className="crater" />
        <div className="crater" />
      </div>
      <div>
        <div className="shape sm" />
        <div className="shape sm" />
        <div className="shape md" />
        <div className="shape lg" />
      </div>
    </div>
  );
};
