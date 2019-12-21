const LOGIN = "auth/LOGIN" as const;
const LOGOUT = "auth/LOGOUT" as const;

export const login = () => ({ type: LOGIN });
export const logout = () => ({ type: LOGOUT });

interface AuthState {
  is_loggedin: boolean;
  with_credentials: boolean;
}

type AuthAction = ReturnType<typeof login> | ReturnType<typeof logout>;

const initialState: AuthState = {
  is_loggedin: false,
  with_credentials: false
};

export default function auth(
  state: AuthState = initialState,
  action: AuthAction
) {
  switch (action.type) {
    case LOGIN:
      return {
        is_loggedin: true,
        with_credentials: false
      };

    case LOGOUT:
      return {
        is_loggedin: false,
        with_credentials: true
      };

    default:
      return state;
  }
}
