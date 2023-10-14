import React from 'react';
// import '../styles/about.css';

function AboutPage() {
  return (
    <div
  style={{
    position: 'relative',
    top: '95px',
    textAlign: 'left',
    width: '80%',
    margin: 'auto',
    paddingBottom: '90px'
  }}
  >
  <h1 id="about">About Safarify</h1>
  <p className="ptags">
    Safarify is a progressive web application (PWA); if you are viewing it with your phone you can add it to your homescreen (in order to deliver a native app-like experience).
  </p>
  <h3 className="section-head">Where does all this cool data come from?</h3>

        <p className="ptags">
          The wildlife sightings data are provided by GBIF, 
          which aggregates data from a range of sources and 
          makes it available via an API. Thank you <a rel="noopener noreferrer" target="_blank" href="https://www.gbif.org">gbif.org</a>!
        </p>

        <p className="ptags">
          For example, <a rel="noopener noreferrer" target="_blank" href="https://www.inaturalist.org/home">Inaturalist.org</a> tracks sightings of biodiversity in various areas and make the coordinates of each sighting available to GBIF.
        </p>

        <p className="ptags">
           Thanks to the <a href="https://www.iucnredlist.org/" rel="noopener noreferrer" target="_blank" title="IUCN">IUCN Red List</a> of threatened species for providing information on the global conservation status of animals in Safarify.
        </p>

        <p className="ptags">
        The animal images are sourced from Flickr. In rare instances where images are not found on Flickr, 
        Safarify automatically falls back to sourcing images from the GBIF API.

        </p>
        <p className="ptags">
          Icon made by <a href="http://www.freepik.com" rel="noopener noreferrer" target="_blank" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> and licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" rel="noopener noreferrer" target="_blank">CC 3.0 BY</a>
        </p>

      <h3 className="section-head">Who built this website?</h3>

        <p className="ptags">
          © Carl Champain: let's connect on <a rel="noopener noreferrer" target="_blank" href="https://www.linkedin.com/in/carl-champain-2901aa9a/">linkedin</a> or send me a message at <a href="mailto:carlchampain@gmail.com">carlchampain@gmail.com</a>!
        </p>

  </div>
  );
}
export default AboutPage;
