import React from "react";
import { Navigate } from 'react-router-dom'

export default function Protected({ token, children}) {
  // const checkToken = localStorage.getItem("token");
  const checkToken = token;
  if (!checkToken) {
    return <Navigate to="/" replace />
  }
  return children
}