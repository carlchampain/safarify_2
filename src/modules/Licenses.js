export default function getLicenseName(licenseCode) {
    let licenseName;
        switch(licenseCode) {
          case "1":
              licenseName = {name: 'CC BY-NC-SA', url: 'https://creativecommons.org/licenses/by-nc-sa/2.0/'};
              break;
          case "2":
              licenseName = {name: 'CC BY-NC', url:'https://creativecommons.org/licenses/by-nc/2.0/'};
              break;
          case "3":
              licenseName = {name: 'CC BY-NC-ND', url: 'https://creativecommons.org/licenses/by-nc-nd/2.0/'};
              break;
          case "4":
              licenseName = {name: 'CC BY 2.0', url: 'https://creativecommons.org/licenses/by/2.0/'};
              break;
          case "5":
              licenseName = {name: 'CC BY-SA', url: 'https://creativecommons.org/licenses/by-sa/2.0/'};
              break;
          case "6":
              licenseName = {name: 'CC BY-ND', url: 'https://creativecommons.org/licenses/by-nd/2.0/'};
              break;
          case "7":
              licenseName = {name: 'No known copyright restrictions', url: 'https://www.flickr.com/commons/usage/'};
              break;
          case "8":
              licenseName = {name: 'United States Government Work', url: 'http://www.usa.gov/copyright.shtml'};
              break;
          case "9":
              licenseName = {name: 'CC0', url: 'https://creativecommons.org/publicdomain/zero/1.0/'};
              break;
          case "10":
              licenseName = {name: 'Public Domain Mark', url: 'https://creativecommons.org/publicdomain/mark/1.0/'};
              break;
          default:
              licenseName = {name: 'Unknown License', url: ''};
        }
        return licenseName;
  }
