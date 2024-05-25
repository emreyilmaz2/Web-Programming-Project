import React, { useEffect, useState, useContext } from 'react';
import api from '../Services/api';
import { AuthContext } from '../contexts/AuthContext';
import './navbar.css';
import { getLogo } from './homePage';

const RentedVehiclesPage = () => {
  const [rentals, setRentals] = useState([]);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchRentedVehicles = async () => {
      if (isAuthenticated) {
        try {
          const response = await api.get('/rented_vehicles/');
          const vehiclesWithLogos = response.data.map(vehicle => {
            const startDate = new Date(vehicle.start_date);
            const endDate = new Date(vehicle.end_date);
            const hoursDiff = Math.abs(endDate - startDate) / 36e5; // Farkı saat cinsinden hesapla

            return {
              ...vehicle,
              logo: getLogo(vehicle.car_details.brand),
              hoursRented: hoursDiff.toFixed(2) // Saat farkını iki ondalık basamakla sınırla
            };
          });
          setRentals(vehiclesWithLogos);
        } catch (error) {
          setError(error.response ? error.response.data.error : 'An error occurred');
        }
      }
    };

    fetchRentedVehicles();
  }, [isAuthenticated]);

  const handleReturn = async (vehicleId) => {
    try {
      const response = await api.post(`/return-vehicle/${vehicleId}/`);
      if (response.status === 200) {
        alert('Vehicle returned successfully');
        // Kiralanan araç listesini güncelle
        const updatedRentals = rentals.filter(rental => rental.id !== vehicleId);
        setRentals(updatedRentals);
      } else {
        alert('Failed to return vehicle');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred. Please try again later.');
    }
  };
  if (!isAuthenticated) {
    return <div>Please log in to view your rented vehicles.</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="rented-vehicles-container">
      <h1 className="rented-vehicles-title">Rented Vehicles</h1>
      <div className="rented-vehicles-list">
        {rentals.map(rental => (
          <div key={rental.id} className="rented-vehicle-item">
            <img src={rental.logo} alt={`${rental.car} logo`} style={{ width: '100px', height: '100px' }} />
            <p><strong>Car:</strong> {rental.car_details.brand}</p>
            <p><strong>Start Date:</strong> {rental.start_date}</p>
            <p><strong>End Date:</strong> {rental.end_date}</p>
            <p><strong>Total Cost:</strong> ${rental.total_cost}</p>
            <p><strong>Hours Rented:</strong> {rental.hoursRented} hours</p>
            <button className="return-button" onClick={() => handleReturn(rental.car_details.id)}>Return Vehicle</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RentedVehiclesPage;