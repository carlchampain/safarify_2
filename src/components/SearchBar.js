import React, { memo } from 'react';

const SearchBar = memo(function SearchBar(props) {

    return (
      <div className="formId">
          <form onSubmit={props.handleSubmit} id="form-wrapper" label="form input">
               <input
                 label="enter location in search bar"
                 type="text"
                 placeholder="Enter a city to find local wildlife!"
                 value={props.value}
                 onChange={props.handleChange}
                 id="searchbar"
                 onFocus={props.handleReset}
               />
          </form>
        </div>
    );    
});

export default SearchBar;
