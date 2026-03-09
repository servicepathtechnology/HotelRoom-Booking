import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, DollarSign, Activity, AlertTriangle } from 'lucide-react';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [leads, setLeads] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic auth check for demo
    const userStr = localStorage.getItem('user');
    if (!userStr || JSON.parse(userStr).role !== 'admin') {
      // In a real app we redirect, for demo we can mock logic
      // navigate('/login');
    }
    
    fetchAdminData();
  }, [navigate]);

  const fetchAdminData = async () => {
    try {
      const [metricsRes, leadsRes, insightsRes] = await Promise.all([
        fetch('http://localhost:8000/api/admin/metrics'),
        fetch('http://localhost:8000/api/admin/leads'),
        fetch('http://localhost:8000/api/ai/insights')
      ]);
      
      const metricsData = await metricsRes.json();
      const leadsData = await leadsRes.json();
      const insightsData = await insightsRes.json();
      
      setMetrics(metricsData);
      setLeads(leadsData);
      setInsights(insightsData);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-state container">Loading Operations Dashboard...</div>;

  return (
    <div className="admin-page container">
      <div className="admin-header">
        <h1>OTA Partner Dashboard</h1>
        <p>Manage listings, track commissions, and monitor platform activity.</p>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrapper bg-blue-100"><DollarSign className="text-blue-600"/></div>
          <div className="metric-info">
            <p className="metric-label">Gross Booking Value</p>
            <h3 className="metric-value">₹{metrics?.total_revenue || '1,24,500'}</h3>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon-wrapper bg-green-100"><Activity className="text-green-600"/></div>
          <div className="metric-info">
            <p className="metric-label">Avg Conversion Rate</p>
            <h3 className="metric-value">{metrics?.occupancy_rate || '4.2%'}</h3>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon-wrapper bg-purple-100"><Users className="text-purple-600"/></div>
          <div className="metric-info">
            <p className="metric-label">New Partner Signups</p>
            <h3 className="metric-value">{metrics?.total_leads || '14'}</h3>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon-wrapper bg-yellow-100"><BarChart3 className="text-yellow-600"/></div>
          <div className="metric-info">
            <p className="metric-label">Active Bookings Today</p>
            <h3 className="metric-value">{metrics?.active_bookings || '342'}</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-grid admin-layout">
        <div className="dashboard-main">
          {/* CRM Leads Table */}
          <section className="dashboard-panel">
            <div className="panel-header">
              <h2>Recent Partner Inquiries</h2>
            </div>
            <div className="panel-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Hotel/Partner Name</th>
                    <th>Email</th>
                    <th>Inquiry Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leads && leads.length > 0 ? leads.map(lead => (
                    <tr key={lead.id}>
                      <td className="font-medium">{lead.name}</td>
                      <td className="text-muted">{lead.email}</td>
                      <td>{lead.interaction_type || 'Listing Approval'}</td>
                      <td>
                        <span className={`status-pill ${(lead.status || 'pending').toLowerCase()}`}>
                          {lead.status || 'Pending'}
                        </span>
                      </td>
                      <td><button className="btn-text">Review</button></td>
                    </tr>
                  )) : (
                    <tr>
                       <td className="font-medium">Taj Exotica Resort</td>
                       <td className="text-muted">contact@taj.com</td>
                       <td>Listing Activation</td>
                       <td><span className="status-pill pending">Pending</span></td>
                       <td><button className="btn-text">Review</button></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="dashboard-sidebar">
           {/* Insights Panel */}
           <section className="dashboard-panel ai-operations-panel">
            <div className="panel-header">
              <h2><AlertTriangle className="text-warning"/> Market Insights</h2>
            </div>
            <div className="panel-body">
              <div className="insight-block">
                <h4>Trending Destination Search</h4>
                <p>{insights?.predicted_busy_days?.join(', ') || 'Goa, Kerala, Himachal'}</p>
              </div>
              <div className="insight-block">
                <h4>Price Alert Needed</h4>
                <p>{insights?.cleaning_schedule || 'Hotels in South Goa are underpriced by 15% for upcoming weekend.'}</p>
              </div>
              <div className="insight-block">
                <h4>Platform Capacity</h4>
                <p className="highlight-text">{insights?.staff_workload || 'Servers running at optimal capacity. Expect search surges tonight.'}</p>
              </div>
              
              <button className="btn btn-outline w-full mt-4">Adjust Commissions</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Admin;
