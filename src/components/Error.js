import React, { memo } from 'react';

const ErrorHandler = memo(function ErrorHandler(props) {
  return (
    <div
    id="errormessage"
    >
      {props.errorMessage}
    </div>
  );
});

export default ErrorHandler;
