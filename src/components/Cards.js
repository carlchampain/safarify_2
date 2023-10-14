import React, { Component } from 'react';
import {
    Card,
    CardMedia,
    CardTitle,
    CardText
  } from 'material-ui/Card'; 
import logoSVG from '../like-black-heart-button.svg';


export default class Cards extends Component {
    componentDidMount() {
        const divPage = document.getElementById('cardcontainer');
        if (divPage) {
          divPage.addEventListener('touchstart', (evt) => {
              const rect = divPage.getBoundingClientRect();
              const pagex = evt.touches[0].clientX - rect.left;
              const pagey = evt.touches[0].clientY - 250 - rect.top;
              this.props.handleXY(pagex, pagey);
          }, { passive: true });

          // Click event handling for non-touch devices
          divPage.addEventListener('click', (evt) => {
            const rect = divPage.getBoundingClientRect();
            // Calculate the click position relative to the divPage
            const pagex = evt.clientX - rect.left;
            const pagey = evt.clientY - 250 - rect.top;
            this.props.handleXY(pagex, pagey);
          }, { passive: true });
        }
        this.props.dataSnapshotDB().then((val) => this.props.isAnimalLiked(val));   

    }
    componentWillUnmount() {
        const divPage = document.getElementById('cardcontainer');
        if (divPage) {
          divPage.removeEventListener('touchstart', () => {
              console.log('removed touchstart listener in Mapcontainer');
          });
          divPage.removeEventListener('click', () => {
            console.log('removed click listener in Mapcontainer');
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

    ClickableArea= (e, url) => {
        e.stopPropagation();
        window.open(url, '_blank'); // Navigate to the specified URL
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
                          title={(this.props.stateFromMap.commonName[i] === null ? this.props.stateFromMap.species[i] : this.props.stateFromMap.commonName[i].split(' ').map(word => word.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('-')).join(' '))}
                          subtitle={(this.props.stateFromMap.commonName[i] === null ? '' : this.props.stateFromMap.species[i])} 
                          titleStyle={{ color: '#474747' }}
                          subtitleStyle={{
                            color: '#474747',
                            fontWeight: '400',
                            fontSize: '14px',
                            fontFamily: 'Roboto',
                            letterSpacing: '0.25'}}
                        >
                        <CardText className="cardtextstyle">
                        Photo credit © {this.props.stateFromMap.photoOwners[i]} {this.props.stateFromMap.licenseOwners[i] && this.props.stateFromMap.licenseOwners[i].name && (<a className="linkToCC" rel="noopener noreferrer" onClick={(e) => this.ClickableArea(e, this.props.stateFromMap.licenseOwners[i].url)} href="#">{this.props.stateFromMap.licenseOwners[i].name}</a>)}
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
                    place={this.props.stateFromMap.place}
                    photoowner={this.props.stateFromMap.photoOwners[i]}
                    licenseowner={JSON.stringify(this.props.stateFromMap.licenseOwners[i])}
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
