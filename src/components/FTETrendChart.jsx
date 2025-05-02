// FTETrendChart.js - Updated version
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FTETrendChart = ({ data }) => {
  // Format data to ensure it's in the right order and convert dates to Apr-25 format
  const processedData = [...data].map(dataPoint => {
    // Handle the date formatting here
    let formattedMonth = dataPoint.month;
    
    // If it's a number (either month number 1-12 or Excel date)
    if (typeof dataPoint.month === 'number') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      // Current year - assume 2025 or get from current date
      const currentYear = new Date().getFullYear();
      const yearSuffix = String(currentYear).slice(-2); // Get last 2 digits
      
      // Simple month number (1-12)
      if (dataPoint.month >= 1 && dataPoint.month <= 12) {
        formattedMonth = `${monthNames[dataPoint.month - 1]}-${yearSuffix}`;
      } 
      // Excel date number
      else {
        const date = new Date(Math.round((dataPoint.month - 25569) * 86400 * 1000));
        const month = date.getMonth();
        const year = date.getFullYear();
        const yearSuffix = String(year).slice(-2);
        formattedMonth = `${monthNames[month]}-${yearSuffix}`;
      }
    }
    // If it's already a string but needs the year suffix
    else if (typeof dataPoint.month === 'string' && !dataPoint.month.includes('-')) {
      const currentYear = new Date().getFullYear();
      const yearSuffix = String(currentYear).slice(-2);
      formattedMonth = `${dataPoint.month}-${yearSuffix}`;
    }
    
    return {
      ...dataPoint,
      month: formattedMonth
    };
  });
  
  // Sort by month and year
  const sortedData = processedData.sort((a, b) => {
    // Extract month and year from formatted string
    const [aMonthStr, aYearStr] = a.month.split('-');
    const [bMonthStr, bYearStr] = b.month.split('-');
    
    const monthOrder = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const aMonthIndex = monthOrder.indexOf(aMonthStr);
    const bMonthIndex = monthOrder.indexOf(bMonthStr);
    
    // If different years, sort by year
    if (aYearStr !== bYearStr) {
      return Number(aYearStr) - Number(bYearStr);
    }
    
    // If same year, sort by month
    return aMonthIndex - bMonthIndex;
  });

  // Remove duplicates
  const uniqueData = [];
  const months = new Set();
  
  sortedData.forEach(dataPoint => {
    if (!months.has(dataPoint.month)) {
      months.add(dataPoint.month);
      uniqueData.push(dataPoint);
    }
  });

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={uniqueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="fte" 
            stroke="#8884d8" 
            name="FTE Count"
            dot={{ r: 6 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FTETrendChart;