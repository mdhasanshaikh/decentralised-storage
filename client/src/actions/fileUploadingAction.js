

import {
    TRANSACTIONFEES_LOADING,
    TRANSACTIONFEES_LOADED,
    TRANSACTIONFEES_SUCCESS,
    TRANSACTIONFEES_ERROR,
    GASFEES_LOADING,
    GASFEES_LOADED,
    GASFEES_SUCCESS,
    GASFEES_ERROR,
    FILE_UPLOADING,
    FILE_UPLOADED,
    FILEUPLOADING_ERROR
  } from "../actions/types";

  import { returnErrors, clearErrors } from "./errorActions";

  //check token & load user
export const loadUser = () => (dispatch) => {
    //User loading
    dispatch({ type: TRANSACTIONFEES_LOADING });


    dispatch({
        type: TRANSACTIONFEES_LOADED,
    })
  
  };