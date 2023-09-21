import React from 'react';

const LoadingContainer = (props) => (
    <div className="spinner">
      <div className="double-bounce1" />
      <div className="double-bounce2" />
    {props.isLoading ? window.scrollTo(0, 0) : null}  
    </div>
);

export default LoadingContainer;
