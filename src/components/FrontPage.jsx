// FrontPage.js - Updated
import React, { useState, useRef } from 'react';
import { read, utils } from 'xlsx';
import './FrontPage.css';

const FrontPage = ({ onDataLoaded, onLogout }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };
  
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  const processFile = async (file) => {
    setIsLoading(true);
    setError('');
    
    // Check if file is an Excel file
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      setError('Please upload an Excel file (.xlsx or .xls)');
      setIsLoading(false);
      return;
    }
    
    setFileName(file.name);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = read(arrayBuffer);
      
      // Check if the required sheets exist
      const requiredSheets = ['FTE trend', 'P&L extract', 'project data'];
      const missingSheets = requiredSheets.filter(sheet => !workbook.SheetNames.includes(sheet));
      
      if (missingSheets.length > 0) {
        setError(`Missing required sheets: ${missingSheets.join(', ')}. Please ensure your Excel file contains the following tabs: FTE trend, P&L extract, and project data.`);
        setIsLoading(false);
        return;
      }
      
      // Process FTE Trend sheet
      const fteTrendSheet = workbook.Sheets['FTE trend'];
      const fteTrendData = utils.sheet_to_json(fteTrendSheet, { header: 1 });
      
      if (fteTrendData.length < 2) {
        setError('FTE trend sheet must contain at least 2 rows: months and FTE values');
        setIsLoading(false);
        return;
      }
      
      const months = fteTrendData[0].slice(1); // First row excluding first cell
      const fteValues = fteTrendData[1].slice(1); // Second row excluding first cell
      
      const fteData = months.map((month, index) => ({
        month: month,
        fte: fteValues[index]
      }));
      
      // Process P&L Extract sheet
      const plExtractSheet = workbook.Sheets['P&L extract'];
      const plExtractData = utils.sheet_to_json(plExtractSheet);
      
      // Process Project Data sheet - Updated to handle headers on row 7
      if (workbook.SheetNames.includes('project data')) {
        const projectDataSheet = workbook.Sheets['project data'];
        
        // Modified to skip to row 7 for headers and row 8 for data
        const jsonData = utils.sheet_to_json(projectDataSheet, { 
          range: 6,  // Start from row 7 (0-indexed as 6)
          header: 1  // Use the first row of this range as headers
        });
        
        // Now the headers are in the first row of jsonData, and data starts from the second row
        if (jsonData.length > 1) { // Make sure we have headers and at least one data row
          const headers = jsonData[0]; // Headers from row 7
          const dataRows = jsonData.slice(1); // Data starting from row 8
          
          // Find the indices of the required columns
          const projectNameIndex = 0; // Column A should be index 0
          const cpiMovementIndex = 19; // Column T should be index 19
          const spiMovementIndex = 20; // Column U should be index 20
          const commentIndex = 23; // Column X should be index 23
          
          // Process project data to get only the columns we need
          const processedProjectData = dataRows.map(row => ({
            projectName: row[projectNameIndex],
            cpiMovement: row[cpiMovementIndex],
            spiMovement: row[spiMovementIndex],
            comment: row[commentIndex]
          })).filter(item => item.projectName); // Remove any rows without a project name
          
          // Data is ready, pass it to the parent component
          onDataLoaded({
            fteTrend: fteData,
            plExtract: plExtractData,
            projectData: processedProjectData
          });
          
          setIsLoading(false);
        } else {
          setError('Project data sheet does not contain enough data');
          setIsLoading(false);
        }
      } else {
        setError('Project data sheet is missing');
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error('Error processing Excel file:', error);
      setError('Error processing Excel file. Please check the file format and try again.');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="front-page">
      <div className="container">
        <div className="header-with-logout">
          <h1>Project Dashboard</h1>
          <button className="logout-button-small" onClick={onLogout}>Logout</button>
        </div>
        <p className="description">
          Upload your Excel file containing the following tabs:
        </p>
        
        <div className="requirements">
          <div className="requirement">
            <div className="icon">📊</div>
            <div className="text">
              <h3>FTE Trend</h3>
              <p>Monthly FTE data with months in row 1 and values in row 2</p>
            </div>
          </div>
          
          <div className="requirement">
            <div className="icon">💰</div>
            <div className="text">
              <h3>P&L Extract</h3>
              <p>Financial performance in tabular format</p>
            </div>
          </div>
          
          <div className="requirement">
            <div className="icon">📋</div>
            <div className="text">
              <h3>Project Data</h3>
              <p>Project details with Name (col A), CPI Movement (col T), SPI Movement (col U), and Comments (col X) starting on row 7</p>
            </div>
          </div>
        </div>
        
        <div 
          className={`upload-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            accept=".xlsx,.xls"
          />
          
          <div className="upload-icon">📁</div>
          <p>Drag & drop your Excel file here or click to browse</p>
          {fileName && <p className="file-name">Selected: {fileName}</p>}
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {isLoading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Processing your file...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FrontPage;