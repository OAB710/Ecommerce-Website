import React from 'react';
import { Navigate } from 'react-router-dom';

const withAuth = (Component) => {
  return (props) => {
    const isAuthenticated = !!localStorage.getItem('auth-token');

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return <Component {...props} />;
  };
};

export default withAuth;