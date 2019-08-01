import React, { memo } from 'react';
import axios from 'axios';
import { GoogleApiWrapper, Map, Marker, InfoWindow } from 'google-maps-react';
import { googleMapKey, flickerKey } from '../firebase/api_keys';

function flickrMorePhotosSpecies(specie, fallback) {
    const flickrURL = `https://api.flickr.com/services/rest/?method=flickr.photos.search&text=${specie}&api_key=${flickerKey}&per_page=10&format=json&sort=relevance&nojsoncallback=?`;
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
                // console.log('URL FLICKR ==>', photoUrlConst);
            });
        } else {
            if(fallback) {
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

const MapVisible = memo(function MapVisible(props) {       
const lat = props.lat;
const lng = props.lng;
return (
    <div>
        <Map
        google={props.google}
        zoom={10}
        gestureHandling={'greedy'}
        disableDefaultUI
        
        style={{ height: '70%' }}
        onReady={flickrMorePhotosSpecies(props.specie, props.fallback)}
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
            <h4>Year: {props.year}</h4>
            </div>
            </InfoWindow>
    </Map> 
                <div id="photos-title-map">Photos</div>
            <div className="row">
                <div className="column"><img alt="" id="photo-1" className="photo-tag" src=""/></div>
                <div className="column"><img alt="" id="photo-2" className="photo-tag" src=""/></div>
                <div className="column"><img alt="" id="photo-3" className="photo-tag" src=""/></div>
                <div className="column"><img alt="" id="photo-4" className="photo-tag" src=""/></div>
                <div className="column"><img alt="" id="photo-5" className="photo-tag" src=""/></div>
                <div className="column"><img alt="" id="photo-6" className="photo-tag" src=""/></div>
                <div className="column"><img alt="" id="photo-7" className="photo-tag" src=""/></div>
                <div className="column"><img alt="" id="photo-8" className="photo-tag" src=""/></div>
                <div className="column"><img alt="" id="photo-9" className="photo-tag" src=""/></div>
                <div className="column"><img alt="" id="photo-10" className="photo-tag" src=""/></div>
            </div>
        <div id="infocontainer">
            <div>Origin</div>
            <p id="origin" className="ptags">Loading...</p>
            
            <div>Conservation status</div>
            <p id="rationale" className="ptags">Loading...</p>
                
            <div>Geographic range</div>
            <p id="geographicrange" className="ptags">Loading...</p>
                
            <div>Habitat</div>
            <p id="habitat" className="ptags">Loading...</p>
                
            <div>Population</div>
            <p id="population" className="ptags">Loading...</p>
                
            <div>Population trend</div>
            <p id="populationtrend" className="ptags">Loading...</p>
                
            <div>Threats</div>
            <p id="threats" className="ptags">Loading...</p>
                
            <div>Conservation measures</div> 
            <p id="conservationmeasures" className="ptags">Loading...</p>
        </div>
    {props.isMapVisible ? (window.scrollTo(0, 0)) : null}
  </div>
)});

export default GoogleApiWrapper({ apiKey: googleMapKey })(MapVisible);                        

