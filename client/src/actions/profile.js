import axios from "axios"
import { setAlert } from "./alert"
import {
  GET_PROFILE,
  UPDATE_PROFILE,
  PROFILE_ERROR
} from "./types"

// get current user's profile
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get("/api/profile/me")

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

// create or update profile 
export const createProfile = (formData, history, edit = false) => async dispatch => {
  try {
    // sending data that's why creating config object with headers object content type: app/json
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    // request to post route that creates and updates profile
    const res = await axios.post("/api/profile", formData, config)

    // what we are dispatching to our reducer
    dispatch({
      type: GET_PROFILE,
      payload: res.data // profile
    })

    // dispatch an alert to match an action
    dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"))

    // redicrect action if profile created, if editing stay on the page
    // to redirect an action you gotta pass history object which has push method on it
    if(!edit) history.push("/dashboard")
  } catch (err) {
    // get the errors
    const errors = err.response.data.errors

    // if there are errors we loop through and we output them in an alert
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

// add experience

export const addExperience = (formData, history) => async dispatch => {
  try {
    // sending data that's why creating config object with headers object content type: app/json
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    // request to put route that creates experience
    const res = await axios.put("/api/profile/experience", formData, config)

    // what we are dispatching to our reducer
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data // profile
    })

    // dispatch an alert to match an action
    dispatch(setAlert("Experience added", "success"))

    // redicrect action when experience is created
    // to redirect an action you gotta pass history object which has push method on it
    history.push("/dashboard")
  } catch (err) {
    // get the errors
    const errors = err.response.data.errors

    // if there are errors we loop through and we output them in an alert
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

// add education

export const addEducation = (formData, history) => async dispatch => {
  try {
    // sending data that's why creating config object with headers object content type: app/json
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    // request to put route that creates education
    const res = await axios.put("/api/profile/education", formData, config)

    // what we are dispatching to our reducer
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data // profile
    })

    // dispatch an alert to match an action
    dispatch(setAlert("Education added", "success"))

    // redicrect action when experience is created
    // to redirect an action you gotta pass history object which has push method on it
    history.push("/dashboard")
  } catch (err) {
    // get the errors
    const errors = err.response.data.errors

    // if there are errors we loop through and we output them in an alert
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}