const LOGIN = "auth/LOGIN" as const;
const LOGOUT = "auth/LOGOUT" as const;

export const login = (email: string | null) => ({
  type: LOGIN,
  payload: email
});
export const logout = () => ({ type: LOGOUT });

interface AuthState {
  email: string | null;
  is_loggedin: boolean;
  with_credentials: boolean;
}

type AuthAction = ReturnType<typeof login> | ReturnType<typeof logout>;

const initialState: AuthState = {
  email: null,
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
        email: action.payload,
        is_loggedin: true,
        with_credentials: true //doesn't matter
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
