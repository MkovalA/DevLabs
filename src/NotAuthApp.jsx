import './App.css';
import './components/Login.jsx';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import VertyEmail from './components/VertyEmail';
import ResetPassword from './components/ResetPassword';
import VertyResetPassword from './components/VertyResetPassword';
import { ProtectedRouteLogout } from './components/ProtectedRoutes';

function NotAuthApp() {
  return (
        <Routes>
          <Route element={<ProtectedRouteLogout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/:token" element={<VertyEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/password-reset/:token" element={<VertyResetPassword />} />
          </Route>
        </Routes>
  );
}

export default NotAuthApp;
