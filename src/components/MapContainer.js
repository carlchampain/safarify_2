import React, { Component, lazy, Suspense } from 'react';
import removeDuplicates from '../modules/RemoveDuplicates';
import getLicenseName from '../modules/Licenses';
import RaisedButton from 'material-ui/FlatButton';
import axios from 'axios';
import { GoogleApiWrapper, Map } from 'google-maps-react';
import LoadingContainer from './LoadingContainer';
//Pop Up window
import PopUp from './PopUp';
//Clouds Animation
import Clouds from './Clouds';
//FIREBASE
import { fire, auth } from '../firebase';
//FLICKER GGM
import { flickerKey, googleMapKey, redListKey } from '../firebase/api_keys';
//CARDS TEST
import Cards from './Cards';
import SearchBar from './SearchBar';
import NavBar from './NavBar';
import logoSvgPurple from '../like-black2-heart-button.svg';
import logoSVG from '../like-black-heart-button.svg';
import { moveUpSearch, aboutClickCSS } from '../modules/CssFunctions';
import NavBarMap from './NavBarMap';
import { clickedCloseBtn } from '../modules/MenuSlider';
import PopUpSearch from './PopUpSearch';
import { clickedCloseBtnFilter } from '../modules/MenuSlider';
const MapVisible =  lazy(() => import('./MapVisible'));
const ErrorHandler = lazy(() => import('./Error'));
const SavedAnimals = lazy(() => import('./SavedAnimals'));
const ComfirmLogIn = lazy(() => import('./forms/ConfirmLogIn'));
const AccountSettings = lazy(() => import('./AccountSettings'));
const AboutPage = lazy(() => import('./About'));
const SignInForm = lazy(() => import('./forms/SignIn'));

const INITIAL_STATE = {
  value: '',
  showPopup: false,
  isSavedAnimals: false,
  place: '',
  counter: 10,
  isMapVisible: false,
  isLoaded: false,
  isLoading: false,
  viewportLngMin: null,
  viewportLngMax: null,
  viewportLatMin: null,
  viewportLatMax: null,
  lat: null,
  lng: null,
  photoUrl: [],
  species: [],
  speciesKey: [],
  speciesXY: [],
  isSafarifyTitle: true,
  animalNameInTitle: 'Loading...',
  speciesArray: [],
  speciesKeyArray: [],
  bottomLoading: false,
  errorHandling: false,
  errorHandlingPlaces: false,
  errorHandlingGbif: false,
  pageX: null,
  pageY: null,
  pageXDesktop: null,
  pageYDesktop: null,
  hasErrorBoundaries: false,
  allResults: [],
  noResultsError: false,
  showingInfoWindow: false,
  activeMarker: null,
  dataSetName: [],
  activeDataSetName: '',
  year: '',
  commonName: [],
  category: [],
  taxonKey: [],
  taxonKeyArray: [],
  isAbout: false,
  isLoggingIn: false,
  logOut: true,
  isAccountSettings: false,
  deleteError: false,
  user: null,
  isAmphRept: false,
  loadingUpdate: false,
  clickedSpecie: '',
  fallbackPhotos: [],
  fallbackPhotosArray: [],
  clickedFallback: null,
  countryCode: '',
  showPopUpSearch: false,
  gbifOccurence: [],
  activeGbifOccurence: '',
  datasetKey: [],
  listOfAnimals: [],
  photoId: [],
  photoOwners: [],
  fallbackPhotoOwner: [],
  fallbackPhotoOwnerArray: [],
  licenseOwners: []
};


