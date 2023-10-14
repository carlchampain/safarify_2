import React, { Component, Suspense, lazy } from 'react';
import axios from 'axios';
import { fire } from '../firebase';
// import { redListKey } from '../firebase/api_keys';
import LoadingContainer from './LoadingContainer';
import ErrorHandler from './Error';
import NavBarMap from './NavBarMap';
import Autocomplete from './Autocomplete';

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
      isIntro: '',
      placesHolder: [],
      hasRendered: false,
      placeInSearchBar: '',
      gbifOccurence: [],
      activeGbifOccurence: '',
      datasetKey: [],
      listOfAnimals: []
    };
  }
  componentDidMount() {
    this.dataSnapshotDB();
  }

  componentDidCatch = (error, info) => {
    console.log('componentDidCatch log: ', error, info);
    this.setState({ hasErrorBoundaries: true });
  }

  onClickViewSithingsSaved = (specKey, specie, commonName, i, val) => {
    this.setState({ isLoadingMap: true, placeInSearchBar:  val === undefined ? '' : val });
    this.signal = axios.CancelToken.source();
    const indexForXY = i;
    const { listOfAnimals } = this.state;
    const gbifUrl = `https://api.gbif.org/v1/occurrence/search?decimalLatitude=${listOfAnimals[i].viewport_lat_max},${listOfAnimals[i].viewport_lat_min}&decimalLongitude=${listOfAnimals[i].viewport_lng_min},${listOfAnimals[i].viewport_lng_max}&speciesKey=${listOfAnimals[i].species_key}&hasCoordinate=true`;
    this.setState({ clickedSpecie: specie })
    axios.get(gbifUrl, {
      cancelToken: this.signal.token,
    }).then((json) => {
      const results = json.data.results;
      const speciesCoordinate = [];
      const dataSetNameArray = [];
      const yearArray = [];
      const datasetKeyArray = [];
      const gbifOccurenceArray = [];
      const resultLength = results.length;
      for (let i = 0; i < resultLength; i++) {
        const speciesXYObj = {
          lat: results[i].decimalLatitude,
          lng: results[i].decimalLongitude
        };
        speciesCoordinate.push(speciesXYObj);
        dataSetNameArray.push(results[i].datasetName || results[i].collectionCode);
        yearArray.push(results[i].year);
        gbifOccurenceArray.push(results[i].key)
        datasetKeyArray.push(results[i].datasetKey)
        let animalName = '';
        if (commonName === 'Not found' || commonName === 'Null') {
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
              year: yearArray,
              activeGbifOccurence: gbifOccurenceArray,
              datasetKey: datasetKeyArray
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
      activeGbifOccurence: e.gbifOccurence,
      datasetKey: e.datasetKey,
      year: e.year
    });
  }

  handleIconClick = () => {
    this.setState({
      isMapVisible: false,
      animalNameInTitle: 'Loading...',
      speciesXY: []
    }, () => window.scrollTo(this.state.pageX, this.state.pageY));
  }

  isMapVisible = (specie) => {
    this.setState({ isMapVisible: true, isLoadingMap: false }, () => {
      import('../modules/MoreInfoOnSpecies').then((module) => {
        module.moreInfoSpecies(specie);
        module.isIntroduced(specie, this.state.listOfAnimals[this.state.indexForXY].country_code);
      });
    });
  }

  deleteCard = (elem) => (event) => {
    const uid = fire.auth.currentUser.uid;
    const postId = elem;
    fire.db.ref('users/' + uid + '/saved_cards/' + postId).remove()
      .then((postId) => {
        this.setState({
          deletedCard: !this.state.deletedCard
        }, () => console.log('deleted'));
      });
      const updatedListOfAnimals = this.state.listOfAnimals.filter(el => el.keyBinding !== postId)
        this.setState({
          listOfAnimals: updatedListOfAnimals
        })
  }

  sortObject = (snapFromDbArrFinal, uniqueKeyArr) => {
    // console.log("unordered ==> ", snapFromDbArrFinal)
    snapFromDbArrFinal.sort((a, b) => {
      const aPlace = a.place.replace(/[0-9]/g, '').trim();
      const bPlace = b.place.replace(/[0-9]/g, '').trim();
    
      const aVernacularName = a.vernacular_name === "null" ? "" : a.vernacular_name || '';
      const bVernacularName = b.vernacular_name === "null" ? "" : b.vernacular_name || '';
    
      const aSciName = a.sci_name || '';
      const bSciName = b.sci_name || '';
    
      if (aPlace === bPlace) {
        // Compare using both vernacular_name and sci_name
        const aName = aVernacularName || aSciName;
        const bName = bVernacularName || bSciName;
        
        return aName.localeCompare(bName, undefined, { sensitivity: 'base' });
      } else {
        return aPlace.localeCompare(bPlace, undefined, { sensitivity: 'base' });
      }
    });    
        
     this.finalStateUpdate(snapFromDbArrFinal, uniqueKeyArr);
  }

  finalStateUpdate = (snapFromDbArrFinal, uniqueKeyArr) => {
    snapFromDbArrFinal.forEach(elem => elem.place = elem.place.replace(/[0-9]/g, '').trim())
    this.setState({
      areSavedAnimalsLoaded: true,
      isLoading: false,
      listOfAnimals: snapFromDbArrFinal
    });
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
                    .then((postId) => {
                      console.log('Deleted dulicates', postId);
                      const updatedListOfAnimals = this.state.listOfAnimals.filter(el => el.keyBinding !== postId)
                      this.setState({
                        listOfAnimals: updatedListOfAnimals
                      })
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

  // isIntroduced = async function(specie, countryCode, indexForXY) {
  //   this.signal = axios.CancelToken.source();
  //     await axios.get(`https://apiv3.iucnredlist.org/api/v3/species/countries/name/${specie}?token=${redListKey}`, {
  //       cancelToken: this.signal.token,
  //     })
  //       .then(res => {
  //           const resArr = res.data.result;
  //           if (resArr.length === 0) {
  //             document.getElementById('origin').style.display = 'none';
  //             document.getElementById('origin').previousSibling.style.display = 'none';
  //           }
  //           for (let j = 0; j < resArr.length; j++) {
  //             const elem = resArr[j];
  //             if(elem.code === countryCode[indexForXY]) {
  //               const resOrigin = elem.origin;

  //                 document.getElementById('origin').innerHTML = `${resOrigin} to the country`;

  //               break;
  //             }  
  //             if (elem.code !== countryCode[indexForXY] && j === resArr.length-1) {
  //               document.getElementById('origin').style.display = 'none';
  //               document.getElementById('origin').previousSibling.style.display = 'none';
  //             }
  //           }
  //       })
  //       .catch((error) => {
  //         if (axios.isCancel(error)) {
  //           console.log('Request canceled', error.message);
  //         }
  //       })

  // }

  //Handle PageX PageY coordinates
  handleXY = (argX, argY) => {
    this.setState({
      pageX: argX,
      pageY: argY
    });
  }

  updatePISB = () => this.setState({placeInSearchBar: ''})

  render() {
    const { 
            noSavedAnimalsMessage,
            isMapVisible,
            animalNameInTitle,
            activeDataSetName,
            activeGbifOccurence,
            year,
            speciesXY,
            activeMarker,
            showingInfoWindow,
            indexForXY,
            isLoading,
            hasErrorBoundaries,
            clickedSpecie,
            isLoadingMap,
            datasetKey,
            listOfAnimals
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
          title={animalNameInTitle === 'Null' ? clickedSpecie : animalNameInTitle} 
        />
        <Suspense fallback={<LoadingContainer isLoading={isMapVisible}/>}>
          <MapVisible
          google={this.props.google}
          lat={listOfAnimals[indexForXY].lat_place}
          lng={listOfAnimals[indexForXY].lng_place}
          speciesXY={speciesXY}
          specie={clickedSpecie}
          activeMarker={activeMarker}
          activeDataSetName={activeDataSetName}
          activeGbifOccurence={activeGbifOccurence}
          year={year}
          datasetKey={datasetKey}
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
        <Autocomplete 
          placeFinal={this.state.placeFinal} 
          stateFromSaved={this.state}
          viewSightings={this.onClickViewSithingsSaved}
          delete={this.deleteCard}
          handleXY={this.handleXY}
          updatePISB={this.updatePISB}
        />
        
      </div>  
    );
  }
}
export default SavedAnimals;
