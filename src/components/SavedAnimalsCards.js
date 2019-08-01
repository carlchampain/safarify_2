import React, { Component, Suspense, lazy } from 'react';
import {
    Card,
    CardMedia,
    CardTitle
  } from 'material-ui/Card';
import LoadingContainer from './LoadingContainer'; 
import logoSvgPurple from '../like-black2-heart-button.svg'; 
import { clickedCloseBtn } from '../modules/MenuSlider';
const ErrorHandler = lazy(() => import('./Error'));  

export default class SavedAnimalsCards extends Component {
  state = {
    hasErrorBoundaries: false
  }
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
    const divPage = document.getElementById('cardcontainer');
    if (divPage) {
      divPage.removeEventListener('touchstart', () => {
          console.log('removed touchstart listener in Mapcontainer');
      });
    }
  }
  componentDidCatch = (error, info) => {
    console.log('componentDidCatch log: ', error, info);
    this.setState({ hasErrorBoundaries: true });
  }
  handleLoadInSaved = (i) => {
    const wrapper = document.getElementsByClassName('cardMediaDivClass')[i];
    window.requestAnimationFrame(() => {
      wrapper.classList.add('loaded');
    });
  }

  viewSightings = (specKey, specie, commonName, i) => {
    clickedCloseBtn();
    this.props.viewSightings(specKey, specie, commonName, i);
  }

    render() {
      const propsState = this.props.stateFromSaved;
      if(this.state.hasErrorBoundaries) {
        return (
          <div>
          <Suspense fallback={<LoadingContainer />}>
              <ErrorHandler
                errorMessage={'Something went wrong! Click on the animal icon to try again.'}
              />
          </Suspense>    
          </div>
        );
      }
        return (
            <div className="upperCardContainer" style={{ postion: 'relative' }}>
              <div id="cardcontainer" style={{ listStyleType: 'none', overflow: 'hidden', paddingBottom: '20px' }}>
                {
                  propsState 

                  ?

                  propsState.latNameFinal.map((elem, i) => {
                    return (
                      <div key={i + 700} className="divcard">
                        <div className="h2savedcards">{(propsState.placeFinal[i] === propsState.placeFinal[i - 1]) ? '' : propsState.placeFinal[i]}</div> 
                        <Card key={[i + 300]} className="cardui">
                          <div
                            onClick={this.viewSightings.bind(null, propsState.speciesKeySaved[i], propsState.latNameFinal[i], propsState.vernacularNameFinal[i], i)}
                          >
                            <CardMedia>
                              <div className="cardMediaDivClass" style={{ textAlign: 'left' }}>
                                <img
        
                                    className="imageFlicker"
                                    src={propsState.flickerUrlFinal[i]}
                                    alt="Not found"
                                    onLoad={this.handleLoadInSaved.bind(null, i)}
                                  />
                                <CardTitle
        
                                  className="cardtitle"
                                  title={(propsState.vernacularNameFinal[i] === 'Not found') ? elem : propsState.vernacularNameFinal[i]}
                                  subtitle={(propsState.vernacularNameFinal[i] === 'Not found') ? '' : elem}
                                  titleStyle={{ color: '#373737', lineHeight: '28px' }}
                                  subtitleStyle={{
                                    color: '#424242',
                                    fontWeight: 400,
                                    fontSize: '14px',
                                    fontFamily: 'Roboto',
                                    letterSpacing: '0.25',
                                    lineHeight: '28px' }}
                                />
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
                            onClick={this.props.delete}
                            src={logoSvgPurple}
                            alt="heart logo"
                            />
                          </div>
                        </Card>
                      </div>
                    );
                  })

                  :

                  null

                }
              </div>
            </div>
            );
    }
}