class MapContainer extends Component {
  signal = null;
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }
  componentDidMount() {
    
    this.getUserAtInit().then((curUser) => {
      if (curUser === undefined) {
        this.setState({ user: null });
      }
      this.setState({ user: curUser }); 
      //TODO: Is this useful or not?
      // this.dataSnapshotDB().then((val) => this.isAnimalLiked(val));     
    }).catch((error) => this.setState({ user: null }));
    window.requestAnimationFrame(() => this.addClassCloud());
  }

  componentDidCatch = (error, info) => {
    console.log('componentDidCatch log: ', error, info);
    this.setState({ hasErrorBoundaries: true });
  }

  dataSnapshotDB = () => {
    return new Promise((resolve) => {
      if (fire.auth.currentUser !== null) {
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
            snapFromDbArrFinal.forEach((elem, i) => elem.keyBinding = uniqueKeyArr[i])
            
            this.setState({listOfAnimals: snapFromDbArrFinal}, () => {
              console.log("resolved")
              resolve(this.state.listOfAnimals)
            })
          }
        });
      }
    })
  }

  //Make sure the drop down MENU is updated if user is already logged in
  //and user returns to the app (when using Safarify as a PWA, i.e. user has added it to homescreen)
  //We call this function in componentDidMount
  //We're using a promise to make sure that rendering comes first, 
  //then we call setState to update the *already rendered* DOM on the UI
  //Note: If the DOM wasn't rendered on screen, it would throw an error by trying to manipulate a DOM elem not existing yet
  getUserAtInit = () => {
    return new Promise(function (resolve, reject) {
      fire.auth.onAuthStateChanged((user) => {
        if (user) {
          const curUser = user.email;
          resolve(curUser);
        } else {
          reject('Not logged in');
        }
      });
    });
  }

  //Adding a class to the clouds elements in order to animate them
  //Calling the function in ComponentDidMount
  //Passing the function in  window.requestAnimationFrame for a smoother animation
  addClassCloud = () => {
    if(this.state.species.length === 0 && this.state.isLoading === false){
      // const cloudOne = document.getElementsByClassName('x2')[0];
      const cloudTwo = document.getElementsByClassName('x5')[0];
        cloudTwo.classList.add('cloud');
    }
  }

  //This function is called when a user clicks on a card element
  //This function takes 3 arguments: 
  // 1st arg "specKey" => the clicked specie key, a unique ID in GBIF's DB attached to this specific specie (eg "Common Seal" will have a unique key of 653638)
  //2nd arg "specie" => the clicked specie's scientific name
  //3rd arg "commonName" => the specie's common name
  //For the GBIF's API call, we need some pieces of state: viewportLngMin, viewportLngMax, viewportLatMin, viewportLatMax). Plus, the specKey argument.
  //We are sending a "bounding box" with the Max/Min Latitude and Longitude coordinates (for our use case, the bounding box is the defined area of a city).
  //In other words, we are asking GBIF: "Hey, send us the sightings of this animal in this area!"
  //The sightings will be an array of objects containing x,y coordinates (eg, decimalLatitude: 29.585151, decimalLongitude: -98.624632), one object represents one sighting on the map
  //The object also contains other key value pair that are of interests to us, eg, the dataset name and the year
  //We loop through the array of objects and take what we need from each object, to do so, we push the data we want into freshly created arrays
  //Once we are finished with pushing our valuable data into very practical arrays, we can update the state of our component!
  //In our component state, we also set isMapVisible to true in order to render the map with the sightings on the UI
  onClickViewSithings = (specKey, specie, commonName, fallback) => {
    const { viewportLngMin, viewportLngMax, viewportLatMin, viewportLatMax } = this.state;
    const gbifUrl = `https://api.gbif.org/v1/occurrence/search?decimalLatitude=${viewportLatMax},${viewportLatMin}&decimalLongitude=${viewportLngMin},${viewportLngMax}&speciesKey=${specKey}&hasCoordinate=true&year=2000,2025&hasGeospatialIssue=false`;
    this.setState({ isMapVisible: true, isLoaded: false, clickedSpecie: specie, clickedFallback: fallback });
    axios.get(gbifUrl, {
      cancelToken: this.signal.token,
    }).then((json) => {
      const results = json.data.results;
      const speciesCoordinate = [];
      const dataSetNameArray = [];
      const datasetKeyArray = [];
      const gbifOccurenceArray = [];
      const yearArray = [];
      const resultLength = results.length;
      let animalName = '';
      commonName === 'Not found' ? animalName = specie : animalName = commonName;
      if (resultLength === 0) {
        this.setState({
          animalNameInTitle: animalName,
          isSafarifyTitle: false,
          activeDataSetName: dataSetNameArray,
          year: yearArray,
          activeGbifOccurence: gbifOccurenceArray,
          datasetKey: datasetKeyArray
        }, () => {
          import('../modules/MoreInfoOnSpecies').then((module) => {
            module.moreInfoSpecies(specie);
          });
      });
    } else {
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
        if (i === resultLength - 1) {
            this.setState({
              speciesXY: speciesCoordinate,
              animalNameInTitle: animalName,
              isSafarifyTitle: false,
              activeDataSetName: dataSetNameArray,
              activeGbifOccurence: gbifOccurenceArray,              
              year: yearArray,
              gbifOccurence: gbifOccurenceArray,
              datasetKey: datasetKeyArray
            }, () => {
              import('../modules/MoreInfoOnSpecies').then((module) => {
                module.isIntroduced(specie, this.state.countryCode);
                module.moreInfoSpecies(specie);
              });
          });
        }
      }
    }
    }).catch(errorGbif => {
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

  //This function is called when a user clicks on one of the options of the FILTER button
  //The options are are "Birds", "Mammals", "Reptiles", "Amphibians", "All results"
  //getMoreSpecific makes a call to GBIF's API in order to receive only one "class" of animals
  //In other words, the user only wants to see results for either "Birds", "Mammals", "Reptiles", "Amphibians" (or the default "All results") in the area they have chosen previously
  //When a user clicks on one of the options, we pass the event of this click into the function in order to retrieve which option (i.e. which div element) the user clicked on
  //We also clean up the state, make sure it's all nice and empty for the new data coming
  //Finally, we pass in the right query URL in getSpeciesInRadius function call
  getMoreSpecific = (evt) => {
    const { viewportLngMin, viewportLngMax, viewportLatMin, viewportLatMax } = this.state;
    const birds = `https://api.gbif.org/v1/occurrence/search?\
                  decimalLatitude=${viewportLatMax},${viewportLatMin}\
                  &decimalLongitude=${viewportLngMin},${viewportLngMax}\
                  &hasCoordinate=true\
                  &kingdomKey=1\
                  &phylumKey=44\
                  &hasGeospatialIssue=false\
                  &classKey=212\
                  &limit=300`;
    const mammals = `https://api.gbif.org/v1/occurrence/search?\
                  decimalLatitude=${viewportLatMax},${viewportLatMin}\
                  &decimalLongitude=${viewportLngMin},${viewportLngMax}\
                  &hasCoordinate=true\
                  &kingdomKey=1\
                  &phylumKey=44\
                  &hasGeospatialIssue=false\
                  &classKey=359\
                  &limit=300`;
    const reptiles = `https://api.gbif.org/v1/occurrence/search?\
                  decimalLatitude=${viewportLatMax},${viewportLatMin}\
                  &decimalLongitude=${viewportLngMin},${viewportLngMax}\
                  &hasCoordinate=true\
                  &kingdomKey=1\
                  &phylumKey=44\
                  &hasGeospatialIssue=false\
                  &classKey=358\
                  &limit=300`;
    const amphibians = `https://api.gbif.org/v1/occurrence/search?\
                  decimalLatitude=${viewportLatMax},${viewportLatMin}\
                  &decimalLongitude=${viewportLngMin},${viewportLngMax}\
                  &hasCoordinate=true\
                  &kingdomKey=1\
                  &phylumKey=44\
                  &hasGeospatialIssue=false\
                  &classKey=131\
                  &limit=300`;
    const insects = `https://api.gbif.org/v1/occurrence/search?\
                     decimalLatitude=${viewportLatMax},${viewportLatMin}\
                     &decimalLongitude=${viewportLngMin},${viewportLngMax}\
                     &hasCoordinate=true\
                     &kingdomKey=1\
                     &hasGeospatialIssue=false\
                     &classKey=216\
                     &limit=300`;              
    const arachnids = `https://api.gbif.org/v1/occurrence/search?\
                     decimalLatitude=${viewportLatMax},${viewportLatMin}\
                     &decimalLongitude=${viewportLngMin},${viewportLngMax}\
                     &hasCoordinate=true\
                     &kingdomKey=1\
                     &hasGeospatialIssue=false\
                     &classKey=367\
                     &limit=300`;              
    this.setState({
      species: [],
      commonName: [],
      category: [],
      speciesKey: null,
      speciesArray: [],
      speciesKeyArray: [],
      fallbackPhotos: [],
      fallbackPhotosArray: [],
      photoUrl: [],
      photoOwners: [],
      licenseOwners: [],
      photoId: [],
      isLoading: true,
      isLoaded: false,
      counter: 10,
      errorHandling: false,
      showPopUpSearch: false
    }, this.optionsFilterMenu(evt, birds, mammals, reptiles, amphibians, insects, arachnids));
    clickedCloseBtn();
  }

  optionsFilterMenu = (evt, birds, mammals, reptiles, amphibians, insects, arachnids) => {
    if (evt.target.textContent === 'Birds') {
      this.setState({ noResultsError: false, hasErrorBoundaries: false, errorHandlingGbif: false, errorHandling: false, isAmphRept: false });
      setTimeout(() => this.getSpeciesInRadius(birds), 100);
      clickedCloseBtnFilter();
    }
    if (evt.target.textContent === 'Mammals') {
      this.setState({ noResultsError: false, hasErrorBoundaries: false, errorHandlingGbif: false, errorHandling: false, isAmphRept: false });
      setTimeout(() => this.getSpeciesInRadius(mammals), 100);
      clickedCloseBtnFilter();
    }
    if (evt.target.textContent === 'Reptiles') {
      this.setState({ noResultsError: false, hasErrorBoundaries: false, errorHandlingGbif: false, errorHandling: false, isAmphRept: true });
      setTimeout(() => this.getSpeciesInRadius(reptiles), 100);
      clickedCloseBtnFilter();
    }
    if (evt.target.textContent === 'All Results') {
      this.setState({ noResultsError: false, hasErrorBoundaries: false, errorHandlingGbif: false, errorHandling: false, isAmphRept: false });
      setTimeout(() => this.getSpeciesInRadius(this.state.allResults), 100);
      clickedCloseBtnFilter();
    }
    if (evt.target.textContent === 'Amphibians') {
      this.setState({ noResultsError: false, hasErrorBoundaries: false, errorHandlingGbif: false, errorHandling: false, isAmphRept: true });
      setTimeout(() => this.getSpeciesInRadius(amphibians), 100);
      clickedCloseBtnFilter();
    }
    if (evt.target.textContent === 'Insects') {
      this.setState({ noResultsError: false, hasErrorBoundaries: false, errorHandlingGbif: false, errorHandling: false, isAmphRept: true });
      setTimeout(() => this.getSpeciesInRadius(insects), 100);
      clickedCloseBtnFilter();
    }
    if (evt.target.textContent === 'Arachnids') {
      this.setState({ noResultsError: false, hasErrorBoundaries: false, errorHandlingGbif: false, errorHandling: false, isAmphRept: true });
      setTimeout(() => this.getSpeciesInRadius(arachnids), 100);
      clickedCloseBtnFilter();
    }
  }

  //This function is called in fetchPlaces (the user enters/chooses the city in which she/he wants to exlpore wildlife 
  //This is also the function that is called in getMoreSpecific for the options in FILTER drop down menu
  //It takes in one argument: the query URL for GBIF's API call
  getSpeciesInRadius = (allresults) => { 
    document.getElementsByTagName('body')[0].style.background = '#eef3f9';
    // let menu = document.getElementsByClassName("sidenav")[1];
    // window.requestAnimationFrame(() => menu.className = "sidenav"); 
    const { counter } = this.state;
    this.signal = axios.CancelToken.source();
    axios.get(allresults, {
      cancelToken: this.signal.token,
    }).then((res) => {
      const gbif = removeDuplicates(res.data.results, 'species');
      const taxonKeyArray = [];
      const speciesArray = [];
      const speciesKeyArray = [];
      const fallbackPhotosArray = [];
      const fallbackPhotoOwnerArray = [];
      const GbifResults = gbif.length;
      if (GbifResults === 0) {
        this.setState({
          noResultsError: true,
          isLoading: false
        }, moveUpSearch("visible", "moveUp"));
      }
      for (let i = 0; i < GbifResults; i++) {
        if (gbif[i].species !== undefined) {
          speciesArray.push(gbif[i].species);
          speciesKeyArray.push(gbif[i].speciesKey);
          taxonKeyArray.push(gbif[i].taxonKey);
          fallbackPhotosArray.push((gbif[i].media.length === 0 ? null : gbif[i].media[0].identifier));
          fallbackPhotoOwnerArray.push((gbif[i].media.length === 0 ? "Unknown" : (gbif[i].media[0].rightsHolder === undefined ? gbif[i].media[0].publisher : gbif[i].media[0].rightsHolder)));
        }
      }
        this.setState({
          isLoaded: false,
          species: speciesArray.slice(0, counter),
          speciesKey: speciesKeyArray.slice(0, counter),
          taxonKey: taxonKeyArray.slice(0, counter),
          fallbackPhotos: fallbackPhotosArray.slice(0, counter),
          fallbackPhotosArray,
          fallbackPhotoOwner: fallbackPhotoOwnerArray.slice(0, counter),
          fallbackPhotoOwnerArray,
          speciesArray,
          speciesKeyArray,
          taxonKeyArray,
          commonName: [],
          loadingUpdate: true
        });
      if (GbifResults > 0) {
        this.vernacularName()
          .then(() => this.flickerCall())
            // .then(() => this.redListCall())
      }
    }).catch(errorGbif => {
        if (errorGbif.response) {
          console.log(errorGbif.response.data);
          console.log(errorGbif.response.status);
          console.log(errorGbif.response.headers);
          this.setState({ isLoaded: false, isLoading: false, errorHandlingGbif: true });
        } else if (errorGbif.request) {
          console.log(errorGbif.request);
          this.setState({ isLoaded: false, isLoading: false, errorHandlingGbif: true });
        } else if (axios.isCancel(errorGbif)) {
          console.log('Request canceled', errorGbif.message);
          this.setState({ isLoaded: false, isLoading: false });
        } else {
          console.log('Error', errorGbif.message);
          this.setState({ isLoaded: false, isLoading: false, errorHandlingGbif: true });
        }
      });
  }

  //Function to GET the common names of animals using the species' taxon key 

  vernacularName = async function () {
    const { species, taxonKey, commonName, counter, isAmphRept } = this.state;
    const commonNameArray = [];
    this.signal = axios.CancelToken.source();
    const requests = [];
  
    for (let i = counter - 10; i < species.length; i++) {
      const request = axios.get(`https://api.gbif.org/v1/species/${taxonKey[i]}/vernacularNames`, {
        cancelToken: this.signal.token,
      });
  
      requests.push(request);
    }
  
    try {
      const responses = await axios.all(requests);
      responses.forEach((response, i) => {
        const vernName = response.data.results;
        let foundName = null;
  
        for (let j = 0; j < vernName.length; j++) {
          const source = vernName[j].source;
          const language = vernName[j].language;
  
          if (
            ((isAmphRept &&
              (source === 'Catalogue of Life Checklist' ||
                source === 'Taxonomy in Flux Checklist' ||
                source === 'Integrated Taxonomic Information System (ITIS)' ||
                source === 'Multilingual IOC World Bird List, v13.2' ||
                source === 'The Clements Checklist' ||
                source === 'Colaboraciones Americanas Sobre Aves' ||
                source === 'The Paleobiology Database' ||
                source === 'NCBI Taxonomy' ||
                source === 'Global Invasive Species Database' ||
                source === 'Yanayacu Natural History Research Group'||
                source === 'Colaboraciones Americanas Sobre Aves'||
                source === 'Belgian Species List') &&
              language === 'eng') ||
            (!isAmphRept &&
              ((source === 'Catalogue of Life Checklist' ||
                source === 'Taxonomy in Flux Checklist' ||
                source === 'Yanayacu Natural History Research Group'||
                source === 'Colaboraciones Americanas Sobre Aves'||
                source === 'Integrated Taxonomic Information System (ITIS)' ||
                source === 'Multilingual IOC World Bird List, v13.2' ||
                source === 'The Clements Checklist' ||
                source === 'Colaboraciones Americanas Sobre Aves' ||
                source === 'The Paleobiology Database' ||
                source === 'NCBI Taxonomy' ||
                source === 'EUNIS Biodiversity Database') &&
                language === 'eng')))
          ) {
            foundName = vernName[j].vernacularName;
            break;
          }
        }
  
        if (!foundName) {
          commonNameArray.push(null);
        } else {
          commonNameArray.push(foundName);
        }
  
        // Check if all requests have been processed
        if (commonNameArray.length === species.length - (counter - 10)) {
          this.setState(
            {
              commonName: commonName.concat(commonNameArray)
            },
            this.loopForFallback
          );
        }
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
      } else {
        commonNameArray.push(null);
        this.setState(
          {
            commonName: commonName.concat(commonNameArray)
          },
          this.loopForFallback
        );
      }
    }
  };
  

  loopForFallback = () => {
    for(let j=this.state.counter-10; j<this.state.commonName.length; j++) {
          if(this.state.commonName[j] === null) {
            const index = j;
            this.fallbackVernName(index);
          } 
        }
  }

  fallbackVernName = async function(index) {
    const { species } = this.state;
    this.signal = axios.CancelToken.source();
      await axios.get(`https://apiv3.iucnredlist.org/api/v3/species/${species[index]}?token=${redListKey}`, {
        cancelToken: this.signal.token,
      }).then(res => {
        this.removeNotFound(res, index)
      })
      .catch(error => {
        console.log(error);
      });
  }

  removeNotFound = (res, index) => {
        const fallbackComName = res.data.result[0].main_common_name;
        const copyOfComName = this.state.commonName;
        copyOfComName.splice(index, 1, fallbackComName)
        this.setState({ commonName: copyOfComName });

  }


  // redListCall = async function() {
  //   const { species, counter, category, speciesArrLength, speciesLength } = this.state;
  //   const categoryArray = [];
  //   this.signal = axios.CancelToken.source();
  //   const requestPromises = [];
  //   for (let i = counter - 10; i < species.length; i++) {
  //     requestPromises.push(
  //       axios.get(`https://apiv3.iucnredlist.org/api/v3/species/${species[i]}?token=${redListKey}`, {
  //         cancelToken: this.signal.token,
  //       })
  //     );
  //   }
  
  //   try {
  //     const responses = await axios.all(requestPromises);
  //     console.log("res ==> ", responses, counter)
  //     responses.forEach((res, i) => {
  //       console.log("category ==> ", res, i)
  //       if (res.data.result.length === 0) {
  //         categoryArray.push('Unknown');
  //       } else {
  //         const responseCategory = res.data.result[0].category;
  //         switch (responseCategory) {
  //           case 'VU':
  //             categoryArray.push('Vulnerable');
  //             break;
  //           case 'CR':
  //             categoryArray.push('Critically Endangered');
  //             break;
  //           case 'EW':
  //             categoryArray.push('Extinct In The Wild');
  //             break;
  //           case 'EX':
  //             categoryArray.push('Extinct');
  //             break;
  //           case 'EN':
  //             categoryArray.push('Endangered');
  //             break;
  //           case 'NT':
  //             categoryArray.push('Near Threatened');
  //             break;
  //           default:
  //             categoryArray.push('Unknown');
  //         }
  //       }
  
  //       if (i === counter - 1 || speciesArrLength === speciesLength) {
  //         this.setState({
  //           category: category.concat(categoryArray),
  //           counter: counter + 10
  //         });
  //       }
  //     });
  //   } catch (error) {
  //     if (axios.isCancel(error)) {
  //       console.log('Request canceled', error.message);
  //     }
  //     const err = '';
  //     categoryArray.push(err);
  //     this.setState({
  //       category: category.concat(categoryArray),
  //       counter: counter + 10
  //     });
  //   }
  // }
  

  loadMore = () => {
    //TODO: Maybe use concat method instead od slice? see flickerCall !!!
    const { counter, speciesArray, speciesKeyArray, taxonKeyArray, fallbackPhotosArray, fallbackPhotoOwnerArray } = this.state;
    this.setState({
      bottomLoading: true,
      species: speciesArray.slice(0, counter),
      speciesKey: speciesKeyArray.slice(0, counter),
      taxonKey: taxonKeyArray.slice(0, counter),
      fallbackPhotos: fallbackPhotosArray.slice(0, counter),
      fallbackPhotoOwner: fallbackPhotoOwnerArray.slice(0, counter)
    }, this.loadMoreStatusAndName);
  }

  loadMoreStatusAndName = () => {
    this.vernacularName()
      .then(() =>  this.flickerCall()
        // .then(() => this.redListCall())
          .then(() => this.dataSnapshotDB()
            .then((val) => this.isAnimalLiked(val))))
  }

  //When user clicks on left arrow when map is visible
  handleIconClick = () => {
    // this.dataSnapshotDB().then((val) => this.isAnimalLiked(val));
      this.setState({
        isMapVisible: false,
        isLoaded: true,
        animalNameInTitle: 'Loading...',
        speciesXY: []
      }, this.leftIconSearchBarCSS);
  }

  leftIconSearchBarCSS = () => {
    const { pageX, pageY } = this.state;
    moveUpSearch("visible", "moveUp");
    window.scrollTo(pageX, pageY);
  }

  isAnimalLiked = (val) => {
      const species = this.state.species; 
      const place =  this.state.place;
      const animalsFromDb = val;
      for (let i = 0; i < species.length; i++) {
        for (let j = 0; j < animalsFromDb.length; j++) {
          if (species[i] === animalsFromDb[j].sci_name && place === animalsFromDb[j].place) {
            document.getElementsByClassName('heartsvg')[i].src = logoSvgPurple;
            break;
          }
        }
      }
  }

  //When user clicks on the animal icon, it resets everything
  handleTitleClick = () => {
    //, listOfAnimals: animals
    window.scrollTo(0, 0);
    if (this.signal) {
      this.signal.cancel('Api is being canceled');
    }
    moveUpSearch("hidden", "fakeClass");
    if (this.state.user !== null) {
      // this.isAnimalLiked();
      this.setState({...INITIAL_STATE, user: fire.auth.currentUser.email }, this.handleReset);
    } else {
        this.setState({...INITIAL_STATE}, this.handleReset);
    }    
  }

  //When user clicks on markers on the map
  //It displays more info about the sighting: year and dataset's name
  onMarkerClick = (marker, e) => {
      this.setState({
        showingInfoWindow: true,
        activeMarker: marker.position,
        activeDataSetName: e.dataSetName,
        year: e.year,
        activeGbifOccurence: e.gbifOccurence,
        datasetKey: e.datasetKey,
        link: e.occurrenceID
      });
  }

  notVisible = () => {
    this.setState({showingInfoWindow: false})
  }

  // NEW MORE PERF CODE
  buildFlickrUrl = function(photo) {
    const { farm, server, id, secret } = photo;
    return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_z.jpg`;
  };
  
  fetchFlickrPhoto = function(speciesName, signalToken) {
    const flickrURL = `https://api.flickr.com/services/rest/?method=flickr.photos.search&text=${speciesName}&api_key=${flickerKey}&per_page=1&format=json&sort=relevance&nojsoncallback=?&license=1,2,3,4,5,6,7,8,9,10`;
    return axios.get(flickrURL, { cancelToken: signalToken });
  };
  
  fetchOwnerInfo = function(photoId, signalToken) {
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${flickerKey}&photo_id=${photoId}&format=json&nojsoncallback=1`;
    return axios.get(url, { cancelToken: signalToken })
  };

  flickerCall = async function() {
    this.signal = axios.CancelToken.source();
    const { counter } = this.state;
    const flickerState = {
      isLoaded: true,
      isLoading: false,
      bottomLoading: false,
    };
  
    try {
      const photoPromises = this.state.species.slice(this.state.counter - 10, this.state.counter)
                                .map(speciesName => this.fetchFlickrPhoto(speciesName, this.signal.token));
      const flickrResponses = await axios.all(photoPromises);
  
      const photoUrlArray = [];
      const photoIdArray = [];
  
      flickrResponses.forEach((res, index) => {
        if (res.data.photos.photo.length > 0) {
          const photo = res.data.photos.photo[0];
          photoUrlArray.push(this.buildFlickrUrl(photo));
          photoIdArray.push(photo.id);
          if ((this.state.counter - 10 + index) === this.state.species.length - 1) {
            this.setState({
              photoUrl: this.state.photoUrl.concat(photoUrlArray),
              photoId: this.state.photoId.concat(photoIdArray),
              loadingUpdate: false, 
              ...flickerState 
            }, () => {
              moveUpSearch("visible", "moveUp");
              this.fetchOwnerPhoto(counter);
            });
          }
        } else {
          photoUrlArray.push(this.state.fallbackPhotos[this.state.counter - 10 + index]);
          photoIdArray.push("0");
          if ((this.state.counter - 10 + index) === this.state.species.length - 1) {
            this.setState({
              photoUrl: this.state.photoUrl.concat(photoUrlArray),
              photoId: this.state.photoId.concat(photoIdArray),
              loadingUpdate: false, 
              ...flickerState 
            }, () => {
              moveUpSearch("visible", "moveUp");
              this.fetchOwnerPhoto(counter);
            });
          }
        }
      });
    } catch (error) {
      console.log('Request canceled', error.message);
      this.setState({ errorHandling: true });
    }
  }
  
  fetchOwnerPhoto = async function(counter) {
    this.signal = axios.CancelToken.source();
    const ownerArray = [];
    const licenseArray = [];
    try {
      const ownerPromises = this.state.photoId.slice(counter - 10, counter)
                               .map(photoId => this.fetchOwnerInfo(photoId, this.signal.token));
      const ownerResponses = await axios.all(ownerPromises);
      
      ownerResponses.forEach((response, index) => {
        if (response.data.stat === 'ok') {
          const ownerData = response.data.photo.owner;
          const license = getLicenseName(response.data.photo.license);
          const ownerName = ownerData.realname || ownerData.username;
          licenseArray.push(license);
          ownerArray.push(ownerName);
        } else {
          console.log(`Error in response at index ${index}:`, response.message || 'Unknown error');
          console.log('counter ==> ', this.state.fallbackPhotoOwner[this.state.counter - 10 + index], this.state.fallbackPhotoOwner)
          ownerArray.push(this.state.fallbackPhotoOwner[this.state.counter - 10 + index] === undefined ? 'Unknown' : this.state.fallbackPhotoOwner[this.state.counter - 10 + index])
          licenseArray.push(this.state.fallbackPhotoOwner[this.state.counter - 10 + index] === ('Unknown' || undefined) ? {name: '', url:''} : {name: 'CC BY-NC', url:'https://creativecommons.org/licenses/by-nc/4.0/'})
        }
      });
      this.setState({
        photoOwners: this.state.photoOwners.concat(ownerArray),
        licenseOwners: this.state.licenseOwners.concat(licenseArray),
        counter: counter + 10
      });
  
    } catch (error) {
      console.log('Error in catch fetchOwnerPhoto: ', error.message);
      licenseArray.push({name: '', url:''});
      ownerArray.push("Unknown");
    }
  }
  

  //When user clicks on one of the suggestions from google places API
  fetchPlaces = (mapProps) => {
    const { google } = mapProps;
    const input = document.getElementById('searchbar');
    if (input) {
      const options = {
                        types: ["(cities)"]
                      };
      const autocomplete = new google.maps.places.Autocomplete(input, options);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        let countryCode = '';
        try {
        // if(place.address_components !== undefined) {
          for (let index = 0; index < place.address_components.length; index++) {
            const element = place.address_components[index];
            if(element.types[0] === 'country') {  countryCode = element.short_name; }
          }
        // }
        const formattedAdress = autocomplete.getPlace().formatted_address;
        
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const viewportLngMin = place.geometry.viewport.getSouthWest().lng(); 
          const viewportLngMax = place.geometry.viewport.getNorthEast().lng();
          const viewportLatMin = place.geometry.viewport.getNorthEast().lat();
          const viewportLatMax = place.geometry.viewport.getSouthWest().lat();

          this.fetchSightingsAfterPlace(viewportLatMax, viewportLatMin, viewportLngMin, viewportLngMax, countryCode, formattedAdress, lat, lng);
        } catch (e) {
          console.log(e);
          this.setState({ errorHandlingPlaces: true });
        }
      });
    }
  }

  fetchSightingsAfterPlace = (viewportLatMax, viewportLatMin, viewportLngMin, viewportLngMax, countryCode, formattedAdress, lat, lng) => {
    const allResults = `https://api.gbif.org/v1/occurrence/search?\
    decimalLatitude=${viewportLatMax},${viewportLatMin}\
    &decimalLongitude=${viewportLngMin},${viewportLngMax}\
    &hasCoordinate=true\
    &kingdomKey=1\
    &hasGeospatialIssue=false\
    &classKey=359&classKey=358&classKey=212&classKey=131&classKey=216&classKey=367\
    &limit=300`;
      this.setState({
      countryCode,
      place: formattedAdress,
      counter: 10,
      isLoaded: false,
      // isLoading: true,
      isLoading: false,
      isLoggingIn: false,
      errorHandling: false,
      errorHandlingPlaces: false,
      errorHandlingGbif: false,
      viewportLngMin,
      viewportLngMax,
      viewportLatMin,
      viewportLatMax,
      lat,
      lng,
      photoUrl: [],
      photoOwners: [],
      photoId: [],
      allResults,
      noResultsError: false,
      commonName: [],
      category: [],
      species: [],
      speciesArray: [],
      fallbackPhotos: [],
      fallbackPhotosArray: [],
      speciesKeyArray: [],
      speciesKey: [],
      speciesXY: [],
      value: formattedAdress,
      isAmphRept: false,
      showPopUpSearch: true
      });   
    moveUpSearch("hidden", "fakeClass");
  }

  homeClickApp = () => {
    this.setState({
      animalNameInTitle: 'Loading...',
      isAbout: false,
      isLoggingIn: false,
      isSavedAnimals: false,
      hasErrorBoundaries: false,
      errorHandlingGbif: false,
      errorHandling: false,
      noResultsError: false,
      isLoading: false,
      errorHandlingPlaces: false,
      isAccountSettings: false,
      deleteError: false
      // showPopUpSearch: false
    }, this.homeClickAppCSS);
  }

  searchClick = () => {
    // this.dataSnapshotDB().then((val) => this.isAnimalLiked(val));
    this.setState({
      animalNameInTitle: 'Loading...',
      isAbout: false,
      isLoggingIn: false,
      isSavedAnimals: false,
      errorHandlingPlaces: false,
      isAccountSettings: false,
      deleteError: false,
      showPopUpSearch: false,
      noResultsError: false,
      hasErrorBoundaries: false, 
      errorHandlingGbif: false, 
      errorHandling: false
    }, this.homeClickAppCSS);
  }

  homeClickAppCSS = () => {
    const { pageX, pageY } = this.state;
    if (this.state.photoUrl.length > 0) {
        moveUpSearch("visible", "moveUp");
        window.scrollTo(pageX, pageY);
    } else aboutClickCSS();  
    if (this.state.commonName.length === 0 && !this.state.isLoading) {
      this.setState({value: ''});
    } 
    window.requestAnimationFrame(() => clickedCloseBtn());
    // if(document.getElementsByClassName('x2')[0]) 
    window.requestAnimationFrame(() => this.addClassCloud());
  }

  aboutClickApp = () => {
    this.setState({
      isAbout: true,
      isLoggingIn: false,
      isSavedAnimals: false,
      isAccountSettings: false,
      deleteError: false,
      showPopUpSearch: false
    }, () => aboutClickCSS());
  }

  logOutClickAppjs = () => {
    auth.doSignOut()
      .then(() => {
          this.setState({
            isSavedAnimals: false,
            isLoggingIn: true,
            logOut: true,
            isLoading: false,
            noResultsError: false,
            isAccountSettings: false,
            animalNameInTitle: 'Loading...',
            hasErrorBoundaries: false,
            errorHandling: false,
            deleteError: false,
            errorHandlingGbif: false,
            user: null
          }, () => aboutClickCSS()); 
      });
  }

  hasClickedOnLogIn = () => {
      this.setState({ isLoggingIn: true, isAbout: false, isSavedAnimals: false, isAccountSettings: false, showPopUpSearch: false }, () => aboutClickCSS());
  }

  hasClickedSignIn = () => {
    this.setState({ user: fire.auth.currentUser.email });
    this.homeClickApp();
  }

  
  likeClick = (event) => {
    // (user && !(document.getElementsByClassName('heartsvg')[indexKey].src.includes("like-black2-heart-button")))
    const user = fire.auth.currentUser;
    const indexKey = event.target.getAttribute('indexkey');
    const animals = this.state.listOfAnimals;
    let postId;
    if (user && document.getElementsByClassName('heartsvg')[indexKey].src.includes("like-black2-heart-button")) {
      const uid = user.uid;
      const latName = event.target.getAttribute('species');
      const place = event.target.getAttribute('place');
        for (let j = 0; j < animals.length; j++) {
          if (latName === animals[j].sci_name && place === animals[j].place) {
            postId = animals[j].keyBinding;
            break;
          }
        }
      fire.db.ref('users/' + uid + '/saved_cards/' + postId).remove()
        .then((postId) => {
          this.setState({
            deletedCard: !this.state.deletedCard
          }, () => console.log('deleted'));
        });
        const updatedListOfAnimals = this.state.listOfAnimals.filter(el => el.keyBinding !== postId)
          this.setState({
            listOfAnimals: updatedListOfAnimals
          }, () => {
            document.getElementsByClassName('heartsvg')[indexKey].src = logoSVG
          })
    } else if(!user) this.togglePopup();
      else {
      const uid = fire.auth.currentUser.uid;
      const comName = event.target.getAttribute('commonname').split(' ').map(word => word.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('-')).join(' ');
      console.log("comName ==> ", comName)
      const latName = event.target.getAttribute('species');
      const flickerUrl = event.target.getAttribute('flicker');
      const viewportLngMin = event.target.getAttribute('viewportlngmin');
      const viewportLngMax = event.target.getAttribute('viewportlngmax');
      const viewportLatMin = event.target.getAttribute('viewportlatmin');
      const viewportLatMax = event.target.getAttribute('viewportlatmax');
      const speciesKeySaved = event.target.getAttribute('specieskey');
      const lat = event.target.getAttribute('lat');
      const lng = event.target.getAttribute('lng');
      const cCode = event.target.getAttribute('countrycode');
      const photoOwner = event.target.getAttribute('photoowner');
      const licenseOwner = JSON.parse(event.target.getAttribute('licenseowner'));
      document.getElementsByClassName('heartsvg')[indexKey].src = logoSvgPurple;
      // document.getElementsByClassName('heartsvg')[indexKey].style.pointerEvents = 'none';
      fire.writeUserData(this.state.place, comName, latName, flickerUrl, viewportLngMin, viewportLngMax, viewportLatMin, viewportLatMax, speciesKeySaved, lat, lng, uid, cCode, photoOwner, licenseOwner)
        .then(() => this.dataSnapshotDB())
    }
  }

  savedAnimals = () => {
    this.setState({
      isSavedAnimals: true,
      isAccountSettings: false,
      deleteError: false,
      showPopUpSearch: false
    }, () => aboutClickCSS());
  }
  //When logged in user clicks on the drop down menu option "Saved Animals" in order to retrieve the animals that she/he saved 
  accountSettings = () => {
    this.setState({
      isAccountSettings: true,
      isLoggingIn: false,
      isSavedAnimals: false,
      showPopUpSearch: false
    }, () => aboutClickCSS());
  }

  delAccount = () => {
    const user = fire.auth.currentUser;
    if (user) {
      user.delete().then(() => {
        this.setState({ user: null });
        this.homeClickApp();
      }).catch((error) => {
        console.log('error while trying to deleted user: ', error);
        this.setState({
          deleteError: true,
          isAccountSettings: false
        });
      });
    }
  }

  delAccountAfterLogIn = () => {
    this.setState({ isAccountSettings: true, deleteError: false}, () => moveUpSearch("visible", "moveUp"));
  }

  togglePopup = () => {
    this.setState({ showPopup: !this.state.showPopup}, () => moveUpSearch("visible", "moveUp"));
  }

  handleChange = (event) => this.setState({ value: event.target.value });

  handleSubmit = (event) => event.preventDefault();

  handleReset = () => {
    clickedCloseBtn();
    this.setState({ value: '' });
    window.requestAnimationFrame(() => this.addClassCloud());
    this.dataSnapshotDB().then((val) => this.isAnimalLiked(val));
  }

  //Handle PageX PageY coordinates
  handleXY = (argX, argY) => {
    this.setState({ pageX: argX, pageY: argY });
  }

  handlePopUp = () => {
    this.hasClickedOnLogIn();
    this.togglePopup();
  }

  exploreHP = (evt) => {
    if(evt.target.textContent === 'MELBOURNE, AU') this.fetchSightingsAfterPlace(-38.4338593, -37.5112737, 144.59374179999998, 145.51252880000004, "AU", "Melbourne VIC, Australia", -37.8136276, 144.96305759999996);
    if(evt.target.textContent === 'SAUSALITO, US') this.fetchSightingsAfterPlace(37.843927, 37.872909, -122.51208409999998, -122.47508199999999, "US", "Sausalito, CA 94965, USA", 37.85909369999999, -122.4852507);
    if(evt.target.textContent === 'NAIROBI, KE') this.fetchSightingsAfterPlace(-1.4416739, -1.164744, 36.645419100000026, 37.049374599999965, "KE", "Nairobi, Kenya", -1.2920659, 36.82194619999996);
    if(evt.target.textContent === 'COPENHAGEN, DK') this.fetchSightingsAfterPlace(55.615441, 55.7270937, 12.45338240000001, 12.734265400000027, "DK", "Copenhagen, Denmark", 55.6760968, 12.568337199999974);
  }

  render() {
    const {
      showPopup,
      isSavedAnimals,
      isLoggingIn,
      isAbout,
      isLoaded,
      isMapVisible,
      speciesXY,
      isLoading,
      animalNameInTitle,
      lat,
      lng,
      errorHandling,
      errorHandlingPlaces,
      errorHandlingGbif,
      hasErrorBoundaries,
      noResultsError,
      showingInfoWindow,
      activeMarker,
      activeDataSetName,
      year,
      species,
      bottomLoading,
      speciesArray,
      isAccountSettings,
      deleteError, 
      clickedSpecie,
      fallbackPhotos,
      clickedFallback,
      showPopUpSearch,
      place,
      activeGbifOccurence,
      datasetKey
    } = this.state;
    const popUp = (
      <PopUp
        handlePopUp={this.handlePopUp}
        closePopUp={this.togglePopup}
      />
    );
    const navBar = (
      <NavBar
      user={this.state.user} 
      hasClickedOnLogIn={this.hasClickedOnLogIn}
      searchClick={this.searchClick}
      savedAnimals={this.savedAnimals}
      logOutClickAppjs={this.logOutClickAppjs}
      aboutClickApp={this.aboutClickApp}
      handleTitleClick={this.handleTitleClick}
      getMoreSpecific={this.getMoreSpecific}
      isLoggingIn={isLoggingIn}
      isAbout={isAbout}
      isLoaded={isLoaded}
      accountSettings={this.accountSettings}

    />
    );
    const cardsUI = (
        <Cards 
          stateFromMap={this.state}
          getSpecies={this.onClickViewSithings}
          likeClick={this.likeClick}
          handleXY={this.handleXY}
          dataSnapshotDB={this.dataSnapshotDB}
          isAnimalLiked={this.isAnimalLiked}
        />
    );
    const searchBar = (
      <SearchBar  
                  value={this.state.value}
                  handleSubmit={this.handleSubmit}
                  handleChange={this.handleChange} 
                  handleReset={this.handleReset}
                />
    );
    const speciesArrLength = speciesArray.length;
    const speciesLength = species.length;

    if(showPopUpSearch) {
      return (
        <div>
          {navBar}
          <PopUpSearch 
            getMoreSpecific={this.getMoreSpecific} 
            place={place}
          />
        </div>
      );
    }

    if (isAccountSettings) {
      return (
        <div>
          {navBar}
            <Suspense fallback={<LoadingContainer/>}>
              <AccountSettings 
                delAccount={this.delAccount}
              />
            </Suspense>  
        </div>
       );
    }
    if (deleteError) {
      return (
        <div>
          {navBar}
          <Suspense fallback={<LoadingContainer />}>
            <ComfirmLogIn 
              delAccountAfterLogIn={this.delAccountAfterLogIn}
            />
          </Suspense>
       </div>
      );
    }
    if (isSavedAnimals) {
      return (
     
          <div>
          {navBar}
          <Suspense fallback={<LoadingContainer />}>
            <SavedAnimals />
          </Suspense>  
          </div>
        
      );
    }
    if (isLoggingIn) {
      return (
     
          <div>
          {navBar}
            <Suspense fallback={<LoadingContainer />}>
              <SignInForm
              signIn={this.hasClickedSignIn}
              signUpDotsMenuUpdate={this.homeClickApp}
              />
            </Suspense>
          </div>
        
      );
    }
    if (isAbout) {
      return (
        <div>
        {navBar} 
        <Suspense fallback={<LoadingContainer />}>
            <AboutPage />
        </Suspense>
        { isAbout ? window.scrollTo(0, 0) : null }    
        </div>
     );
    }
    if (hasErrorBoundaries || errorHandlingGbif || errorHandling) {
      return (
        <div>
        {navBar}
          <Suspense fallback={<LoadingContainer />}>
            <ErrorHandler
              errorMessage={'Oops, something went wrong!'}
            />
          </Suspense>
        </div>
      );
    }
    if (noResultsError) {
      return (
      <div>
      {navBar}
        <Suspense fallback={<LoadingContainer />}>
          <ErrorHandler errorMessage={'No results for this search!'} />
        </Suspense>
      </div>
    );
    }
    if (errorHandlingPlaces) {
      return (
        <div>
        {navBar}
          <Suspense fallback={<LoadingContainer />}>
            <ErrorHandler errorMessage={'For a successful search, select a place from the suggestions!'} />
          </Suspense>
        </div>
      );
    }
    if (isLoaded) {
        if (!bottomLoading && (speciesArrLength > speciesLength)) {
          return (
            <div>
           {navBar}
                  {searchBar}
                  {showPopup ?
                   popUp
                   :
                   null
                  }
                
              <div className="upperCardContainer-search">
                {cardsUI}
               
                <RaisedButton
                  className="buttonloadmore"
                  onClick={this.loadMore}
                  backgroundColor="#424242"
                  style={{ fontFamily: 'Roboto', fontSize: '13px', color: 'white', height: '45px', marginBottom: '15px' }}
                  secondary
                >
                  See More
                </RaisedButton>
              </div>
              <Map
                   google={this.props.google}
                   containerStyle={{ width: '0px', height: '0px' }}
                   onReady={this.fetchPlaces}
              />
            </div>
          );
        }
        if (bottomLoading && (speciesArrLength > speciesLength)) {
          return (
            <div>
           {navBar}
                {searchBar}
                {showPopup ?
                 popUp
                 :
                 null
                }
              <div className="upperCardContainer-search">
                {cardsUI}
                <RaisedButton
                  className="buttonloadmore"
                  onClick={this.loadMore}
                  backgroundColor="#e5e5e5"
                  style={{ fontFamily: 'Roboto', fontSize: '13px', color: 'white', marginBottom: '15px', height: '45px' }}
                  disabled
                >
                  Loading...
              </RaisedButton>
              </div>
              <Map
                   google={this.props.google}
                   containerStyle={{ width: '0px', height: '0px' }}
                   onReady={this.fetchPlaces}
              />
            </div>
          );
        }
        if (speciesArrLength === speciesLength) {
          return (
            <div>
           {navBar}
              {searchBar}
              {showPopup ?
               popUp
               :
               null
              }
              <div className="upperCardContainer-search">
                {cardsUI}
                  <RaisedButton
                    className="buttonloadmore"
                    backgroundColor="#666666"
                    style={{ fontFamily: 'Roboto', fontSize: '13px', color: 'white', marginBottom: '15px', height: '45px' }}
                    disabled
                  >
                  No more results
                </RaisedButton>
              </div>
              <Map
                   google={this.props.google}
                   containerStyle={{ width: '0px', height: '0px' }}
                   onReady={this.fetchPlaces}
              />
            </div>
          );
        }
    }
    if (isLoading) {
      return (
      <div>
      {navBar}
          <LoadingContainer 
            isLoaded={this.loadingUpdate}
          />
          { isLoading ? window.scrollTo(0, 0) : null }
      </div>
      );
    }
    if (isMapVisible) {
      return (
      <div>
        <NavBarMap 
          onLeftIconButtonClick={this.handleIconClick}
          title={animalNameInTitle ? animalNameInTitle.split(' ').map(word => word.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('-')).join(' ') : clickedSpecie}
        />
        <Suspense fallback={<LoadingContainer isLoading={isMapVisible} />}>
          <MapVisible
            lat={lat}
            lng={lng}
            fallbackPhotos={fallbackPhotos}
            speciesXY={speciesXY}
            specie={clickedSpecie}
            fallback={clickedFallback}
            activeMarker={activeMarker}
            activeDataSetName={activeDataSetName}
            year={year}
            activeGbifOccurence={activeGbifOccurence}
            datasetKey={datasetKey}
            showingInfoWindow={showingInfoWindow}
            isMapVisible={isMapVisible}
            onMarkerClick={this.onMarkerClick}
            notVisible={this.notVisible}
          />
        </Suspense>
      </div>  
      );
    }
    return (
      <div>
        {navBar}
        <div className="wrapper">
          <div id="welcome">
          <h1>Welcome to</h1>
          <h1>Safarify</h1>
        </div>
      </div>
      {searchBar}
      <div id="cities-to-explore">
        <p id="p-explore">Places to explore</p>
      </div>

        <div className="container-cities">
          <button className="item" onClick={this.exploreHP}>MELBOURNE, AU</button>
          <button className="item" onClick={this.exploreHP}>SAUSALITO, US</button>
          <button className="item" onClick={this.exploreHP}>NAIROBI, KE</button>
          <button className="item" onClick={this.exploreHP}>COPENHAGEN, DK</button>
        </div>

      <Map
           google={this.props.google}
           containerStyle={{ width: '0px', height: '0px' }}
           zoom={9}
           onReady={this.fetchPlaces}
           visible={isMapVisible}
      />
      <div>
      <Clouds />
      </div>
    </div>
  );
  }
}

export default GoogleApiWrapper({ apiKey: (googleMapKey), LoadingContainer })(MapContainer);                        
