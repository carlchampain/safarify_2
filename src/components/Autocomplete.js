import React, { useState, useEffect } from 'react';
import SavedAnimalsCards from './SavedAnimalsCards';

export default function Autocomplete(props) {

    const [inputVal, setInputVal] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isFinalVal, setIsFinalVal] = useState(false)
    const places = props.stateFromSaved.listOfAnimals;
    
    function autocompleteImpl(e) {
        if (document.getElementById("myInput").value.length === 0 && places) {
            setSuggestions(places);
            setInputVal('');
            setIsFinalVal(false);
        } else {
        setInputVal(e.target.value);
        setSuggestions([]);    
        setIsFinalVal(false);    
        }
    }

    function onClickSug(e) {
        document.getElementById("myInput").value = e.target.innerText;
        document.getElementById("suggestionsContainer").style.display = "none";
        setInputVal(e.target.innerText);
        setIsFinalVal(true);
    }

    function handleOnFocus() {
        if (document.getElementById("suggestionsContainer")) document.getElementById("suggestionsContainer").style.display = 'block';
        if (places) {
            setSuggestions(places);
        }
        document.getElementById("myInput").value = '';
        setInputVal('');
        setIsFinalVal(false);
        props.updatePISB();
    }

    function handleResetSugOnTouch() {
        if (document.getElementById("suggestionsContainer")) document.getElementById("suggestionsContainer").style.display = 'none';
    }

    const placeInSB = props.stateFromSaved === undefined ? '' : props.stateFromSaved.placeInSearchBar;
    useEffect(() => {
        if(places){
            const filteredPlaces = places.filter( 
                elem => 
                    elem.place.toLowerCase().substring(0, inputVal.length) === inputVal.toLowerCase() && inputVal.length > 0
            );
            if (filteredPlaces.length > 0) {
                setSuggestions(filteredPlaces);
            }
        } 
        if (placeInSB !== '') {
            setInputVal(props.stateFromSaved.placeInSearchBar)
            setIsFinalVal(true)
            document.getElementById("myInput").value = placeInSB
        }
    }, [places, inputVal, placeInSB, props.stateFromSaved.placeInSearchBar]);

    const removeDuplicates = (suggestions) => Array.from(new Set(suggestions.map(a => a.place)))
        .map(place => {
        return suggestions.find(a => a.place === place)
    })

    const noDupSug = removeDuplicates(suggestions);
    return ( 
        <div className="autocomplete">

                <input 
                    id="myInput" 
                    type="text" 
                    placeholder="Search by places" 
                    onFocus={handleOnFocus}
                    onChange={autocompleteImpl}>
                </input>
                {
                    (suggestions.length > 0 && !isFinalVal)
                    &&
                    <div id="suggestionsContainer">{noDupSug.map((sug, i) => <div className="suggestions" onClick={onClickSug} key={i} value={sug}><strong>{sug.place.substring(0, inputVal.length)}</strong>{sug.place.substring(inputVal.length)}</div>)}</div>
                }

                <SavedAnimalsCards 
                    stateFromSavedLow={props.stateFromSaved}
                    viewSightingsLow={props.viewSightings}
                    deleteLow={props.delete}
                    handleXYLow={props.handleXY}
                    suggestionsLow={suggestions}
                    inputValLow={inputVal}
                    isFinalValLow={isFinalVal}
                    handleResetSugOnTouchLow={handleResetSugOnTouch}
                />

        </div>
    );
}
