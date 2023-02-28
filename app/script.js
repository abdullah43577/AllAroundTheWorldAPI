"use strict";

// Todo:
`Data visualization: You could use charts, graphs, and other data visualization tools to display key statistics about each country, such as population, GDP, literacy rate, and more. This can help users quickly understand the relative strengths and weaknesses of each country.

Quiz or trivia game: You could create a quiz or trivia game that tests users' knowledge of countries and their cultural and geographic features. This can make the web app more fun and interactive and encourage users to spend more time exploring the data.`;

class Component {
  constructor() {
    this.data = "";
  }
}

class Countries {
  #map;
  #mapZoomLevel = 5;
  constructor() {
    this.data = new Component();
    this.countriescontainer = document.querySelector(".countries");
    this.bgToggle = document.querySelector(".bgToggle");
    this.filterBody = document.querySelector(".filterbyregion");
    this.dropdown = document.querySelector(".dropdown");
    this.filtericon = document.querySelector(".filterbyregion > i");
    this.input = document.querySelector("input");
    this.bgToggleI = document.querySelector(".bgToggle > i");
    this.bgToggleP = document.querySelector(".bgToggle > p");
    this.filterRegionContainer = document.querySelector(".filter--container");
    this.outerContainer = document.querySelector(".outer-container");
    this.mapContainer = document.getElementById("map");
    this.countryName = document.querySelector(".country-name");
    this.myLocation = document.getElementById("myLocation");
    this.borderCountries = [];

    this.bgToggle.addEventListener("click", this.toggleBackgroundColor.bind(this));
    this.filterBody.addEventListener("click", this.toggleDropDown.bind(this));
    this.input.addEventListener("keyup", this.searchCountries.bind(this));
    this.filterRegionContainer.addEventListener("click", this.filterCountries.bind(this));
    this.countriescontainer.addEventListener("click", this.renderDetailsPage.bind(this));
    this.outerContainer.addEventListener("click", this.closeDetailsPage.bind(this));

    this.getCountryData();
  }

  closeDetailsPage(e) {
    let btn = e.target.closest(".back");
    if (!btn) return;
    this.outerContainer.classList.add("translate-x-[100%]");
    this.outerContainer.innerHTML = "";
    this.countriescontainer.classList.remove("hidden");
  }

  renderDetailsPage(e) {
    let countryId = e.target.closest(".country").getAttribute("data-country-id");

    let id = document.querySelector(`.country${countryId}`);
    let countryName = id.lastElementChild.firstElementChild.textContent;

    this.outerContainer.classList.remove("translate-x-[100%]");
    this.countriescontainer.classList.add("hidden");

    this.fetchCountryDetails(countryName);
  }

  async fetchCountryDetails(countryName) {
    document.querySelector(".loader-moana").classList.remove("hide-loader");
    try {
      const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
      if (!res.ok) throw new error("something went wrong, please make sure you're connected to the internet");

      const [data] = await res.json();
      this.detailsPage(data);
    } catch (err) {
      console.log(`something went wrong ${err.message}`);
    } finally {
      document.querySelector(".loader-moana").classList.add("hide-loader");
    }
  }

  renderBorderDetails() {
    this.bordercontainer = document.querySelector(".border-countries");

    this.bordercontainer.addEventListener(
      "click",
      function (e) {
        if (e.target.textContent === "no border countries") return;

        let bordercountry = e.target.closest(".border-country");
        if (!bordercountry) return;

        let bordercountryvalue = bordercountry.textContent.trim();
        this.outerContainer.innerHTML = "";
        this.fetchCountryDetails(bordercountryvalue);
      }.bind(this)
    );
  }

  // *rendering country borders
  _renderBorderCountries(clickedCountryData) {
    this.borderCountries = this.data.filter((country) => country.borders?.includes(clickedCountryData.cca3));
  }

