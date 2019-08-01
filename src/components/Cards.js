import React, { Component } from 'react';
import {
    Card,
    CardMedia,
    CardTitle
  } from 'material-ui/Card'; 
import logoSVG from '../like-black-heart-button.svg';

export default class Cards extends Component {
    componentDidMount() {
        const divPage = document.getElementById('cardcontainer');
        if (divPage) {
          divPage.addEventListener('touchstart', (evt) => {
              const rect = divPage.getBoundingClientRect();
              console.log('touched');
              const pagex = evt.touches[0].clientX - rect.left;
              const pagey = (evt.touches[0].clientY - 250) - rect.top;
              this.props.handleXY(pagex, pagey);
          }, { passive: true });
        }
    }
    componentWillUnmount() {
        console.log('UNMOUNTING MAP CONTAINER');
        const divPage = document.getElementById('cardcontainer');
        if (divPage) {
          divPage.removeEventListener('touchstart', () => {
              console.log('removed touchstart listener in Mapcontainer');
          });
        }
    }

    getSpecies = (speciesKey, species, commonName, fallback) => {
        this.props.getSpecies(speciesKey, species, commonName, fallback); 
    }
    handleLoad = (url, i) => {
        const wrapper = document.getElementsByClassName('cardMediaDivClass')[i];
        window.requestAnimationFrame(() => {
          wrapper.classList.add('loaded');
        });
      }
    render() {
        return (
            <div id="cardcontainer" style={{ listStyleType: 'none', overflow: 'hidden' }}>
            {
              (this.props.stateFromMap) 

              ?

              this.props.stateFromMap.photoUrl.map((url, i) => (
                <Card className="cardui-search" key={[i]}>
                  <div
                    onClick={this.getSpecies.bind(null, this.props.stateFromMap.speciesKey[i], this.props.stateFromMap.species[i], this.props.stateFromMap.commonName[i], this.props.stateFromMap.fallbackPhotos[i])}
                  >
                    <CardMedia>
                      <div className="cardMediaDivClass" style={{ textAlign: 'left' }}>
                          <img
                              className="imageFlicker"
                              src={url}
                              alt="Not found"
                              onLoad={this.handleLoad.bind(null, url, i)}
                          />
                        <CardTitle
                          className="cardtitle"
                          title={(this.props.stateFromMap.commonName[i] === null) ? this.props.stateFromMap.species[i] : this.props.stateFromMap.commonName[i]}
                          subtitle={(this.props.stateFromMap.commonName[i] === null) ? '' : this.props.stateFromMap.species[i]} 
                          titleStyle={{ color: '#474747', lineHeight: '28px' }}
                          subtitleStyle={{
                            color: '#474747',
                            fontWeight: '400',
                            fontSize: '14px',
                            fontFamily: 'Roboto',
                            letterSpacing: '0.25',
                            lineHeight: '28px' }}
                        />
                                            {(this.props.stateFromMap.category[i] === 'Vulnerable' ||
                                              this.props.stateFromMap.category[i] === 'Critically Endangered' ||
                                              this.props.stateFromMap.category[i] === 'Extinct In The Wild' ||
                                              this.props.stateFromMap.category[i] === 'Extinct' ||
                                              this.props.stateFromMap.category[i] === 'Endangered' ||
                                              this.props.stateFromMap.category[i] === 'Near Threatened')
                                              ?
                                              (<div className="conservationstatus">
                                                {this.props.stateFromMap.category[i].toUpperCase()}
                                                <div className="capsule"></div>
                                              </div>)
                                              : ''
                                              }
                      </div>
                    </CardMedia>
                  </div>
                  <div
                    style={{ paddingBottom: '30px' }}
                  >
                    <img
                    indexkey={[i]}
                    className="heartsvg"
                    style={{ float: 'right', paddingRight: '11px', width: '6%' }}
                    onClick={this.props.likeClick}
                    src={logoSVG}
                    alt="heart logo"
                    commonname={`${this.props.stateFromMap.commonName[i]}`}
                    species={`${this.props.stateFromMap.species[i]}`}
                    flicker={url}
                    viewportlngmin={this.props.stateFromMap.viewportLngMin}
                    viewportlngmax={this.props.stateFromMap.viewportLngMax}
                    viewportlatmin={this.props.stateFromMap.viewportLatMin}
                    viewportlatmax={this.props.stateFromMap.viewportLatMax}
                    specieskey={`${this.props.stateFromMap.speciesKey[i]}`}
                    lat={this.props.stateFromMap.lat}
                    lng={this.props.stateFromMap.lng}
                    countrycode={this.props.stateFromMap.countryCode}
                    />
                  </div>
                </Card>
              ))

              :
              
              null
            }
            </div>   
        );
    }
}
