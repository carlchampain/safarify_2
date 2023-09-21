import axios from 'axios';
import { redListKey } from '../firebase/api_keys';
import svgArrow from '../down-arrow-svgrepo-com.svg';
import svgArrowUp from '../up-arrow-svgrepo-com.svg'

export const moreInfoSpecies = (specie) => {
    const queryUrl = `https://apiv3.iucnredlist.org/api/v3/species/narrative/${specie}?token=${redListKey}`;
    axios.get(queryUrl).then((res) => {
      console.log(res)
        const conservationMeasures = document.getElementById('conservationmeasures');
        if (res.data.result.length === 0 || res.data.result[0].conservationmeasures === null) {
          // conservationMeasures.previousSibling.previousSibling.previousSibling.style.display = 'none';
          // conservationMeasures.style.display = 'none';
          conservationMeasures.textContent = "No data"
        } else {
          conservationMeasures.innerHTML = res.data.result[0].conservationmeasures;
        }
        const habitat = document.getElementById('habitat');
        if (res.data.result.length === 0 || res.data.result[0].habitat === null) {
          // habitat.previousSibling.previousSibling.previousSibling.style.display = 'none';
          // habitat.style.display = 'none';
          habitat.textContent = "No data"
        } else {
          habitat.innerHTML = res.data.result[0].habitat;
        }
        const geoRange = document.getElementById('geographicrange');
        if (res.data.result.length === 0 || res.data.result[0].geographicrange === null) {
          // geoRange.previousSibling.previousSibling.previousSibling.style.display = 'none';
          // geoRange.style.display = 'none';
          geoRange.textContent = "No data"
        } else {
          geoRange.innerHTML = res.data.result[0].geographicrange;
        }
        const threats = document.getElementById('threats');
        if (res.data.result.length === 0 || res.data.result[0].threats === null) {
          // threats.previousSibling.previousSibling.previousSibling.style.display = 'none';
          // threats.style.display = 'none';
          threats.textContent = "No data"
        } else {
          threats.innerHTML = res.data.result[0].threats;
        }
        const population = document.getElementById('population');
        if (res.data.result.length === 0 || res.data.result[0].population === null) {
          // population.previousSibling.previousSibling.previousSibling.style.display = 'none';
          // population.style.display = 'none';
          population.textContent = "No data"
        } else {
          population.innerHTML = res.data.result[0].population;
        }
        const populationTrend = document.getElementById('populationtrend');
        if (res.data.result.length === 0 || res.data.result[0].population === null) {
          // populationTrend.previousSibling.previousSibling.previousSibling.style.display = 'none';
          // populationTrend.style.display = 'none';
          populationTrend.textContent = "No data"
        } else {
          populationTrend.innerHTML = res.data.result[0].populationtrend;
        }
        const rationale = document.getElementById('rationale');
        if (res.data.result.length === 0 || res.data.result[0].rationale === null) {
          // rationale.previousSibling.previousSibling.previousSibling.style.display = 'none';
          // rationale.style.display = 'none';
          rationale.textContent = "No data"
        } else {
          rationale.innerHTML = res.data.result[0].rationale;
        }
        const content = document.getElementsByClassName('ptags');
        const readMoreBtn = document.getElementsByClassName('readMore');
        // Store the full text in a data attribute for later use
        for (let i = 1; i < Array.from(content).length; i++) {
          const elem = Array.from(content)[i];
          elem.setAttribute('data-fulltext', elem.textContent);
          if (elem.textContent.length > 0) {
            const truncatedText = elem.textContent.slice(0, 0);
            let isTruncated = true; 
            elem.textContent = truncatedText;
            readMoreBtn[i].addEventListener('click', function() {
                if (isTruncated) {
                    elem.textContent = elem.getAttribute('data-fulltext');
                    readMoreBtn[i].firstChild.src = svgArrowUp;
                } else {
                    elem.textContent = truncatedText;
                    readMoreBtn[i].firstChild.src = svgArrow;
                }
                isTruncated = !isTruncated;
            });
        } 
        // else {
        //     readMoreBtn[i].style.display = 'none'; 
        // }
          
        }
    }).catch((error) => {
      console.log(error)
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

function helperReadMore(content, readMoreBtn) {
  content.setAttribute('data-fulltext', content.textContent);
      if (content.textContent.length > 0) {
          const truncatedText = content.textContent.slice(0, 0);
          let isTruncated = true;
          content.textContent = truncatedText;
          readMoreBtn.addEventListener('click', function() {
              if (isTruncated) {
                  content.textContent = content.getAttribute('data-fulltext');
                  readMoreBtn.firstChild.src = svgArrowUp;
              } else {
                  content.textContent = truncatedText;
                  readMoreBtn.firstChild.src = svgArrow;
              }
              isTruncated = !isTruncated;
          });
      } 
}

 export const isIntroduced = (specie, countryCode) => {
    const signal = axios.CancelToken.source();
    axios.get(`https://apiv3.iucnredlist.org/api/v3/species/countries/name/${specie}?token=${redListKey}`, {
        cancelToken: signal.token,
      })
        .then(res => {
            const resArr = res.data.result;
            const content = document.getElementsByClassName('ptags')[0];
            const readMoreBtn = document.getElementsByClassName('readMore')[0];
            if (resArr.length === 0) {
              // document.getElementById('origin').style.display = 'none';
              // document.getElementById('origin').previousSibling.previousSibling.previousSibling.style.display = 'none';
              // readMoreBtn.style.display = 'none';
              content.textContent = "No data"
              helperReadMore(content, readMoreBtn)
            }
            for (let j = 0; j < resArr.length; j++) {
              const elem = resArr[j];
              if (elem.code !== countryCode && j === resArr.length-1) {
                // document.getElementById('origin').style.display = 'none';
                // document.getElementById('origin').previousSibling.previousSibling.previousSibling.style.display = 'none';
                // readMoreBtn.style.display = 'none';
                content.textContent = "No data"
                helperReadMore(content, readMoreBtn)
              }
              if(elem.code === countryCode) {
                console.log("yes")
                  const resOrigin = elem.origin;
                  document.getElementById('origin').innerHTML = `${resOrigin} to the country`;
                  // Store the full text in a data attribute for later use
                  content.setAttribute('data-fulltext', content.textContent);
                  helperReadMore(content, readMoreBtn)
                  // else {
                  //     readMoreBtn.style.display = 'none'; // hide the button if the text is not longer than 100 characters
                  // }
                  break;
              }  
            }
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            console.log('Request canceled', error.message);
          }
        })

  }
