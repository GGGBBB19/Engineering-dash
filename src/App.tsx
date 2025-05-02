// App.js - Main application file with login functionality
import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import FrontPage from './components/FrontPage';
import FTETrendChart from './components/FTETrendChart';
import PLTable from './components/PLTable';
import ProjectTable from './components/ProjectTable';
import './App.css';

function App() {
  // Add authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowDashboard(false);
    setData(null);
  };

  const handleDataLoaded = (excelData) => {
    setData(excelData);
    setShowDashboard(true);
  };

  const handleBackToUpload = () => {
    setShowDashboard(false);
    setData(null);
  };

  // Extract top and bottom 5 projects by CPI movement
  const getTopCPIProjects = () => {
    if (!data || !data.projectData) return [];
    
    // Sort by CPI movement (highest first)
    const sortedProjects = [...data.projectData]
      .filter(project => project.cpiMovement !== undefined && project.cpiMovement !== null)
      .sort((a, b) => b.cpiMovement - a.cpiMovement);
    return sortedProjects.slice(0, 5); // Top 5
  };
  
  const getBottomCPIProjects = () => {
    if (!data || !data.projectData) return [];
    
    // Sort by CPI movement (lowest first)
    const sortedProjects = [...data.projectData]
      .filter(project => project.cpiMovement !== undefined && project.cpiMovement !== null)
      .sort((a, b) => a.cpiMovement - b.cpiMovement);
    return sortedProjects.slice(0, 5); // Bottom 5
  };

  // Extract top and bottom 5 projects by SPI movement
  const getTopSPIProjects = () => {
    if (!data || !data.projectData) return [];
    
    // Sort by SPI movement (highest first)
    const sortedProjects = [...data.projectData]
      .filter(project => project.spiMovement !== undefined && project.spiMovement !== null)
      .sort((a, b) => b.spiMovement - a.spiMovement);
    return sortedProjects.slice(0, 5); // Top 5
  };
  
  const getBottomSPIProjects = () => {
    if (!data || !data.projectData) return [];
    
    // Sort by SPI movement (lowest first)
    const sortedProjects = [...data.projectData]
      .filter(project => project.spiMovement !== undefined && project.spiMovement !== null)
      .sort((a, b) => a.spiMovement - b.spiMovement);
    return sortedProjects.slice(0, 5); // Bottom 5
  };

  return (
    <div className="app">
      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} />
      ) : !showDashboard ? (
        <FrontPage onDataLoaded={handleDataLoaded} onLogout={handleLogout} />
      ) : (
        <div className="dashboard">
          <div className="dashboard-header">
            <h1>Project Performance Dashboard</h1>
            <div className="dashboard-actions">
              <button className="back-button" onClick={handleBackToUpload}>
                ← Back to Upload
              </button>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
          
          {data.fteTrend && (
            <div className="dashboard-section">
              <h2>FTE Trend</h2>
              <FTETrendChart data={data.fteTrend} />
            </div>
          )}
          
          {data.plExtract && (
            <div className="dashboard-section">
              <h2>P&L Extract</h2>
              <PLTable data={data.plExtract} />
            </div>
          )}
          
          {data.projectData && (
            <div className="dashboard-section">
              <h2>Project Performance</h2>
              
              <div className="performance-section">
                <h3>CPI Performance</h3>
                <div className="project-tables">
                  <div>
                    <h4>Top 5 Projects (Highest CPI Movement)</h4>
                    <ProjectTable data={getTopCPIProjects()} metricType="CPI" />
                  </div>
                  <div>
                    <h4>Bottom 5 Projects (Lowest CPI Movement)</h4>
                    <ProjectTable data={getBottomCPIProjects()} metricType="CPI" />
                  </div>
                </div>
              </div>
              
              <div className="performance-section">
                <h3>SPI Performance</h3>
                <div className="project-tables">
                  <div>
                    <h4>Top 5 Projects (Highest SPI Movement)</h4>
                    <ProjectTable data={getTopSPIProjects()} metricType="SPI" />
                  </div>
                  <div>
                    <h4>Bottom 5 Projects (Lowest SPI Movement)</h4>
                    <ProjectTable data={getBottomSPIProjects()} metricType="SPI" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;