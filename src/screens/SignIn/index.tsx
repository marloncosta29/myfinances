import React, { useState } from "react";
import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignTitle,
  Footer,
  FooterWrapper,
} from "./styles";

import AppleSvg from "../../assets/apple.svg";
import GoogleSvg from "../../assets/google.svg";
import LogoSvg from "../../assets/logo.svg";
import { RFValue } from "react-native-responsive-fontsize";
import { SignInSocialButton } from "../../components/SignInSocialButton";
import { useAuth } from "../../contexts/AuthContext";
import { ActivityIndicator, Alert, Platform } from "react-native";
import { useTheme } from "styled-components";

export function SignIn() {
  const [isLoadiing, setIsLoading] = useState(false);
  const { signInWithGoogle, signWithApple } = useAuth();
  const theme = useTheme();
  async function handleSignINWithGoogle() {
    try {
      setIsLoading(true);
      return await signInWithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possivel conectar a conta Google");
      setIsLoading(false);
    }
  }

  async function handleSignINWithApple() {
    try {
      setIsLoading(true);
      return await signWithApple();
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possivel conectar a conta Apple");
      setIsLoading(false);
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />
          <Title>
            Controle suas {"\n"} finanças de forma {"\n"} muito simples
          </Title>
        </TitleWrapper>

        <SignTitle>Faça seu login com {"\n"} uma das contas abaixo</SignTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignINWithGoogle}
          />

          {Platform.OS === "ios" && (
            <SignInSocialButton
              title="Entrar com Apple"
              svg={AppleSvg}
              onPress={handleSignINWithApple}
            />
          )}
        </FooterWrapper>
        {isLoadiing && (
          <ActivityIndicator
            color={theme.colors.shape}
            size="large"
            style={{ marginTop: 10 }}
          />
        )}
      </Footer>
    </Container>
  );
}
