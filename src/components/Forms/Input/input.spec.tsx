import React from "react";
import { render } from "@testing-library/react-native";
import { Input } from ".";
import { ThemeProvider } from "styled-components/native";
import theme from "../../../global/styles/theme";

const Provider: React.FC = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

describe("Input Component", () => {
  it("should render with placeholder", () => {
    const { getByTestId } = render(
      <Input testID="input-email" placeholder="E-mail" />,
      {
        wrapper: Provider,
      }
    );
    const inputComponent = getByTestId("input-email");
    expect(inputComponent.props.placeholder).toEqual("E-mail");
  });
});
