// PLTable.js
import React from 'react';

const PLTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No P&L data available</p>;
  }

  // Get all column keys from the first row
  const columns = Object.keys(data[0]);

  // Format currency values (if applicable)
  const formatValue = (value) => {
    if (typeof value === 'number') {
      // Check if it might be a currency value
      if (value > 1000 || value < -1000) {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      }
      // Format percentages if the value is between -1 and 1
      else if (value >= -1 && value <= 1) {
        return new Intl.NumberFormat('en-US', {
          style: 'percent',
          minimumFractionDigits: 1,
          maximumFractionDigits: 2
        }).format(value);
      }
    }
    return value;
  };

  return (
    <div className="table-container">
      <table className="pl-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>{formatValue(row[column])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PLTable;