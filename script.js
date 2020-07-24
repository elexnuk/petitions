/*var petitionData = {};
var ukSignatures = 0, totalSignatures;
var totalUkElectors = 45775758;
var countrydata = {}, countydata = {};
var parties = {};
var constituencyNo = {};
var constituancyData;
var onsData;*/

//Brexit: https://petition.parliament.uk/petitions/229963.json
//Revoke A50: https://petition.parliament.uk/petitions/241584.json

//BBC: https://petition.parliament.uk/petitions/235653.json
//CoronaVirus: https://petition.parliament.uk/petitions/300403.json

//$("#jsonForm").submit(e => {
  
//  let url = document.getElementById("petitionJSON").value;
/*  
  let urlRegex = new RegExp("https:\/\/petition\.parliament\.uk\/petitions\/[0-9]{6,}\.json", "gi");
  
  if (urlRegex.test(url)) {
    window.localStorage.setItem("json", url);
  
    e.preventDefault();
  
    window.location.reload();
  } else {
    
    alert("That was not a vaild petitions json URL");
    e.preventDefault();
  }
  
  
});*/

//$("#searchForm").submit(e => {
 // searchSubmit();
  //e.preventDefault();
//})

/*$(document).ready(() => {
  
  let url = window.localStorage.getItem("json") || "https://petition.parliament.uk/petitions/241584.json";

  $.getJSON(url +"?t=" + (new Date).getTime(), (data) => {
    
    $.getJSON("https://petition.parliament.uk/constituencies.json", (constituancyData) => {
      
      $.getJSON("https://petitionmap.unboxedconsulting.com/json/mps/population_ons.json", (populationData) => {
        petitionData = data;
        onsData = populationData;
        window.constituencyData = constituancyData;
        
        let a = new Petition(url);

      }, (error) => {
        console.log(error);
      });
    }, (err) => {
      console.log(err);
    });
  }, (err) => {
    console.log(err);
  });
});*/