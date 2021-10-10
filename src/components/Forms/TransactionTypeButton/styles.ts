import { TouchableOpacity } from "react-native";
import styled, { css } from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

interface Props {
  type: "up" | "down";
}
interface ContainerProps {
  isActive: boolean;
  type: "up" | "down";
}

export const Container = styled(TouchableOpacity)<ContainerProps>`
  width: 48%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-width: ${({ isActive }) => (isActive ? 0 : 1.5)}px;
  border-style: solid;
  border-radius: 5px;
  border-color: ${({ theme }) => theme.colors.text};
  padding: 16px;

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
