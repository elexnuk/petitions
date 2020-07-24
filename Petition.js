window.Petition = class Petition {
  
  constructor (url = `https://petition.parliament.uk/petitions/241584.json`) {
    this.url = url;

    (async (petition) => {
      
      try {
        await petition.fetchData(petition.url);
        
        petition.showOverviewData();
        
        if (typeof petition.data.data.attributes.signatures_by_country == "undefined" 
            || typeof petition.data.data.attributes.signatures_by_constituency == "undefined"
            || typeof petition.data.data.attributes.signatures_by_region == "undefined") return;
            
        petition.showSignatureByParty();
        petition.showSignatureByRegion();
      
        this.switchCountrySort({"col": "signatures", "mode": "desc"});
        this.switchConstituencySort({"col": "signatures", "mode": "desc"});
        
      } catch (err) {
        console.log(err);
      }
      
    })(this);
  }
  
  async fetchData (url) {
    try {
      this.data = await Request.get(url + "?t=" + (new Date()).getTime()).execute();
    } catch (err) {
      console.log(err);  
      this.data = {};
    }
  }
  
  createListElement (text, date) {
    let listElement = document.createElement("li");
    let title = document.createElement("strong");
    title.appendChild(document.createTextNode(text));
    listElement.appendChild(title);
    listElement.appendChild(document.createTextNode((new Date(date)).toLocaleString("en-GB")));
    return listElement;
  }
  
  createCountryDataRow (index, data) {
    let emoji = window.Util.countryCodeEmoji(data.code) || "";
    let tableRow = document.createElement("tr")
    
    let indexData = document.createElement("td")
    indexData.appendChild(document.createTextNode(index + 1));
    
    let nameData = document.createElement("td");
    let abbr = document.createElement("abbr")
    abbr.setAttribute("title", data.name);
    abbr.appendChild(document.createTextNode(`${data.name.substring(0, 30)} ${emoji}`));
    nameData.appendChild(abbr);
    window.twemoji.parse(nameData, {size: 16});
    
    let signatureData = document.createElement("td");
    signatureData.appendChild(document.createTextNode(window.Util.numberWithCommas(data.signature_count)));
    
    tableRow.appendChild(indexData);
    tableRow.appendChild(nameData);
    tableRow.appendChild(signatureData);
    
    return tableRow;  
  }

  createConstituencyDataRow (index, data) {
    
    let constituency = window.constituencyData[data.ons_code];
    let populationCount  = window.onsData[data.ons_code].population;
    
    let asPercent = Math.floor(parseInt(data.signature_count) / parseInt(populationCount) * 100000) / 1000;
  
    let tableRow = document.createElement("tr");
    tableRow.classList.add(window.Util.getClassName(data.party));
    
    let indexData = document.createElement("td");
    indexData.appendChild(document.createTextNode(index + 1));
    
    let constituencyData = document.createElement("td");
    constituencyData.appendChild(document.createTextNode(data.name))
    
    let nameData = document.createElement("td");
    nameData.appendChild(document.createTextNode(data.mp));
    
    let signatureData = document.createElement("td");
    signatureData.appendChild(document.createTextNode(window.Util.numberWithCommas(data.signature_count)));
    
    let percentData = document.createElement("td");
    percentData.appendChild(document.createTextNode(`${asPercent}%`));
    
    let partyData = document.createElement("td");
    partyData.appendChild(document.createTextNode(window.Util.shortenPartyName(data.party)));
    
    tableRow.appendChild(indexData);
    tableRow.appendChild(constituencyData);
    tableRow.appendChild(nameData);
    tableRow.appendChild(signatureData);
    tableRow.appendChild(percentData);
    tableRow.appendChild(partyData);
    
    return tableRow;
  }  
  
  showOverviewData () {
    let data = this.data;
    let overviewDiv = document.getElementById("overviewDiv");
    overviewDiv.innerHTML = "";
    let title = document.createElement("h1")
    title.appendChild(
      document.createTextNode(`Petition: ${data.data.attributes.action} ${
                              data.data.attributes.state == "open" ? "" : 
                              data.data.attributes.state == "rejected" ? "[Rejected]" : "[Closed]"
                              }`)
    );
    
    let description = document.createElement("blockquote")
    description.appendChild(document.createTextNode(data.data.attributes.background));
    description.appendChild(document.createElement("br"));
    
    if (data.data.attributes.additional_details) {
      let span = document.createElement("span")
      span.classList.add("italicTitle");
      span.appendChild(document.createTextNode("Additional Details: "))
      description.appendChild(span);
      description.appendChild(document.createTextNode(data.data.attributes.additional_details));
    }
    
    let footer = document.createElement("footer");
    let cite = document.createElement("cite");
    let link = document.createElement("a")
    link.setAttribute("href", data.links.self.replace(".json", ""));
    link.setAttribute("target", "_blank");
    link.appendChild(document.createTextNode(data.data.attributes.creator_name || "Anonymous"));
    cite.appendChild(link);
    footer.appendChild(cite);
    description.appendChild(footer);
    
    let dateList = document.createElement("ul");
    if (data.data.attributes.updated_at) {
      dateList.appendChild(this.createListElement("Petition Data Fetched At: ", data.data.attributes.updated_at));
    } 
    if (data.data.attributes.created_at) {
      dateList.appendChild(this.createListElement("Created On: ", data.data.attributes.updated_at));
    }
    if (data.data.attributes.moderation_threshold_reached_at) {
      dateList.appendChild(this.createListElement("Reviewed On: ", data.data.attributes.moderation_threshold_reached_at));
    }
    if (data.data.attributes.opened_at) {
      dateList.appendChild(this.createListElement("Opened On: ", data.data.attributes.opened_at));
    }
    if (data.data.attributes.rejected_at) {
      dateList.appendChild(this.createListElement("Rejected On: ", data.data.attributes.rejected_at));
    }
    if (data.data.attributes.closed_at) {
      dateList.appendChild(this.createListElement("Closed On: ", data.data.attributes.closed_at));
    }
    if (data.data.attributes.response_threshold_reached_at) {
      dateList.appendChild(this.createListElement("Reached 10,000 On: ", data.data.attributes.response_threshold_reached_at));
    }
    if (data.data.attributes.goverment_response_at) {
      dateList.appendChild(this.createListElement("Response On: ", data.data.attributes.government_response_at));
    }
    if (data.data.attributes.debate_threshold_reached_at) {
      dateList.appendChild(this.createListElement("Reached 100,000 On: ", data.data.attributes.debate_threshold_reached_at));
    }
    if (data.data.attributes.scheduled_debate_date) {
      dateList.appendChild(this.createListElement("Debated On: ", data.data.attributes.scheduled_debate_date));
    }
    if (data.data.attributes.debate_outcome_at) {
      dateList.appendChild(this.createListElement("Debate Outcome On: ", data.data.attributes.debate_outcome_at));
    }
    if (data.data.attributes.state == "rejected") {
      let rejectionReason = document.createElement("li");
      let title = document.createElement("strong");
        title.appendChild(document.createTextNode("Rejection Reason: "));
      rejectionReason.appendChild(title);
      rejectionReason.appendChild(document.createTextNode(data.data.attributes.rejection.code));
      dateList.appendChild(rejectionReason);
      
      let rejectionDetail = document.createElement("li");
      title = document.createElement("strong");
      title.appendChild(document.createTextNode("Rejection Details: "));
      rejectionDetail.appendChild(title);
      rejectionDetail.appendChild(document.createTextNode(data.data.attributes.rejection.details));
      dateList.appendChild(rejectionDetail);
    }
    
    overviewDiv.appendChild(title);
    overviewDiv.appendChild(description);
    overviewDiv.appendChild(dateList);
  }
  
  showSignatureByParty () {
    let data = this.data;
    
    let ukSignatures = (data.data.attributes.signatures_by_country.find(window.Util.isUK)).signature_count;
    let totalSignatures = data.data.attributes.signature_count;
    
    document.getElementById("headerTable").innerHTML = "";
    document.getElementById("tableBody").innerHTML = "";
    
    let ukSignatureData = document.createElement("td");
    let ukSignatureHeader = document.createElement("h3");
    ukSignatureHeader.appendChild(document.createTextNode("UK Signatures"));
    ukSignatureData.appendChild(ukSignatureHeader);
    
    let globalSignatureData = document.createElement("td");
    let globalSignatureHeader = document.createElement("h3");
    globalSignatureHeader.appendChild(document.createTextNode("Global Signatures (incl. UK)"));
    globalSignatureData.appendChild(globalSignatureHeader);
    
    let percentSignatureData = document.createElement("td");
    let percentSignatureHeader = document.createElement("h3");
    percentSignatureHeader.appendChild(document.createTextNode("Percent of UK Signatures"));
    percentSignatureData.appendChild(percentSignatureHeader);
    
    document.getElementById("headerTable").appendChild(globalSignatureData);
    document.getElementById("headerTable").appendChild(ukSignatureData);
    document.getElementById("headerTable").appendChild(percentSignatureData);
    
    let ukSignatureEntry = document.createElement("td");
    ukSignatureEntry.appendChild(document.createTextNode(window.Util.numberWithCommas(ukSignatures)));
    
    let totalSignaturesEntry = document.createElement("td");
    totalSignaturesEntry.appendChild(document.createTextNode(window.Util.numberWithCommas(totalSignatures)));
    
    let percentSignaturesEntry = document.createElement("td");
    percentSignaturesEntry.appendChild(document.createTextNode(`${Math.floor(ukSignatures / totalSignatures * 100000) / 1000}%`))
    
    document.getElementById("tableBody").appendChild(totalSignaturesEntry);
    document.getElementById("tableBody").appendChild(ukSignatureEntry);
    document.getElementById("tableBody").appendChild(percentSignaturesEntry);
    //$("#totalElectors").append(numberWithCommas(totalUkElectors));
    //$("#percentElectors").append(Math.floor(ukSignatures/totalUkElectors * 100000) / 1000 + "%");
        
    let parties = {};
    let constituencyNo = {};
    
    for (let constituency of data.data.attributes.signatures_by_constituency) {
      constituency.party = window.constituencyData[constituency.ons_code].party;
      parties[constituency.party] = (
        parties[constituency.party]) ? parties[constituency.party] + constituency.signature_count :
          constituency.signature_count;
      
      constituencyNo[constituency.party] = constituencyNo[constituency.party] ? ++constituencyNo[constituency.party] : 1;
    }
    
    if (parties["Labour (Co-op)"]) {
      parties.Labour += parties["Labour (Co-op)"];
      parties["Labour (Co-op)"] = 0;
    }

    if (parties["null"] != undefined) {
      parties.Independent += parties["null"];
      parties["null"] = 0;
    }

    if (parties["Speaker"]) {
      parties.Labour += parties["Speaker"];
      parties["Speaker"] = 0;
    }

    var sortable = [];
    for (var party of Object.keys(parties)) {
        sortable.push([party, parties[party]]);
    }
    
    sortable.sort(function(a, b) {
        return - a[1] + b[1];
    });

    for (let i = 0; i < sortable.length; i++) {
      let partyName = sortable[i][0];
      let party = parties[partyName];

      if (party != 0) {
        
        let headerElement = document.createElement("td");
        headerElement.classList.add(window.Util.getClassName(partyName));
        let headerText = document.createElement("h3");
        headerText.appendChild(document.createTextNode(window.Util.shortenPartyName(partyName)));
        headerElement.appendChild(headerText);
        headerElement.appendChild(document.createTextNode(" ("));
        
        let abbr = document.createElement("abbr")
        abbr.setAttribute("title", "Data from No. of constituencies");
        abbr.appendChild(document.createTextNode(constituencyNo[partyName]));
        headerElement.appendChild(abbr);
        
        headerElement.appendChild(document.createTextNode(") "));
        
        let bodyElement = document.createElement("td");
        bodyElement.classList.add(window.Util.getClassName(partyName));
        bodyElement.appendChild(document.createTextNode(window.Util.numberWithCommas(party)));
        bodyElement.appendChild(document.createTextNode(" "));
        
        abbr = document.createElement("abbr");
        abbr.setAttribute("title", "Percent of votes from party constituencies");
        abbr.appendChild(document.createTextNode(`(${Math.floor(party / ukSignatures * 100000) / 1000}%)`))
        bodyElement.appendChild(abbr);
        
        document.getElementById("headerTable").appendChild(headerElement);
        document.getElementById("tableBody").appendChild(bodyElement);
      }

    }
  }
  
  showSignatureByRegion () {
    let data = this.data;
    let regionsTable = document.getElementById("regionsTable")
    document.getElementById("regionsTable").innerHTML = "";
    
    let totalSignatures = data.data.attributes.signatures_by_region.reduce( (a, b) => a + parseInt(b.signature_count), 0 );
    let regionsTop = document.createElement("tr");
    let regionsData = document.createElement("tr");
    
    for (let region of data.data.attributes.signatures_by_region) {
      let regionHeader = document.createElement("td")
      regionHeader.appendChild(document.createTextNode(`${region.name} (${region.ons_code})`));
      regionsTop.appendChild(regionHeader);
      let regionBody = document.createElement("td");
      regionBody.appendChild(
        document.createTextNode(`${window.Util.numberWithCommas(region.signature_count)} (${Math.floor(parseInt(region.signature_count) / totalSignatures * 100000) / 1000}%)`)
      );
      regionsData.appendChild(regionBody);
    }
    
    regionsTable.appendChild(regionsTop);
    regionsTable.appendChild(regionsData);
  }
  
  showSignatureByCountry (sort) {
    let data = this.data;
    
    let topCountries = document.getElementById("topCountries");
    
    topCountries.innerHTML = "";
    
    let headerRow = document.createElement("tr");
    let indexCol = document.createElement("th");
    indexCol.appendChild(document.createTextNode("#"));
    
    let nameCol = document.createElement("th");
    nameCol.appendChild(document.createTextNode("Country "));
    let sortNameButton = document.createElement("button");
    sortNameButton.addEventListener("click", (e) => {
      this.switchCountrySort({"col": "name", "mode": (sort.mode == "asc") ? "desc" : "asc"});
    });
    sortNameButton.appendChild(document.createTextNode((sort.col == "name") ? (sort.mode == "asc") ? "⇑" : "⇓" : "⇵"));
    nameCol.appendChild(sortNameButton);
    
    let signatureCol = document.createElement("th");
    signatureCol.appendChild(document.createTextNode("Signatures "))
    let sortButton = document.createElement("button");
    sortButton.addEventListener("click", (e) => {
      this.switchCountrySort({"col": "signatures", "mode": (sort.mode == "asc") ? "desc" : "asc"});
    })
    sortButton.appendChild(document.createTextNode((sort.col == "signatures") ? (sort.mode == "asc") ? "⇑" : "⇓" : "⇵"));
    signatureCol.appendChild(sortButton);
    
    headerRow.appendChild(indexCol);
    headerRow.appendChild(nameCol);
    headerRow.appendChild(signatureCol);
    
    topCountries.appendChild(headerRow);
    
    for (let i = 0; i < data.data.attributes.signatures_by_country.length; i++) {
      topCountries.appendChild(this.createCountryDataRow(i, data.data.attributes.signatures_by_country[i]));
    }
  }
  
  showSignatureByConstituency (sort) {
    let data = this.data;
    
    let topConstituencies = document.getElementById("topConstituencies");
    topConstituencies.innerHTML = "";
    
    let headerRow = document.createElement("tr");
    let indexCol = document.createElement("th");
    indexCol.appendChild(document.createTextNode("#"));
    
    let constituencyCol = document.createElement("th");
    constituencyCol.appendChild(document.createTextNode("Constituency "));
    let sortNameButton = document.createElement("button");
    sortNameButton.addEventListener("click", e => {
      this.switchConstituencySort({"col": "name", "mode": (sort.mode == "asc") ? "desc" : "asc"});
    });
    sortNameButton.appendChild(document.createTextNode((sort.col == "name") ? (sort.mode == "asc") ? "⇑" : "⇓" : "⇵"));
    constituencyCol.appendChild(sortNameButton);
    
    let nameCol = document.createElement("th");
    nameCol.appendChild(document.createTextNode("MP Name"))
    
    let signatureCol = document.createElement("th");
    signatureCol.appendChild(document.createTextNode("Signatures "));
    let sortSignatureButton = document.createElement("button");
    sortSignatureButton.addEventListener("click", (e) => {
      this.switchConstituencySort({"col": "signatures", "mode": (sort.mode == "asc") ? "desc" : "asc"});
    });
    sortSignatureButton.appendChild(document.createTextNode((sort.col == "signatures") ? (sort.mode == "asc") ? "⇑" : "⇓" : "⇵"));
    signatureCol.appendChild(sortSignatureButton);
    
    let percentCol = document.createElement("th");
    percentCol.appendChild(document.createTextNode("Percent "));
    let sortPercentButton = document.createElement("button");
    sortPercentButton.addEventListener("click", (e) => {
      this.switchConstituencySort({"col": "percent", "mode": (sort.mode == "asc") ? "desc" : "asc"});
    });
    sortPercentButton.appendChild(document.createTextNode((sort.col == "percent") ? (sort.mode == "asc") ? "⇑" : "⇓" : "⇵"));
    percentCol.appendChild(sortPercentButton);
    
    let partyCol = document.createElement("th");
    partyCol.appendChild(document.createTextNode("Party"));
    
    headerRow.appendChild(indexCol);
    headerRow.appendChild(constituencyCol);
    headerRow.appendChild(nameCol);
    headerRow.appendChild(signatureCol);
    headerRow.appendChild(percentCol);
    headerRow.appendChild(partyCol);
    
    topConstituencies.appendChild(headerRow);
    
    for (let i = 0; i < data.data.attributes.signatures_by_constituency.length; i++) {
      topConstituencies.appendChild(this.createConstituencyDataRow(i, data.data.attributes.signatures_by_constituency[i]));
    }
  }
  
  switchCountrySort (newMode) {

    if (newMode.col == "signatures") {
      
      this.data.data.attributes.signatures_by_country.sort((first, second) => {
        if (newMode.mode == "asc") {
          return parseInt(first.signature_count) - parseInt(second.signature_count);
        } else if (newMode.mode == "desc") {
          return parseInt(second.signature_count) - parseInt(first.signature_count);
        }
      });
      
    } else if (newMode.col == "name") {
      
      this.data.data.attributes.signatures_by_country.sort((first, second) => {
        first = first.name.toUpperCase();
        second = second.name.toUpperCase();
        
        if (newMode.mode == "asc") {
          
          if (first > second) {
            return -1;
          } else if (second > first) {
            return 1;
          } else {
            return 0;
          }

        } else if (newMode.mode == "desc") {
          
          if (first > second) {
            return 1;
          } else if (second > first) {
            return -1;
          } else {
            return 0;
          }
          
        }
      });
      
    }
    
    this.showSignatureByCountry(newMode);
  }
  
  switchConstituencySort (newMode) {

    this.data.data.attributes.signatures_by_constituency.sort((first, second) => {
      if (newMode.col == "name") {
        first = first.name.toUpperCase();
        second = second.name.toUpperCase();
      } else if (newMode.col == "signatures") {
        first = parseInt(first.signature_count);
        second = parseInt(second.signature_count);
      } else if (newMode.col == "percent") {
        first = parseInt(first.signature_count) / parseInt(window.onsData[first.ons_code].population);
        second = parseInt(second.signature_count) / parseInt(window.onsData[second.ons_code].population);
      }
      
      if (newMode.mode == "asc") {
        if (first > second) {
          return 1;
        } else if (second > first) {
          return -1;
        } else {
          return 0;
        }
      } else if (newMode.mode == "desc") {
        if (first > second) {
          return -1;
        } else if (second > first) {
          return 1;
        } else {
          return 0;
        }
      }
      
      return 0;
    });
    
    this.showSignatureByConstituency(newMode);
  }
  
  static switchPetition (newUrl) {
    let urlRegex = new RegExp("https:\/\/petition\.parliament\.uk\/(archived\/)?petitions\/[0-9]{6,}\.json", "gi");

    if (urlRegex.test(newUrl)) {
      window.localStorage.setItem("json", newUrl);
      return new Petition(newUrl);    
    } else {  
      console.log("That was not a vaild petitions json URL");
      throw "Malformed URL";
    }
  }
  
  static fromId (id) {
    return Petition.switchPetition(`https://petition.parliament.uk/petitions/${id}.json`);
  }}
