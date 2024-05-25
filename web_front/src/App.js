import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/homePage';
import ProfilePage from './Pages/profilePage';
import LoginPage from './Pages/loginPage';
import Navbar from './Pages/navbar';
import PrivateRoute from './Components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import RegisterPage from './Pages/RegisterPage';
import RentedVehiclesPage from './Pages/RentedVehiclesPage';
import ListVehicle from './Pages/ListVehicle';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/home" element={<PrivateRoute element={HomePage} />}/>
          <Route exact path="/profile" element={<PrivateRoute element={ProfilePage} />}/>
          <Route path="/rented-vehicles" element={<PrivateRoute element={RentedVehiclesPage} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/list-vehicle" element={<PrivateRoute element={ListVehicle} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
