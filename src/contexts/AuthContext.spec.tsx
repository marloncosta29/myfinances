import "jest-fetch-mock";
import { AuthProvider, useAuth } from "./AuthContext";
import { renderHook, act } from "@testing-library/react-hooks";
import fetchMock from "jest-fetch-mock";
import { mocked } from "ts-jest/utils";
import { startAsync } from "expo-auth-session";

fetchMock.enableMocks();

const googleUserForTest = {
  id: "any_id",
  email: "marlon.29@outlook.com",
  given_name: "Marlon",
  picture: "any_photo.png",
};

jest.mock("expo-auth-session");

describe("Auth Context", () => {
  it("should be able to signin with Google Account", async () => {
    //Primeiro, nós precisamos do Token. Então, vamos Mockar a função de startAsync.
    const googleMocked = mocked(startAsync as any);
    googleMocked.mockReturnValueOnce({
      type: "success",
      params: {
        access_token: "any_token",
      },
    });

    //Agora que temos o Token, vamos mockar a requisição ttp dos dados de profile do usuário.
    fetchMock.mockResponseOnce(JSON.stringify(googleUserForTest));
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitForNextUpdate();
    await act(() => result.current.signInWithGoogle());
    // Você até pode usar esse console.log para visualizar os dados.
    expect(result.current.user.email).toBe(googleUserForTest.email);
  });

  it("user should not connect if cancel authentication with google", async () => {
    //Primeiro, nós precisamos do Token. Então, vamos Mockar a função de startAsync.
    const googleMocked = mocked(startAsync as any);
    googleMocked.mockReturnValueOnce({
      type: "cancel",
    });

    //Agora que temos o Token, vamos mockar a requisição ttp dos dados de profile do usuário.
    fetchMock.mockResponseOnce(JSON.stringify(googleUserForTest));
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitForNextUpdate();
    await act(() => result.current.signInWithGoogle());
    // Você até pode usar esse console.log para visualizar os dados.
    console.log("USER PROFILE =>", result.current.user);
    expect(result.current.user).not.toHaveProperty("id");
  });
});
