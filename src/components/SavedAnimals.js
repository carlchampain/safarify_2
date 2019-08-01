import React, { Component, Suspense, lazy } from 'react';
import axios from 'axios';
import { fire } from '../firebase';
import { redListKey } from '../firebase/api_keys';
import LoadingContainer from './LoadingContainer';
import SavedAnimalsCards from './SavedAnimalsCards';
import ErrorHandler from './Error';
import NavBarMap from './NavBarMap';

const MapVisible =  lazy(() =>  import('./MapVisible'));


class SavedAnimals extends Component {
  signal = null;
  constructor(props) {
    super(props);
    this.state = {
      indexForXY: null,
      noSavedAnimalsMessage: false,
      deletedCard: false,
      placeFinal: [],
      vernacularNameFinal: [],
      latNameFinal: [],
      flickerUrlFinal: [],
      uniqueKey: [],
      viewportLngMinSaved: null,
      viewportLngMaxSaved: null,
      viewportLatMinSaved: null,
      viewportLatMaxSaved: null,
      speciesKeySaved: [],
      isMapVisible: false,
      lat: null,
      lng: null,
      speciesXY: [],
      animalNameInTitle: 'Loading...',
      showingInfoWindow: false,
      areSightingsLoaded: true,
      areSavedAnimalsLoaded: false,
      isLoading: false,
      hasErrorBoundaries: false,
      clickedSpecie: '',
      isLoadingMap: false,
      countryCode: [],
      isIntro: ''
    };
  }
  componentDidMount() {
    this.dataSnapshotDB();
  }

  componentDidCatch = (error, info) => {
    console.log('componentDidCatch log: ', error, info);
    this.setState({ hasErrorBoundaries: true });
  }

  onClickViewSithingsSaved = (specKey, specie, commonName, i) => {
    this.setState({ isLoadingMap: true });
    this.signal = axios.CancelToken.source();
    const indexForXY = i;
    const { viewportLngMinSaved, viewportLngMaxSaved, viewportLatMinSaved, viewportLatMaxSaved } = this.state;
    const gbifUrl = `https://api.gbif.org/v1/occurrence/search?decimalLatitude=${viewportLatMaxSaved[i]},${viewportLatMinSaved[i]}&decimalLongitude=${viewportLngMinSaved[i]},${viewportLngMaxSaved[i]}&speciesKey=${specKey}&hasCoordinate=true`;
    this.setState({ clickedSpecie: specie })
    axios.get(gbifUrl, {
      cancelToken: this.signal.token,
    }).then((json) => {
      const results = json.data.results;
      const speciesCoordinate = [];
      const dataSetNameArray = [];
      const yearArray = [];
      const resultLength = results.length;
      for (let i = 0; i < resultLength; i++) {
        const speciesXYObj = {
          lat: results[i].decimalLatitude,
          lng: results[i].decimalLongitude
        };
        speciesCoordinate.push(speciesXYObj);
        dataSetNameArray.push(results[i].datasetName || results[i].collectionCode);
        yearArray.push(results[i].year);
        let animalName = '';
        if (commonName === 'Not found') {
          animalName = specie;
        } else {
          animalName = commonName;
        }
        if (i === resultLength - 1) {
          window.requestAnimationFrame(() => {
            this.setState({
              indexForXY,
              speciesXY: speciesCoordinate,
              animalNameInTitle: animalName,
              isSafarifyTitle: false,
              activeDataSetName: dataSetNameArray,
              year: yearArray
            }, () => {
              this.isMapVisible(specie);
            })
          });
        }
      }
    })
    .catch(errorGbif => {
      if (errorGbif.response) {
        console.log(errorGbif.response.data);
        console.log(errorGbif.response.status);
        console.log(errorGbif.response.headers);
      } else if (errorGbif.request) {
        console.log(errorGbif.request);
      } else if (axios.isCancel(errorGbif)) {
        console.log('Request canceled', errorGbif.message);
      } else {
        console.log('Error', errorGbif.message);
      }
      console.log(errorGbif.config);
    });
  }

  onMarkerClickSaved = (marker, e) => {
    this.setState({
      showingInfoWindow: true,
      activeMarker: marker.position,
      activeDataSetName: e.dataSetName,
      year: e.year
    });
  }

  handleIconClick = () => {
    this.setState({
      isMapVisible: false,
      animalNameInTitle: 'Loading...',
      speciesXY: []
    }, this.dataSnapshotDB);
  }

  isMapVisible = (specie) => {
    this.setState({ isMapVisible: true, isLoadingMap: false }, () => {
      import('../modules/MoreInfoOnSpecies').then((module) => {
        module.moreInfoSpecies(specie);
        module.isIntroduced(specie, this.state.countryCode[this.state.indexForXY]);
      });
    });
  }

