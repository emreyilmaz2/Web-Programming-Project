import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Services/api';
import './ListVehicle.css';

const ListVehicle = () => {
  const navigate = useNavigate();
  const [vehicleData, setVehicleData] = useState({
    brand: '',
    model: '',
    year: '',
    daily_rental_rate: ''
  });
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const loadBrands = async () => {
      const importedBrands = ['bmw', 'audi', 'mercedes','ford','cupra','fiat','honda','hyundai','opel','renault','volkswagen','togg','tesla','toyota']; // Example brands, replace with dynamic loading if necessary
      setBrands(importedBrands);
    };
    loadBrands();
  }, []);

  const handleChange = (e) => {
    setVehicleData({
      ...vehicleData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/list-vehicle/', vehicleData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (response.status === 201) {
        alert('Vehicle listed successfully');
        setVehicleData({
          brand: '',
          model: '',
          year: '',
          daily_rental_rate: ''
        });
        navigate('/home');
      } else {
        alert('Failed to list vehicle');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  return (
    <div className="list-vehicle-container">
      <h2>Yeni Araç İlanı Ver</h2>
      <form onSubmit={handleSubmit} className="vehicle-form">
        <select
          name="brand"
          value={vehicleData.brand}
          onChange={handleChange}
          required
        >
          <option value="">Select Brand</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand.toUpperCase()}</option>
          ))}
        </select>
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={vehicleData.model}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={vehicleData.year}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="daily_rental_rate"
          placeholder="Daily Rental Rate"
          value={vehicleData.daily_rental_rate}
          onChange={handleChange}
          required
        />
        <button type="submit">Araç İlanı Ver</button>
      </form>
    </div>
  );
};

export default ListVehicle;