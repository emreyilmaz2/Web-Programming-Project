import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './PrivateRoute.css';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [showMessage, setShowMessage] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
        navigate('/login', { replace: true, state: { from: location } });
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate, location]);

  return isAuthenticated ? (
    <Element {...rest} />
  ) : (
    <div>
      {showMessage && (
        <div>
          <div className="error-message">You need to login to access this page</div>
          <div className="loading-bar-container">
            <div className="loading-bar"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivateRoute;
