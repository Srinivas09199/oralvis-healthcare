import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DentistDashboard = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/scans`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setScans(response.data.scans);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (scanId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/pdf/${scanId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });

      // Create a blob from the PDF stream
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link to download the PDF
      const link = document.createElement('a');
      link.href = url;
      link.download = `scan-report-${scanId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download PDF');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (loading) return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="loading">Loading scans...</div>
      </div>
    </div>
  );

  return (
    <div className='dentist-dashboard'>
      <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Dentist Dashboard</h2>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="scans-list">
          <h3>Patient Scans ({scans.length})</h3>
          
          {scans.length === 0 ? (
            <div className="no-scans">
              <p>No scans available. Ask a technician to upload some scans.</p>
            </div>
          ) : (
            <div className="scans-grid">
              {scans.map(scan => (
                <div key={scan.id} className="scan-card">
                  <div className="scan-image">
                    <img src={scan.image_url} alt={`Scan for ${scan.patient_name}`} />
                  </div>
                  
                  <div className="scan-details">
                    <p><strong>Patient:</strong> {scan.patient_name}</p>
                    <p><strong>ID:</strong> {scan.patient_id}</p>
                    <p><strong>Type:</strong> {scan.scan_type}</p>
                    <p><strong>Region:</strong> {scan.region}</p>
                    <p><strong>Uploaded:</strong> {new Date(scan.upload_date).toLocaleDateString()}</p>
                    <p><strong>By:</strong> {scan.uploaded_by_email}</p>
                  </div>
                  
                  <div className="scan-actions">
                    <button 
                      className="view-btn" 
                      onClick={() => window.open(scan.image_url, '_blank')}
                    >
                      View Full Image
                    </button>
                    <button 
                      className="pdf-btn" 
                      onClick={() => downloadPDF(scan.id)}
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default DentistDashboard;