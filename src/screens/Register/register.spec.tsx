import React from "react";
import { render } from "@testing-library/react-native";
import { ThemeProvider } from "styled-components/native";
import { Register } from ".";

import theme from "../../global/styles/theme";

jest.mock("@react-navigation/native", () => {
  return {
    useNavigation: jest.fn(),
  };
});

const Provider: React.FC = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
describe("Register Screen", () => {
  it("should open category modal when user click in button", () => {
    const { getByTestId } = render(<Register />, {
      wrapper: Provider,
    });
    const modalCategory = getByTestId("modal-category");
    expect(modalCategory.props.visible).toBeFalsy();
  });
});
