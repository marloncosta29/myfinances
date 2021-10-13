import styled, { css } from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { RectButton } from "react-native-gesture-handler";

interface Props {
  type: "up" | "down";
}
interface ContainerProps {
  isActive: boolean;
  type: "up" | "down";
}

export const Container = styled.View<ContainerProps>`
  width: 48%;

  border-width: ${({ isActive }) => (isActive ? 0 : 1.5)}px;
  border-style: solid;
  border-radius: 5px;
  border-color: ${({ theme }) => theme.colors.text};

  ${({ isActive, type }) => {
    if (isActive && type === "up") {
      return css`
        background-color: ${({ theme }) => theme.colors.success_light};
      `;
    }

    if (isActive && type === "down") {
      return css`
        background-color: ${({ theme }) => theme.colors.attention_light};
      `;
    }
  }}
`;

export const Button = styled(RectButton)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const Icon = styled(Feather)<Props>`
  font-size: ${RFValue(24)}px;
  margin-right: 12px;
  color: ${({ theme, type }) => {
    return type === "up" ? theme.colors.success : theme.colors.attention;
  }};
`;
export const Title = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
`;
