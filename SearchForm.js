class SearchForm {
  
  constructor () {
    this.searchTermId = "searchTerm";
    this.searchStateId = "searchState";
    this.searchParliamentId = "searchParliament";
    this.searchResultsId = "searchResults";
    
  }
  
  clearSearch () {
    document.getElementById("searchTerm").value = "";
    this.searchResults.innerHTML = `<span class="resultHeader">Search Results</span>`;
  }
  
  get searchTerm () {
    return document.getElementById(this.searchTermId).value.replace(/ /g, "+") || "";
  }
  
  get searchState () {
    return document.getElementById(this.searchStateId).value || "open";
  }
  
  get searchParliament () {
    return document.getElementById(this.searchParliamentId).value || "null";
  }
  
  get searchResults () {
    return document.getElementById(this.searchResultsId);
  }
  
  renderResult (petition) {
    let element = document.createElement("li");
    element.setAttribute("data-ref", petition.links.self);
    element.classList.add("searchItem")
    element.appendChild(document.createTextNode(`${petition.attributes.action} (${Util.numberWithCommas(petition.attributes.signature_count)})`));
    
    return element;
  }
  
  async search (e) {
    e.preventDefault();
    
    this.url = "";
    
    
    if (this.searchParliament == "null") {
      this.url = `https://petition.parliament.uk/petitions.json?q=${this.searchTerm}&state=${this.searchState}`;
    } else {
      this.url = `https://petition.parliament.uk/archived/petitions.json?q=${this.searchTerm}&state=${this.searchState}&parliament=${this.searchParliament}`;
    }
    
    try {
      
      let petitionList = await Request.get(this.url).execute();
      
      let resultHeaderEl = document.createElement("span");
      resultHeaderEl.classList.add("resultHeader");
      resultHeaderEl.appendChild(document.createTextNode(`${petitionList.data.length} Results`));
      this.searchResults.appendChild(resultHeaderEl);
      
      for (let petition of petitionList.data) {
        this.searchResults.appendChild(this.renderResult(petition));
      }
      
      let elements = document.getElementsByClassName("searchItem");
      
      for (let el of elements) {
        el.addEventListener("click", e => {
          window.currentPetition = window.Petition.switchPetition(e.target.getAttribute("data-ref"));
        });
      }
      
    } catch (err) {
      alert(JSON.stringify(err));
      
      let resultHeaderEl = document.createElement("span");
      resultHeaderEl.classList.add("resultHeader");
      resultHeaderEl.appendChild(document.createTextNode(`Error Fetching Results`));
      this.searchResults.appendChild(resultHeaderEl);
    }
  }
}