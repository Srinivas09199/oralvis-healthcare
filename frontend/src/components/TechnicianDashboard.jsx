import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TechnicianDashboard = () => {
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_id: '',
    scan_type: 'RGB',
    region: 'Frontal'
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    const data = new FormData();
    data.append('patient_name', formData.patient_name);
    data.append('patient_id', formData.patient_id);
    data.append('scan_type', formData.scan_type);
    data.append('region', formData.region);
    data.append('scanImage', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/scans/upload`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setMessage('Scan uploaded successfully!');
      setFormData({
        patient_name: '',
        patient_id: '',
        scan_type: 'RGB',
        region: 'Frontal'
      });
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className='technician-dashboard'>
      <div className="dashboard-container">
      <div className="dashboard-content">
        
        <div className="dashboard-header">
          <h2>Technician Dashboard</h2>
          <button className="logout-btn" onClick={handleLogout} disabled={loading}>
            Logout
          </button>
        </div>

        <div className="upload-form">
          <h3>Upload Patient Scan</h3>
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Patient Name:</label>
              <input
                type="text"
                name="patient_name"
                value={formData.patient_name}
                onChange={handleInputChange}
                required
                disabled={loading}
                placeholder="Enter patient's full name"
              />
            </div>
            
            <div className="form-group">
              <label>Patient ID:</label>
              <input
                type="text"
                name="patient_id"
                value={formData.patient_id}
                onChange={handleInputChange}
                required
                disabled={loading}
                placeholder="Enter patient ID"
              />
            </div>
            
            <div className="form-group">
              <label>Scan Type:</label>
              <select
                name="scan_type"
                value={formData.scan_type}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="RGB">RGB</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Region:</label>
              <select
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="Frontal">Frontal</option>
                <option value="Upper Arch">Upper Arch</option>
                <option value="Lower Arch">Lower Arch</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Scan Image (JPG/PNG):</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
                required
                disabled={loading}
              />
            </div>
            
            <button type="submit" className="upload-btn" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Scan'}
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default TechnicianDashboard;