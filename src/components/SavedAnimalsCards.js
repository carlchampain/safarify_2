import React, { useEffect, useCallback } from 'react';
import {
    Card,
    CardMedia,
    CardTitle,
    CardText
  } from 'material-ui/Card';

import logoSvgPurple from '../like-black2-heart-button.svg'; 
import { clickedCloseBtn } from '../modules/MenuSlider';


export default function SavedAnimalsCards(props) {
  const propsState = props.stateFromSavedLow;
  const handleXYL = props.handleXYLow;
  const animals = propsState.listOfAnimals;

  const handleTouch = useCallback((evt) => {
      const divPage = document.getElementById('cardcontainer');
      if (divPage && evt.type === 'touchstart'){
        const rect = divPage.getBoundingClientRect();
        const pagex = evt.touches[0].clientX - rect.left;
        const pagey = (evt.touches[0].clientY) - rect.top;
        handleXYL(pagex, pagey);
        props.handleResetSugOnTouchLow();
      }
      if (divPage && evt.type === 'click') {
        const rect = divPage.getBoundingClientRect();
        const pagex = evt.clientX - rect.left;
        const pagey = evt.clientY - 250 - rect.top;
        handleXYL(pagex, pagey);
        props.handleResetSugOnTouchLow();
      }
  }, [handleXYL, props])
    
  useEffect(() => { 
    const divPage = document.getElementById('cardcontainer');
    if (divPage) {
      divPage.addEventListener('touchstart', handleTouch, { passive: true });
      divPage.addEventListener('click', handleTouch, { passive: true });
    }
    return () =>  {
      divPage.removeEventListener('touchstart', handleTouch); 
      divPage.removeEventListener('click', handleTouch); 
    }
  }, [handleTouch])

  const handleLoadInSaved = (i) => {
    const wrapper = document.getElementsByClassName('cardMediaDivClass')[i];
    window.requestAnimationFrame(() => {
      wrapper.classList.add('loaded');
    });
  }

  const viewSightings = (specKey, specie, commonName, i, val) => {
    clickedCloseBtn();
    props.viewSightingsLow(specKey, specie, commonName, i, val);
  }

  const ClickableArea= (e, url) => {
    e.stopPropagation();
    window.open(url, '_blank'); // Navigate to the specified URL
  }

  const filteredSaved = () => {
    let i = 0;
    const filteredPlaces = [];
    const placeArr = animals.map(e => e.place);
    if(props.isFinalValLow) {
      while(placeArr.indexOf(props.inputValLow, i) !== -1) {
        filteredPlaces.push(placeArr.indexOf(props.inputValLow, i));
        i = placeArr.indexOf(props.inputValLow, i)+1; 
      }
      return filteredPlaces;
    }  
  }
  const placeHeader = (i) => {
      let j = i-1
      if(j >= 0) return animals[j].place
      if(j === -1) return 'nope' 
  }

  const arrFilteredSaved = filteredSaved();
  const checkedLatName =  propsState ? animals : [];
  // const checkedPlaceFinal = propsState ? propsState.placeFinal : [];

  return (
     
            <div className="upperCardContainer" style={{ postion: 'relative' }}>
              <div id="cardcontainer" style={{ listStyleType: 'none', overflow: 'hidden', paddingBottom: '20px' }}>
                {
                  !props.isFinalValLow 

                  ?

                  checkedLatName.map((elem, i) => {
                    return (
                      <div key={i + 700} className="divcard">
                        <div className="h2savedcards">{(animals[i].place === placeHeader(i)) ? '' : animals[i].place}</div> 
                        <Card key={[i + 300]} className="cardui">
                          <div
                            onClick={ () => viewSightings(animals[i].species_key, animals[i].sci_name, animals[i].vernacular_name, i)}
                          >
                            <CardMedia>
                              <div className="cardMediaDivClass" style={{ textAlign: 'left' }}>
                                <img
        
                                    className="imageFlicker"
                                    src={animals[i].flicker_url}
                                    alt="Not found"
                                    onLoad={() => handleLoadInSaved(i)}
                                  />
                                <CardTitle
        
                                  className="cardtitle"
                                  title={(animals[i].vernacular_name === 'Null') ? elem.sci_name : animals[i].vernacular_name}
                                  subtitle={(animals[i].vernacular_name === 'Null') ? '' : elem.sci_name}
                                  titleStyle={{ color: '#373737' }}
                                  subtitleStyle={{
                                    color: '#424242',
                                    fontWeight: 400,
                                    fontSize: '14px',
                                    fontFamily: 'Roboto',
                                    letterSpacing: '0.25' }}
                                >
                                  <CardText className="cardtextstyle">
                                    Photo credit © {animals[i].photo_owner} {animals[i].license_owner && (<a className="linkToCC" rel="noopener noreferrer" onClick={(e) => ClickableArea(e, animals[i].license_owner.url)} href="#">{animals[i].license_owner.name}</a>)}
                                  </CardText>
                                </CardTitle>
                              </div>
                            </CardMedia>
                          </div>
                          <div
                            style={{ paddingBottom: '30px' }}
                          >
                            <img
                            indexkey={[i]}
                            className="heartsvginsaved"
                            style={{ float: 'right', paddingRight: '11px', width: '6%' }}
                            onClick={(e) => props.deleteLow(animals[i].keyBinding)(e)}
                            src={logoSvgPurple}
                            alt="heart logo"
                            />
                          </div>
                        </Card>
                      </div>
                    );
                  })

                  :

                  arrFilteredSaved.map((elem, i) => {
                    return (
                      <div key={i + 700} className="divcard">
                        <div className="h2savedcards">{(animals[elem].place === placeHeader(elem)) ? '' : animals[elem].place}</div> 
                        <Card key={[i + 300]} className="cardui">
                          <div
                            onClick={ () => viewSightings(animals[elem].species_key, animals[elem].sci_name, animals[elem].vernacular_name, elem, props.inputValLow)}
                          >
                            <CardMedia>
                              <div className="cardMediaDivClass" style={{ textAlign: 'left' }}>
                                <img
        
                                    className="imageFlicker"
                                    src={animals[elem].flicker_url}
                                    alt="Not found"
                                    onLoad={() => handleLoadInSaved(i)}
                                  />
                                <CardTitle
        
                                  className="cardtitle"
                                  title={(animals[elem].vernacular_name === 'Null') ? animals[elem].sci_name : animals[elem].vernacular_name}
                                  subtitle={(animals[elem].vernacular_name === 'Null') ? '' : animals[elem].sci_name}
                                  titleStyle={{ color: '#373737'}}
                                  subtitleStyle={{
                                    color: '#424242',
                                    fontWeight: 400,
                                    fontSize: '14px',
                                    fontFamily: 'Roboto',
                                      letterSpacing: '0.25'}}
                                >
                                  <CardText className="cardtextstyle">
                                      Photo credit © {animals[elem].photo_owner} {animals[i].license_owner && (<a className="linkToCC" rel="noopener noreferrer" onClick={(e) => ClickableArea(e, animals[i].license_owner.url)} href="#">{animals[i].license_owner.name}</a>)}
                                  </CardText>
                                </CardTitle>  
                              </div>
                            </CardMedia>
                          </div>
                          <div
                            style={{ paddingBottom: '30px' }}
                          >
                            <img
                            indexkey={[i]}
                            className="heartsvginsaved"
                            style={{ float: 'right', paddingRight: '11px', width: '6%' }}
                            onClick={(e) => props.deleteLow(animals[elem].keyBinding)(e)}
                            src={logoSvgPurple}
                            alt="heart logo"
                            />
                          </div>
                        </Card>
                      </div>
                    );
                  })

                }
              </div>
            </div>

    );
}
