import getStyles from "@/styleguide/styles";
import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";

const ThemeContext = createContext({ styles: getStyles('light'), theme: "light" });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme(); // Detect system theme (light or dark)
  console.log("Detected color scheme:", colorScheme);
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = useMemo(() => getStyles(theme), [theme]);

  return (
    <ThemeContext.Provider value={{ styles, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);