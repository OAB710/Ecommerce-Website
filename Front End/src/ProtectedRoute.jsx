import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, isAuthenticated, ...rest }) => {
  return isAuthenticated ? (
    React.cloneElement(element, { ...rest })
  ) : (
    <Navigate to="/login" replace /> 
  );
};

export default ProtectedRoute;