  deleteCard = (event) => {
    const { keyBinding } = this.state;
    const uid = fire.auth.currentUser.uid;
    const indexKey = event.target.getAttribute("indexkey");
    const postId = keyBinding[indexKey];
    fire.db.ref('users/' + uid + '/saved_cards/' + postId).remove()
      .then(() => {
        this.setState({
          deletedCard: !this.state.deletedCard
        });
      });
    setTimeout(() => {document.getElementsByClassName('divcard')[indexKey].style.display = 'none'}, 400);
  }

  sortObject = (snapFromDbArrFinal, uniqueKeyArr) => {
    snapFromDbArrFinal.sort((a, b) => {
      const firstVar = a.place.replace(/[0-9]/g, '').replace(/^\s+/g, '');
      const secVar = b.place.replace(/[0-9]/g, '').replace(/^\s+/g, '');
      if (firstVar < secVar)
        return -1;
      if (firstVar > secVar)
        return 1;
      return 0;
     });
     this.finalStateUpdate(snapFromDbArrFinal, uniqueKeyArr);
  }
  finalStateUpdate = (snapFromDbArrFinal, uniqueKeyArr) => {
    const keyUniqueFinal = [];
    snapFromDbArrFinal.forEach((elem) => {
      keyUniqueFinal.push(elem.keyBinding);
    });  
    const flickerUrlFinal = [];
    snapFromDbArrFinal.forEach((elem) => {
      flickerUrlFinal.push(elem.flicker_url);
    });
    const placeFinal = []
    snapFromDbArrFinal.forEach((elem) => {
      const parsedPlace = elem.place.replace(/[0-9]/g, '');
      placeFinal.push(parsedPlace);
    });
    const latNameFinal = [];
    snapFromDbArrFinal.forEach((elem) => {
      latNameFinal.push(elem.sci_name);
    });
    const vernacularNameFinal = [];
    snapFromDbArrFinal.forEach((elem) => {
      vernacularNameFinal.push(elem.vernacular_name);
    });
    const viewportLngMinSaved = [];
    snapFromDbArrFinal.forEach((elem) => {
      const toBeParsed = elem.viewport_lng_min;
      viewportLngMinSaved.push(toBeParsed);
    });
    const viewportLngMaxSaved = [];
    snapFromDbArrFinal.forEach((elem) => {
      const toBeParsed = elem.viewport_lng_max;
      viewportLngMaxSaved.push(toBeParsed);
    });
    const viewportLatMinSaved = [];
    snapFromDbArrFinal.forEach((elem) => {
      const toBeParsed = elem.viewport_lat_min;
      viewportLatMinSaved.push(toBeParsed);
    });
    const viewportLatMaxSaved = [];
    snapFromDbArrFinal.forEach((elem) => {
      const toBeParsed = elem.viewport_lat_max;
      viewportLatMaxSaved.push(toBeParsed);
    });
    const speciesKeySaved = [];
    snapFromDbArrFinal.forEach((elem) => {
      const toBeParsed = elem.species_key;
      speciesKeySaved.push(toBeParsed);
    });
    const lat = [];
    snapFromDbArrFinal.forEach((elem) => {
      lat.push(elem.lat_place);
    });
    const lng = [];
    snapFromDbArrFinal.forEach((elem) => {
      lng.push(elem.lng_place);
    });
    let countryCode = [];
    snapFromDbArrFinal.forEach((elem) => {
      countryCode.push(elem.country_code);
    });
    this.setState({
      countryCode,
      placeFinal, 
      latNameFinal,
      vernacularNameFinal,
      flickerUrlFinal,
      uniqueKey: uniqueKeyArr,
      viewportLngMinSaved,
      viewportLngMaxSaved,
      viewportLatMinSaved,
      viewportLatMaxSaved,
      speciesKeySaved,
      lat,
      lng,
      keyBinding : keyUniqueFinal,
      areSavedAnimalsLoaded: true,
      isLoading: false
    });
    window.scrollTo(this.state.pageX, this.state.pageY);
  }

