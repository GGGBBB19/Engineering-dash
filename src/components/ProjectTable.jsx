import React from 'react';

const ProjectTable = ({ data, metricType = "CPI" }) => {
  if (!data || data.length === 0) {
    return <p>No project data available</p>;
  }

  // Format movement value
  const formatMovement = (value) => {
    if (typeof value === 'number') {
      // Format with 2 decimal places
      return value.toFixed(2);
    }
    return value;
  };

  return (
    <div className="table-container">
      <table className="project-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>{metricType} Movement</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {data.map((project, index) => {
            const movementValue = metricType === "CPI" ? project.cpiMovement : project.spiMovement;
            return (
              <tr key={index} className={movementValue < 0 ? 'negative' : 'positive'}>
                <td>{project.projectName}</td>
                <td>{formatMovement(movementValue)}</td>
                <td>{project.comment}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;