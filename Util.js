window.Util = class Util {
  static numberWithCommas (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  static countryCodeEmoji (code) {
    let OFFSET = 127397;
    let cc = code.toUpperCase();
    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i];
            }
            return arr2;
        } else {
            return Array.from(arr);
        }
    }
    return /^[A-Z]{2}$/.test(cc) ? String.fromCodePoint.apply(String, _toConsumableArray([].concat(_toConsumableArray(cc)).map(function (c) {
        return c.charCodeAt() + OFFSET;
    }))) : null;
  }
  
  static isUK (country) {
    return country.name == "United Kingdom";
  }
  
  static higherSignatureCount(firstEl, secondEl) {
    if (firstEl.signature_count > secondEl.signature_count) {
      return -1;
    } else {
      return 1;
    }
    return 0;
  }
  
  static higherPercentSigned(firstEl, secondEl) {

    let percentF = Math.floor(parseInt(firstEl.signature_count) / parseInt(window.onsData[firstEl.ons_code].population) * 100000) / 1000;
    let percentS = Math.floor(parseInt(secondEl.signature_count) / parseInt(window.onsData[secondEl.ons_code].population) * 100000) / 1000;

    return percentF > percentS ? -1 : 1;

  }
  
  static shortenPartyName(party) {
    switch (party) {
      case "Scottish National Party":
        return "SNP";
      case "Democratic Unionist Party":
        return "DUP";
      case "The Independent Group for Change":
        return "TIG";

      case "Liberal Democrat":
        return "Lib Dem";

      case "Labour (Co-op)":
        return "Labour";

      case "Social Democratic & Labour Party":
        return "SDLP";

      default:
        return party;
    }
  }

  static getClassName(party) {
    return Util.shortenPartyName(party).replace(/ /g, "").toLowerCase();
  }
}