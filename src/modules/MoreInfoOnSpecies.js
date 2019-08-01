import axios from 'axios';
import { redListKey } from '../firebase/api_keys';

export const moreInfoSpecies = (specie) => {
    const queryUrl = `https://apiv3.iucnredlist.org/api/v3/species/narrative/${specie}?token=${redListKey}`;
    axios.get(queryUrl).then((res) => {
        const conservationMeasures = document.getElementById('conservationmeasures');
        conservationMeasures.innerHTML = res.data.result[0].conservationmeasures;
        if (res.data.result[0].conservationmeasures === null) {
          conservationMeasures.previousSibling.style.display = 'none';
          conservationMeasures.style.display = 'none';
        }
        const habitat = document.getElementById('habitat');
        habitat.innerHTML = res.data.result[0].habitat;
        if (res.data.result[0].habitat === null) {
          habitat.previousSibling.style.display = 'none';
          habitat.style.display = 'none';
        }
        const geoRange = document.getElementById('geographicrange');
        geoRange.innerHTML = res.data.result[0].geographicrange;
        if (res.data.result[0].geographicrange === null) {
          geoRange.previousSibling.style.display = 'none';
          geoRange.style.display = 'none';
        }
        const threats = document.getElementById('threats');
        threats.innerHTML = res.data.result[0].threats;
        if (res.data.result[0].threats === null) {
          threats.previousSibling.style.display = 'none';
          threats.style.display = 'none';
        }
        const population = document.getElementById('population');
        population.innerHTML = res.data.result[0].population;
        if (res.data.result[0].population === null) {
          population.previousSibling.style.display = 'none';
          population.style.display = 'none';
        }
        const populationTrend = document.getElementById('populationtrend');
        populationTrend.innerHTML = res.data.result[0].populationtrend;
        if (res.data.result[0].population === null) {
          populationTrend.previousSibling.style.display = 'none';
          populationTrend.style.display = 'none';
        }
        const rationale = document.getElementById('rationale');
        rationale.innerHTML = res.data.result[0].rationale;
        if (res.data.result[0].rationale === null) {
          rationale.previousSibling.style.display = 'none';
          rationale.style.display = 'none';
        }
    }).catch((error) => {
      if (document.getElementById('conservationmeasures')) {
        document.getElementById('habitat').previousSibling.style.display = 'none';
        document.getElementById('habitat').style.display = 'none';
        document.getElementById('conservationmeasures').previousSibling.style.display = 'none';
        document.getElementById('conservationmeasures').style.display = 'none';
        document.getElementById('geographicrange').previousSibling.style.display = 'none';
        document.getElementById('geographicrange').style.display = 'none';
        document.getElementById('threats').previousSibling.style.display = 'none';
        document.getElementById('threats').style.display = 'none';
        document.getElementById('population').previousSibling.style.display = 'none';
        document.getElementById('population').style.display = 'none';
        document.getElementById('populationtrend').previousSibling.style.display = 'none';
        document.getElementById('populationtrend').style.display = 'none';
        document.getElementById('rationale').previousSibling.style.display = 'none';
        document.getElementById('rationale').style.display = 'none';
      }
    });
};

 export const isIntroduced = (specie, countryCode) => {
    const signal = axios.CancelToken.source();
    axios.get(`https://apiv3.iucnredlist.org/api/v3/species/countries/name/${specie}?token=${redListKey}`, {
        cancelToken: signal.token,
      })
        .then(res => {
            const resArr = res.data.result;
            if (resArr.length === 0) {
              document.getElementById('origin').style.display = 'none';
              document.getElementById('origin').previousSibling.style.display = 'none';
            }
            for (let j = 0; j < resArr.length; j++) {
              const elem = resArr[j];
              if(elem.code === countryCode) {
                console.log('elem => ', elem.origin);
                const resOrigin = elem.origin;
                  document.getElementById('origin').innerHTML = `${resOrigin} to the country`;
                  break;
              }  
              if (elem.code !== countryCode && j === resArr.length-1) {
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
