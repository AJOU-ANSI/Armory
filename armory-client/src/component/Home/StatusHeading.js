import React from 'react';

export const StatusHeading = ({status}) => (
  <div className="col-md-3 col-6">
    <div className="heading-line color-white big"/>
    <h3 className="status-title">
      {status.label}
    </h3>
    <h1 className="status-value font-weight-light">
      {status.value}
    </h1>
  </div>
);

export default StatusHeading;
