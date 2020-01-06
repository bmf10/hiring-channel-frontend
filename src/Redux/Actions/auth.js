import Axios from "axios";

export const LoginUser = (data) => {
  return {
    type: "LOGIN_USER",
    payload: Axios.post("http://localhost:8000/auth", data)
  };
}

export const RegisterCompanyAction = (data) => {
  return {
    type: "REGISTER_COMPANY",
    payload: Axios.post('http://localhost:8000/auth/company', data)
  }
}

export const RegisterEngineerAction = (data) => {
  return {
    type: "REGISTER_ENGINEER",
    payload: Axios.post('http://localhost:8000/auth/engineer', data)
  }
}