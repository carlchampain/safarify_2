export default function getLicenseName(licenseCode) {
    let licenseName;
        switch(licenseCode) {
          case "1":
              licenseName = '(CC BY-NC-SA)';
              break;
          case "2":
              licenseName = '(CC BY-NC)';
              break;
          case "3":
              licenseName = '(CC BY-NC-ND)';
              break;
          case "4":
              licenseName = '(CC BY 2.0)';
              break;
          case "5":
              licenseName = '(CC BY-SA)';
              break;
          case "6":
              licenseName = '(CC BY-ND)';
              break;
          case "7":
              licenseName = '(No known copyright restrictions)';
              break;
          case "8":
              licenseName = '(United States Government Work)';
              break;
          case "9":
              licenseName = '(CC0)';
              break;
          case "10":
              licenseName = '(Public Domain)';
              break;
          default:
              licenseName = '(Unknown License)';
        }
        return licenseName;
  }