  detailsPage(data) {
    const [lat, lng] = data.latlng;
    const [currency] = Object.values(data.currencies);
    const languages = Object.values(data.languages);
    const [nativeName] = Object.values(data.name.nativeName);
    this._renderBorderCountries(data);
    const borderCountriesName = this.borderCountries.map((countryData) => countryData.name.common);

    let html = `        
    <section class="detailsPage mx-8 lg:container max-w-full h-auto flex-col items-start justify-start relative flex">
          <button class="back px-8 text-sm py-2 rounded my-8">
            <i class="fa-solid fa-arrow-left"></i> Back
          </button>
          <div class="country-full-details flex justify-between flex-col xl:flex-row items-start xl:items-center w-full gap-[3rem]">
            <img src="${data.flags.png}" alt="${data.name.official}" class="w-[300px] h-[200px] md:w-[500px] md:h-[250px] lg:h-[300px]">

            <div class="detail-container md:flex md:gap-[0.3rem] flex-col lg:gap-[1rem]">
              <h2 class="font-bold text-lg md:text-xl">${data.name.common}</h2>
              <div class="detail my-4 md:flex items-start gap-[3rem]">
                <div class="detail1">
                  <p class="text-sm py-1">
                    <span class="font-semibold">Native Name:</span> ${nativeName.official}
                  </p>
                  <p class="text-sm py-1">
                    <span class="font-semibold">Population:</span> ${data.population.toLocaleString()}
                  </p>
                  <p class="text-sm py-1">
                    <span class="font-semibold">Region:</span> ${data.region}
                  </p>
                  <p class="text-sm py-1">
                    <span class="font-semibold">Sub Region:</span> ${data.subregion}
                  </p>
                  <p class="text-sm py-1">
                    <span class="font-semibold">Capital:</span> ${data.capital}
                  </p>
                </div>

                <div class="detail2 my-6 md:my-0">
                  <p class="text-sm py-1">
                    <span class="font-semibold">Top Level Domain:</span> ${data.tld[0]}
                  </p>
                  <p class="text-sm py-1">
                    <span class="font-semibold">Currencies:</span> ${currency.name}
                  </p>
                  <p class="text-sm py-1">
                    <span class="font-semibold">Languages:</span> ${languages.join(", ")}
                  </p>
                </div>
              </div>

              <div class="border-countries--container md:flex gap-[1rem]">
                <h2 class="font-bold my-3">Border Countries:</h2>
                <div class="border-countries flex gap-3 items-center flex-wrap">
                ${
                  borderCountriesName.length
                    ? borderCountriesName
                        .map(
                          (countryName) => `<div class="border-country text-center px-4 py-2 text-sm rounded cursor-pointer">
                    ${countryName}
                  </div>`
                        )
                        .join("")
                    : `<div class="border-country text-center px-4 py-2 text-sm rounded cursor-pointer">no border countries</div>`
                }
                </div>
              </div>
            </div>
          </div>
        </section>`;

    this.outerContainer.innerHTML = html;

    this.createMapElement();
    this.renderBorderDetails();
    this._getPosition();

    let mapReference = this.countryLocation.id;
    this.renderCountriesLocation(mapReference, lat, lng, "Location Pinned!");
    this.countryName.textContent = `${data.name.common}'s Location`;
  }

  createMapElement() {
    const mapContainer = document.createElement("div");
    const countryLocationContainer = document.createElement("div");
    this.countryName = document.createElement("h2");
    this.countryLocation = document.createElement("div");
    const countryInfo = document.createElement("div");
    const locationTxt = document.createElement("h2");
    const arrowDown = document.createElement("i");
    const arrowRight = document.createElement("i");
    this.myLocation = document.createElement("div");

    mapContainer.classList.add("map--container", "mx-8", "flex", "max-w-full", "flex-col", "items-end", "justify-center", "gap-[2rem]", "lg:container", "xl:flex-row", "xl:justify-between", "mb-8");
    countryLocationContainer.classList.add("country--location--container", "flex", "flex-col", "items-center", "justify-center");
    this.countryName.classList.add("country-name", "my-3", "text-center", "text-3xl", "font-bold");
    this.countryLocation.classList.add("country--location", "h-[200px]", "w-[300px]", "md:h-[250px]", "md:w-[500px]", "lg:h-[300px]");
    countryInfo.classList.add("country-info", "currentLocation", "flex", "flex-col", "items-center", "justify-between", "text-center", "md:my-auto", "mx-auto");
    locationTxt.classList.add("text-1xl", "font-bold");
    arrowDown.classList.add("fa-solid", "fa-arrow-down", "fa-2x", "arrow", "sm:block", "lg:hidden");
    arrowRight.classList.add("fa-solid", "fa-arrow-right", "fa-2x", "arrow", "sm:hidden", "lg:block");
    this.myLocation.classList.add("h-[200px]", "w-[300px]", "md:h-[250px]", "md:w-[500px]", "lg:h-[300px]");

    mapContainer.appendChild(countryLocationContainer);
    mapContainer.appendChild(countryInfo);
    mapContainer.appendChild(this.myLocation);

    this.countryLocation.id = "map";
    this.myLocation.id = "map2";

    locationTxt.textContent = "Your Current Location";

    countryLocationContainer.appendChild(this.countryName);
    countryLocationContainer.appendChild(this.countryLocation);

    countryInfo.appendChild(locationTxt);
    countryInfo.appendChild(arrowDown);
    countryInfo.appendChild(arrowRight);

    this.outerContainer.appendChild(mapContainer);
    console.log(mapContainer);
    console.log(mapContainer.parentElement);
  }

