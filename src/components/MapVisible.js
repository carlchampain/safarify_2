import React, { memo, useEffect } from 'react';
import { GoogleApiWrapper, Map, Marker, InfoWindow } from 'google-maps-react';
import { googleMapKey, flickerKey } from '../firebase/api_keys';
import svgArrow from '../down-arrow-svgrepo-com.svg';
import axios from 'axios';

//Check click marker photos reloading 
//TODO: add flicker call to useEffect and save photos in State
// Can remove onReady in <Map>

function flickrMorePhotosSpecies(specie, fallback) {
    const flickrURL = `https://api.flickr.com/services/rest/?method=flickr.photos.search&text=${specie}&api_key=${flickerKey}&per_page=10&format=json&sort=relevance&nojsoncallback=?&license=1,2,3,4,5,6,7,8,9,10`;
    axios.get(flickrURL)
        .then((resFlickr) => {
        const photoLength = resFlickr.data.photos.photo.length;
        if (photoLength > 0) {
            resFlickr.data.photos.photo.forEach((element, i) => {
                const farm = element.farm;
                const server = element.server;
                const id = element.id;
                const secret = element.secret;
                const photoUrlConst = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_z.jpg`;
                let imgTag = document.getElementsByClassName('photo-tag')[i];
                imgTag.src = photoUrlConst;
                fetchMoreOwnerPhoto(i, id);
                imgTag.onload = () => document.getElementsByClassName("column")[i] ? document.getElementsByClassName("column")[i].classList.add("loaded") : 0 ;
            });
        } else {
            if(fallback) {
                //TODO: fallback could be the GBIF photo
                let imgTag = document.getElementsByClassName('photo-tag')[0];
                imgTag.src = fallback;
                for(let i=1; i<document.getElementsByClassName('photo-tag').length; i++) {
                    document.getElementsByClassName('photo-tag')[i].style.display = 'none';
                }
            }
        }    
    })
    .catch(error => console.log('error ==>', error));
}

async function fetchMoreOwnerPhoto(i, id) {
       await axios.get(`https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${flickerKey}&photo_id=${id}&format=json&nojsoncallback=1`)
      .then(response => {
            let photoCreditEl = document.getElementsByClassName('photo-tag')[i].nextSibling;
            photoCreditEl.innerText = `© ${response.data.photo.owner.realname !== '' ? response.data.photo.owner.realname : response.data.photo.owner.username}`
      })
      .catch(errorFlickr => {
            console.log(errorFlickr)
      });  
}

const MapVisible = memo(function MapVisible(props) { 
    // const morePhotos =  props.flickrMorePhotosSpecies === undefined ? () => {} :  props.flickrMorePhotosSpecies;
    useEffect(() => {
        flickrMorePhotosSpecies(props.specie, props.fallback)
    }, [props.fallback, props.specie])


    const lat = props.lat;
    const lng = props.lng;
    // onReady={flickrMorePhotosSpecies(props.specie, props.fallback)}
    return (
        <div>
            <Map
            google={props.google}
            zoom={10}
            gestureHandling={'greedy'}
            disableDefaultUI
            
            style={{ height: '70%' }}
           
            visible 
            initialCenter={{
                lat,
                lng
            }}
        >
        
            {
            props.speciesXY.map((elem, i) => (
                    <Marker
                    key={i}
                    position={elem}
                    onClick={props.onMarkerClick}
                    dataSetName={props.activeDataSetName[i] ? props.activeDataSetName[i] : 'unknown'}
                    year={props.year[i] ? props.year[i] : 'unknown'}
                    gbifOccurence={props.activeGbifOccurence[i] ? props.activeGbifOccurence[i] : 'unknown'}
                    icon={'https://maps.google.com/mapfiles/ms/micons/purple-dot.png'}
                    />
                ))
            }
                <InfoWindow
                    visible={props.showingInfoWindow}
                    position={props.activeMarker}
                    style={{ overflowY: 'auto' }}
                >
                <div>
                <h4>From: {props.activeDataSetName}</h4>
                <h4>Original record: <a href={`https://www.gbif.org/occurrence/${props.activeGbifOccurence}`} target="_blank" rel="noopener noreferrer">Link to GBIF</a></h4>
                <h4>Year: {props.year}</h4>
                </div>
                </InfoWindow>
        </Map> 
                    <div id="photos-title-map">Photos</div>
                <div className="row">
                    <div className="column"><img alt="" id="photo-1" className="photo-tag" src=""/><div className="morephotocredit"></div></div>
                    <div className="column"><img alt="" id="photo-2" className="photo-tag" src=""/><div className="morephotocredit"></div></div>
                    <div className="column"><img alt="" id="photo-3" className="photo-tag" src=""/><div className="morephotocredit"></div></div>
                    <div className="column"><img alt="" id="photo-4" className="photo-tag" src=""/><div className="morephotocredit"></div></div>
                    <div className="column"><img alt="" id="photo-5" className="photo-tag" src=""/><div className="morephotocredit"></div></div>
                    <div className="column"><img alt="" id="photo-6" className="photo-tag" src=""/><div className="morephotocredit"></div></div>
                    <div className="column"><img alt="" id="photo-7" className="photo-tag" src=""/><div className="morephotocredit"></div></div>
                    <div className="column"><img alt="" id="photo-8" className="photo-tag" src=""/><div className="morephotocredit"></div></div>
                    <div className="column"><img alt="" id="photo-9" className="photo-tag" src=""/><div className="morephotocredit"></div></div>
                    <div className="column"><img alt="" id="photo-10" className="photo-tag" src=""/><div className="morephotocredit"></div></div>
                </div>
            <div id="infocontainer">
                <div className="headerInfo">Origin</div> <button className="readMore"><img alt="arrow" src={svgArrow} className="arrowDown"/></button>
                <p id="origin" className="ptags"></p>
                

                <div className="headerInfo">Conservation status</div> <button className="readMore"><img alt="arrow" src={svgArrow} className="arrowDown"/></button>
                <p id="rationale" className="ptags"></p>
                
                    
                <div className="headerInfo">Geographic range</div> <button className="readMore"><img alt="arrow" src={svgArrow} className="arrowDown"/></button>
                <p id="geographicrange" className="ptags"></p>
                

                <div className="headerInfo">Habitat</div> <button className="readMore"><img alt="arrow" src={svgArrow} className="arrowDown"/></button>
                <p id="habitat" className="ptags"></p>


                <div className="headerInfo">Population</div> <button className="readMore"><img alt="arrow" src={svgArrow} className="arrowDown"/></button>
                <p id="population" className="ptags"></p>


                <div className="headerInfo">Population trend</div> <button className="readMore"><img alt="arrow" src={svgArrow} className="arrowDown"/></button>
                <p id="populationtrend" className="ptags"></p>


                <div className="headerInfo">Threats</div> <button className="readMore"><img alt="arrow" src={svgArrow} className="arrowDown"/></button>
                <p id="threats" className="ptags"></p>


                <div className="headerInfo">Conservation measures</div> <button className="readMore"><img alt="arrow" src={svgArrow} className="arrowDown"/></button>
                <p id="conservationmeasures" className="ptags"></p>


            </div>
        {props.isMapVisible ? (window.scrollTo(0, 0)) : null}
    </div>
)});

export default GoogleApiWrapper({ apiKey: googleMapKey })(MapVisible);                        

