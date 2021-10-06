import React from "react";
import { StatusBar, Text } from "react-native";
import { Dashboard } from "./src/screens/Dashboard";
import { Register } from "./src/screens/Register";


import { ThemeProvider } from "styled-components";
import theme from "./src/global/styles/theme";
import AppLoading from 'expo-app-loading'
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if(!fontsLoaded){
    return <AppLoading />
  }
  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Register />
    </ThemeProvider>
  );
}
