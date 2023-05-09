import * as AuthApi from "../api/AuthRequests";


export const logIn = (formData, navigate, addToast) => async (dispatch) => {

  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.logIn(formData);
    dispatch({ type: "AUTH_SUCCESS", data: data });
    navigate("../chat", { replace: true });
    addToast("Logged in successfully.", { appearance: 'success' })
  } catch (error) {
    console.log(error);
    dispatch({ type: "AUTH_FAIL" });
    addToast("Invalid email or password", { appearance: 'error' })
  }
};

export const signUp = (formData, navigate, addToast) => async (dispatch) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.signUp(formData);
    dispatch({ type: "AUTH_SUCCESS", data: data });
    addToast("Account created.", { appearance: 'success' })
    navigate("../auth", { replace: true });
  } catch (error) {
    console.log(error);
    dispatch({ type: "AUTH_FAIL" });
    addToast("Registration failed. Please check your details and try again.", { appearance: 'error' })
  }
};


export const logout = (navigate)=> async(dispatch)=> {
  dispatch({type: "LOG_OUT"})
  navigate("/", { replace: true });
}