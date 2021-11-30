import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import * as AuthSession from "expo-auth-session";
import * as AppleAuthentication from "expo-apple-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

interface AuthProviderProps {
  children: ReactNode;
}
interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface AuthContextData {
  user: User;
  signInWithGoogle(): Promise<void>;
  signWithApple(): Promise<void>;
  signOut(): Promise<void>;
  loading: boolean;
}

interface AuthprizationResponse {
  params: {
    access_token: string;
  };
  type: string;
}

const userkey = "@myfinances:user";

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [loading, setLoading] = useState(true);

  async function signInWithGoogle() {
    try {
      const RESPONSE_TYPE = "token";
      const SCOPE = encodeURI("profile email");
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
      const { params, type } = (await AuthSession.startAsync({
        authUrl,
      })) as AuthprizationResponse;
      if (type === "success") {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`
        );
        const userInfo = await response.json();
        const userLogged = {
          email: userInfo.email,
          name: userInfo.given_name,
          id: userInfo.id,
          photo: userInfo.picture,
        };
        setUser(userLogged);
        await AsyncStorage.setItem(userkey, JSON.stringify(userLogged));
      } else {
        setUser({} as User);
        await AsyncStorage.removeItem(userkey);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function signWithApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential) {
        const name = credential.fullName!.givenName;

        const userLogged = {
          email: credential.email,
          name,
          id: credential.user,
          photo: `https://ui-avatars.com/api/?name=${name}&length=1`,
        };

        setUser(userLogged);
        await AsyncStorage.setItem(userkey, JSON.stringify(userLogged));
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function signOut() {
    setUser({} as User);
    await AsyncStorage.removeItem(userkey);
  }

  useEffect(() => {
    async function loadUserStorageData() {
      const data = (await AsyncStorage.getItem(userkey).then((data) => {
        if (data) {
          return JSON.parse(data);
        }
        return {};
      })) as User;
      setUser(data);
      setLoading(false);
    }
    loadUserStorageData();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, signInWithGoogle, signWithApple, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used with AuthProvider");
  }
  return context;
};
