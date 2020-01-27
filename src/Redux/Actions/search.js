import Axios from "axios";

export const searchGetData = (headers, params) => {
  return {
    type: "GET_SEARCH",
    payload: Axios.get("http://54.158.124.83:8000/engineer/", { headers: headers, params: params })
  };
}