import React from 'react';

const MobileProgress = ({ value }: IMobileProgressProps) => {
  return <div className="progress progress-md d-sm-none progress-warning">
    <div className="progress-bar progress-bar-striped progress-bar-animated bg-warning" style={{ width: `${value}%` }}>
      <span className="current-tip">{value}%</span>
    </div>
  </div>;
};

interface IMobileProgressProps {
  value: number;
}

export default MobileProgress;