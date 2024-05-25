import React, { useEffect, useState, useContext } from 'react';
import api from '../Services/api';
import { AuthContext } from '../contexts/AuthContext';
import './homePage.css'; // CSS dosyasını import edin

export const getLogo = (brand) => {
  try {
    return require(`../assets/${brand.toLowerCase()}.png`);
  } catch (error) {
    console.error(`Logo not found for brand: ${brand}`);
    return null; // veya default bir logo döndürebilirsiniz
  }
};

const HomePage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get('/vehicles/');
        const vehiclesWithLogos = response.data.map(vehicle => ({
          ...vehicle,
          logo: getLogo(vehicle.brand) // Markaya göre logoyu ayarla
        }));
        setVehicles(vehiclesWithLogos);
      } catch (err) {
        setError(err.response ? err.response.data.error : 'An error occurred');
      }
    };
    fetchVehicles();
  }, [isAuthenticated]);

  const handleRent = async (vehicleId, isOwner) => {
    if (isOwner) {
      setError('You cannot rent your own vehicle');
      return;
    }

    try {
      const response = await api.post('/rent-vehicle/', {
        vehicle_id: vehicleId,
        start_date: startDate,
        end_date: endDate,
      });
      if (response.status === 201) {
        alert('Vehicle rented successfully');
        setSelectedVehicle(null);
        setStartDate('');
        setEndDate('');
        // Refresh the vehicle list
        const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== vehicleId);
        setVehicles(updatedVehicles);
      } else {
        alert('Failed to rent vehicle');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="vehicle-container">
      <h1 className="vehicle-title">Available Vehicles</h1>
      {error && <p className="vehicle-error-message">{error}</p>}
      <div className="vehicle-cards-container">
        {vehicles.map(vehicle => (
          <div key={vehicle.id} className="vehicle-card">
            <img src={vehicle.logo} alt={`${vehicle.brand} logo`} className="vehicle-card-logo" />
            <div className="vehicle-card-details">
              <h2>{vehicle.brand} {vehicle.model}</h2>
              <p>Year: {vehicle.year}</p>
              <button
                className={vehicle.owner === parseInt(localStorage.getItem('user_id')) ? 'vehicle-button owner' : 'vehicle-button'}
                onClick={() => {
                  if (vehicle.owner === parseInt(localStorage.getItem('user_id'))) {
                    setError('You cannot rent your own vehicle');
                  } else {
                    setSelectedVehicle(vehicle.id);
                  }
                }}
                disabled={vehicle.owner === parseInt(localStorage.getItem('user_id'))}
              >
                {vehicle.owner === parseInt(localStorage.getItem('user_id')) ? 'Your Vehicle' : 'Rent'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedVehicle && (
        <div className="rent-form-container">
          <h2 className="vehicle-title">Rent Vehicle</h2>
          <form className="vehicle-form" onSubmit={(e) => { e.preventDefault(); handleRent(selectedVehicle, vehicles.find(v => v.id === selectedVehicle).owner === parseInt(localStorage.getItem('user_id'))); }}>
            <div className="vehicle-form-group">
              <label className="vehicle-form-label" htmlFor="start_date">Start Date:</label>
              <input
                type="date"
                id="start_date"
                className="vehicle-form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="vehicle-form-group">
              <label className="vehicle-form-label" htmlFor="end_date">End Date:</label>
              <input
                type="date"
                id="end_date"
                className="vehicle-form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <button className="vehicle-button" type="submit">Confirm Rent</button>
            <button className="vehicle-button cancel-button" type="button" onClick={() => setSelectedVehicle(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HomePage;