  _getPosition() {
    let latitude;
    let longitude;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;

          let idReference = this.myLocation.id;
          this.renderCountriesLocation(idReference, latitude, longitude, "your current location");
        },
        () => {
          console.log("Could not get your position");
        }
      );
    }
  }

  renderCountriesLocation(id, lat, lng, popupMsg) {
    const idEl = document.getElementById(id);
    this.#map = L.map(idEl).setView([lat, lng], this.#mapZoomLevel);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    L.marker([lat, lng]).addTo(this.#map).bindPopup(popupMsg).openPopup();
  }

  filterCountries(e) {
    let searchFilter;

    if (e.target.textContent === "Africa") {
      let filterAfrica = e.target.textContent;
      searchFilter = this.data.filter((country) => {
        return country.region.toLowerCase().includes(filterAfrica.toLowerCase());
      });
      this.renderCountry(searchFilter);
      this.dropdown.classList.add("hidden");
    }

    if (e.target.textContent === "America") {
      let filterAmerica = e.target.textContent;
      searchFilter = this.data.filter((country) => {
        return country.region.toLowerCase().includes(filterAmerica.toLowerCase());
      });
      this.renderCountry(searchFilter);
      this.dropdown.classList.add("hidden");
    }

    if (e.target.textContent === "Asia") {
      let filterAsia = e.target.textContent;
      searchFilter = this.data.filter((country) => {
        return country.region.toLowerCase().includes(filterAsia.toLowerCase());
      });
      this.renderCountry(searchFilter);
      this.dropdown.classList.add("hidden");
    }

    if (e.target.textContent === "Europe") {
      let filterEurope = e.target.textContent;
      searchFilter = this.data.filter((country) => {
        return country.region.toLowerCase().includes(filterEurope.toLowerCase());
      });
      this.renderCountry(searchFilter);
      this.dropdown.classList.add("hidden");
    }

    if (e.target.textContent === "Oceania") {
      let filterOceania = e.target.textContent;
      searchFilter = this.data.filter((country) => {
        return country.region.toLowerCase().includes(filterOceania.toLowerCase());
      });
      this.renderCountry(searchFilter);
      this.dropdown.classList.add("hidden");
    }
  }

  searchCountries(e) {
    const searchString = e.target.value.toLowerCase();
    const searchFilter = this.data.filter((country) => {
      return country.name.common.toLowerCase().includes(searchString) || country.name.official.toLowerCase().includes(searchString);
    });
    this.renderCountry(searchFilter);

    if (searchFilter.length === 0) document.querySelector(".loader-moana-input").classList.remove("hide-loader");
    else document.querySelector(".loader-moana-input").classList.add("hide-loader");
  }

  toggleDropDown() {
    this.dropdown.classList.toggle("hidden");
    this.filtericon.classList.toggle("rotate-[180deg]");
  }

  toggleBackgroundColor() {
    document.body.classList.toggle("light-theme");
    if (document.body.classList.contains("light-theme")) {
      this.bgToggleI.classList.remove("fa-sun");
      this.bgToggleI.classList.add("fa-moon");

      this.bgToggleP.textContent = "Dark Mode";
    } else {
      this.bgToggleI.classList.remove("fa-moon");
      this.bgToggleI.classList.add("fa-sun");

      this.bgToggleP.textContent = "Light Mode";
    }
  }

  async getCountryData() {
    try {
      const res = await fetch("https://restcountries.com/v3.1/all");
      if (!res.ok) throw new error("something went wrong, please make sure you're connected to the internet");

      this.data = await res.json();
      // sorted countries by name
      const sortedCountries = this.data.sort((a, b) => (a.name.common > b.name.common ? 1 : -1));

      // sorted countries by population
      // const sortedCountries = this.data.sort((a, b) => (a.population > b.population ? -1 : 1));
      this.renderCountry(sortedCountries);
    } catch (err) {
      console.log(`something went wrong ${err.message}`);
    } finally {
      document.querySelector(".loader").classList.add("hide-loader");
    }
  }

  renderCountry(countryData) {
    let html = "";
    let index = 0;
    countryData.forEach((country) => {
      index++;
      html += `
        <div class="country country${index} w-[220px] pb-8 h-[340px] rounded cursor-pointer overflow-hidden" data-country-id="${index}">
                <img src="${country.flags.png}" alt="${country.name.official}" class="image w-full h-1/2 rounded-tr rounded-tl"/>
                <div class="country-info px-4 py-6">
                  <h2 class="text-lg font-semibold py-2">${country.name.common}</h2>
                  <p class="text-sm py-1">
                    <span class="font-semibold">Population:</span> ${country.population.toLocaleString()}
                  </p>
                  <p class="text-sm py-1">
                    <span class="font-semibold">Region:</span> ${country.region}
                  </p>
                  <p class="text-sm py-1">
                    <span class="font-semibold">Capital:</span> ${country.capital}
                  </p>
                </div>
          </div>`;
    });

    this.countriescontainer.innerHTML = html;
  }
}

const country = new Countries();
