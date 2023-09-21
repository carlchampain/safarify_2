import React from 'react';

const PopUpSearch = (props) => {
    return (
    <div className="popup-search">
    <div id="popup-header">What kind of animals would you like to see in {props.place.replace(/[0-9]/g, '')}?</div>
    <div className="container-filter-search">
        <button type="submit" onClick={props.getMoreSpecific} className="button-popup-search">Mammals</button>    
        <button type="submit" onClick={props.getMoreSpecific} className="button-popup-search">Birds</button>
        <button type="submit" onClick={props.getMoreSpecific} className="button-popup-search">Reptiles</button>
        <button type="submit" onClick={props.getMoreSpecific} className="button-popup-search">Amphibians</button>
        <button type="submit" onClick={props.getMoreSpecific} className="button-popup-search">Insects</button>
        <button type="submit" onClick={props.getMoreSpecific} className="button-popup-search">Arachnids</button>
        <button type="submit" onClick={props.getMoreSpecific} className="button-popup-search">All Results</button>
    </div>    
    </div>
    );
}

export default PopUpSearch;