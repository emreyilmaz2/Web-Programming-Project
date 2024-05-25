import React, { useState, useEffect, useContext } from 'react';
import api from '../Services/api'; // Import the Axios instance
import { AuthContext } from '../contexts/AuthContext';
import './profilePage.css'; // CSS dosyasını import edin

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/profile/')
        .then(response => {
          setProfile(response.data);
          setFormData({ username: response.data.username, email: response.data.email });
        })
        .catch(error => {
          console.error('There was an error fetching the profile data!', error);
        });
    }
  }, [isAuthenticated]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.put('/profile/update/', formData)
      .then(response => {
        setProfile(response.data);
        setIsEditing(false);
      })
      .catch(error => {
        console.error('There was an error updating the profile!', error);
      });
  };

  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">Profile Page</h1>
      {isEditing ? (
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-form-group">
            <label className="profile-form-label" htmlFor="name">Name:</label>
            <input
              type="text"
              id="username"
              name="username"
              className="profile-form-input"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="profile-form-group">
            <label className="profile-form-label" htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="profile-form-input"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="profile-form-group">
            <label className="profile-form-label" htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              className="profile-form-input"
              value={formData.password || ''}
              onChange={handleChange}
              autoComplete='false'
            />
          </div>
          <button className="profile-button" type="submit">Save</button>
        </form>
      ) : (
        <div className="profile-info">
          <p>Name: {profile.username}</p>
          <p>Email: {profile.email}</p>
          <button className="profile-button" onClick={handleEdit}>Edit</button>
        </div>
      )}
    </div>
    );
  };
  
  export default ProfilePage;