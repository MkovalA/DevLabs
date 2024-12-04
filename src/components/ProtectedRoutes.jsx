import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axiosConfigurated from './axiosConfig';

async function checkAdmin() {
  const user = await axiosConfigurated.get("/users/0/");
  return user.data.role === "admin";
}

function Auth() {
  const access_token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");
  const isAuth = access_token && refresh_token;
  return isAuth;
}

const ProtectedRouteLogout = () => {
  if (!Auth()) {
    return <Outlet />;
  }
  return <Navigate to="/" replace />;
};

const ProtectedRouteLogin = () => {
  if (!Auth()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export { ProtectedRouteLogin, ProtectedRouteLogout, Auth, checkAdmin };