  dataSnapshotDB = () => {
    if (fire.auth.currentUser !== null) {
      this.setState({ isLoading: true });
      const uid = fire.auth.currentUser.uid;
      const uniqueKeyArr = [];

      fire.db.ref('users/' + uid + '/saved_cards/')
        .once("value", function(snapshot) {
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      })

      .then((dataSnapshot) => {
        if (dataSnapshot.val() !== null) {
          const snapFromDB = dataSnapshot.val();
          const snapFromDbArr = Object.keys(snapFromDB).map(function(key) {
            return [key, snapFromDB[key]];
          });
          const snapFromDbArrFinal = [];

          snapFromDbArr.forEach((elem) => {
            snapFromDbArrFinal.push(elem[1]);
          });

          dataSnapshot.forEach((elem) => {
              const keyFromDB = elem.key;
              uniqueKeyArr.push(keyFromDB)
          });
          //CHECK FOR DUPLICATES HERE
          const snapFromDbArrFinalNoDup = [];
          for (let i = 0; i < snapFromDbArrFinal.length; i++) {
            
            if (i>0) {
              for (let j = 0; j < snapFromDbArrFinalNoDup.length; j++) {
                if ((snapFromDbArrFinalNoDup[j].sci_name !== snapFromDbArrFinal[i].sci_name) &&
                    (j === snapFromDbArrFinalNoDup.length-1)) {
                      snapFromDbArrFinalNoDup.push(snapFromDbArrFinal[i]);
                      snapFromDbArrFinalNoDup[i].keyBinding = uniqueKeyArr[i];
                      break;
                } 
                if (snapFromDbArrFinalNoDup[j].sci_name === snapFromDbArrFinal[i].sci_name &&
                    snapFromDbArrFinalNoDup[j].place === snapFromDbArrFinal[i].place) {
                  const postId = uniqueKeyArr[i];
                  fire.db.ref('users/' + uid + '/saved_cards/' + postId).remove()
                    .then(() => {
                      console.log('Deleted dulicates');
                    })
                    .catch(error => console.log('Error while deletind dups:', error));
                  break;
                }
              }
            } else {
              snapFromDbArrFinalNoDup.push(snapFromDbArrFinal[i]);
              snapFromDbArrFinalNoDup[i].keyBinding = uniqueKeyArr[i];
            }
          }
          this.sortObject(snapFromDbArrFinalNoDup, uniqueKeyArr);
        }

        else {
          this.setState({
            noSavedAnimalsMessage: !this.state.noSavedAnimalsMessage,
            areSavedAnimalsLoaded: true,
            isLoading: false
          });
        }
      });
    }
  }

  isIntroduced = async function(specie, countryCode, indexForXY) {
    this.signal = axios.CancelToken.source();
      console.log('yo')
      await axios.get(`https://apiv3.iucnredlist.org/api/v3/species/countries/name/${specie}?token=${redListKey}`, {
        cancelToken: this.signal.token,
      })
        .then(res => {
            console.log(res.data.result);
            const resArr = res.data.result;
            if (resArr.length === 0) {
              document.getElementById('origin').style.display = 'none';
              document.getElementById('origin').previousSibling.style.display = 'none';
            }
            for (let j = 0; j < resArr.length; j++) {
              const elem = resArr[j];
              if(elem.code === countryCode[indexForXY]) {
                console.log('elem => ', elem.origin);
                const resOrigin = elem.origin;

                  document.getElementById('origin').innerHTML = `${resOrigin} to the country`;

                break;
              }  
              if (elem.code !== countryCode[indexForXY] && j === resArr.length-1) {
                document.getElementById('origin').style.display = 'none';
                document.getElementById('origin').previousSibling.style.display = 'none';
              }
            }
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            console.log('Request canceled', error.message);
          }
        })

  }

  //Handle PageX PageY coordinates
  handleXY = (argX, argY) => {
    this.setState({
      pageX: argX,
      pageY: argY
    });
  }
  render() {
    const { 
            noSavedAnimalsMessage,
            isMapVisible,
            animalNameInTitle,
            lat,
            lng,
            activeDataSetName,
            year,
            speciesXY,
            activeMarker,
            showingInfoWindow,
            indexForXY,
            isLoading,
            hasErrorBoundaries,
            clickedSpecie,
            isLoadingMap
          } = this.state;   
    if (hasErrorBoundaries) {
      return (
            <ErrorHandler
              errorMessage={'Something went wrong! Click on the animal icon to try again.'}
            />
      );
    }
    if (isLoading) {
      return <LoadingContainer />;
    } 
    if (isLoadingMap) {
      return (
        <div>
          <NavBarMap title={animalNameInTitle} />
          <LoadingContainer />
        </div>
      );
    }
    if (isMapVisible) {
      return (
      <div>
        <NavBarMap 
          onLeftIconButtonClick={this.handleIconClick}
          title={animalNameInTitle}
        />
        <Suspense fallback={<LoadingContainer isLoading={isMapVisible}/>}>
          <MapVisible
          google={this.props.google}
          lat={lat[indexForXY]}
          lng={lng[indexForXY]}
          speciesXY={speciesXY}
          specie={clickedSpecie}
          activeMarker={activeMarker}
          activeDataSetName={activeDataSetName}
          year={year}
          showingInfoWindow={showingInfoWindow}
          isMapVisible={isMapVisible}
          onMarkerClick={this.onMarkerClickSaved}
          />
        </Suspense> 
      </div>
      );
    }

    if (noSavedAnimalsMessage) {
      return (
        <div className="nosavedcards">
          <h1>No saved animals!</h1>
        </div>
      );
    }
    return (
      <div>
        <div id="saved-animals"><p className="p-saved-explore">Your Saved Animals</p></div>
        <SavedAnimalsCards 
          stateFromSaved={this.state}
          viewSightings={this.onClickViewSithingsSaved}
          delete={this.deleteCard}
          handleXY={this.handleXY}
        />
      </div>  
    );
  }
}
export default SavedAnimals;
