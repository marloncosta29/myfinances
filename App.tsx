import "intl";
import "intl/locale-data/jsonp/pt-BR";

import React from "react";
import { StatusBar } from "react-native";
import { ThemeProvider } from "styled-components";
import theme from "./src/global/styles/theme";
import AppLoading from "expo-app-loading";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import { AppContextContainer } from "./src/contexts";
import { Routes } from "./src/routes";
import { useAuth } from "./src/contexts/AuthContext";

export default function App() {
  const { loading } = useAuth();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });
  if (!fontsLoaded || loading) {
    return <AppLoading />;
  }
  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
      />
      <AppContextContainer>
        <Routes />
      </AppContextContainer>
    </ThemeProvider>
  );
}
