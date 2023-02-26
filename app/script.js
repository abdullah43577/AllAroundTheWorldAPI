"use strict";

// Todo:
`// for rest countries API

Maps: You could integrate a map view into your web app to show the location of each country. This can help users visualize the geographic distribution of countries and learn more about their relative positions and sizes.

Data visualization: You could use charts, graphs, and other data visualization tools to display key statistics about each country, such as population, GDP, literacy rate, and more. This can help users quickly understand the relative strengths and weaknesses of each country.

Quiz or trivia game: You could create a quiz or trivia game that tests users' knowledge of countries and their cultural and geographic features. This can make the web app more fun and interactive and encourage users to spend more time exploring the data.`;

// Todo: for the filter by region section, you can use the `change` eventListener to listen for a change and use an if statement like so: if(the value = 'africa') 'execute code' and so on, you can refer to jonas course for more info or mdn

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

    this.bgToggle.addEventListener(
      "click",
      this.toggleBackgroundColor.bind(this)
    );
    this.filterBody.addEventListener("click", this.toggleDropDown.bind(this));
    this.input.addEventListener("keyup", this.searchCountries.bind(this));
    this.filterRegionContainer.addEventListener(
      "click",
      this.filterCountries.bind(this)
    );
    this.countriescontainer.addEventListener(
      "click",
      this.renderDetailsPage.bind(this)
    );
    this.outerContainer.addEventListener(
      "click",
      this.closeDetailsPage.bind(this)
    );

    this.getCountryData();
  }

  closeDetailsPage(e) {
    let btn = e.target.closest(".back");
    if (!btn) return;
    this.outerContainer.classList.add("translate-x-[100%]");
    this.countriescontainer.classList.remove("hidden");
    this.#map.remove();
    this.outerContainer.firstElementChild.remove();
  }

  renderDetailsPage(e) {
    let countryId = e.target
      .closest(".country")
      .getAttribute("data-country-id");

    let id = document.querySelector(`.country${countryId}`);
    let countryName = id.lastElementChild.firstElementChild.textContent;

    this.outerContainer.classList.remove("translate-x-[100%]");
    this.countriescontainer.classList.add("hidden");

    this.fetchCountryDetails(countryName);
    this._getPosition();
  }

  async fetchCountryDetails(countryName) {
    try {
      const res = await fetch(
        `https://restcountries.com/v3.1/name/${countryName}`
      );
      const [data] = await res.json();
      console.log(data);
      this.detailsPage(data);
    } catch (err) {
      console.log(`something went wrong ${err.message}`);
    }
  }

  detailsPage(data) {
    const [lat, lng] = data.latlng;
    // prettier-ignore
    let html = `        
    <section class="detailsPage mx-8 md:container max-w-full w-full h-full flex-col items-center justify-start relative flex ">
          <button class="back px-8 text-sm py-2 rounded absolute left-10 md:left-0 top-[40px] my-8">
            <i class="fa-solid fa-arrow-left"></i> Back
          </button>
          <div class="country-full-details mt-32 flex justify-between flex-col md:flex-row items-center w-full md:gap-[3rem] lg:gap-0">
            <img src="${data.flags.png}" alt="${
      data.name.official
    }" class="w-[300px] h-[200px] md:w-[500px] md:h-[250px] lg:h-[300px]">

            <div class="detail-container mt-6 md:flex md:gap-[0.3rem] flex-col lg:gap-[1rem]">
              <h2 class="font-bold text-lg md:text-xl">${data.name.common}</h2>
              <div class="detail my-4 md:flex items-start gap-[3rem]">
                <div class="detail1">
                  <p class="text-sm py-1">
                    <span class="font-semibold">Native Name:</span> Belgie
                  </p>
                  <p class="text-sm py-1">
                    <span class="font-semibold">Population:</span> ${data.population.toLocaleString()}
                  </p>
                  <p class="text-sm py-1">
                    <span class="font-semibold">Region:</span> ${data.region}
                  </p>
                  <p class="text-sm py-1">
                    <span class="font-semibold">Sub Region:</span> ${
                      data.subregion
                    }
                  </p>
                  <p class="text-sm py-1">
                    <span class="font-semibold">Capital:</span> ${data.capital}
                  </p>
                </div>

                <div class="detail2 my-6 md:my-0">
                  <p class="text-sm py-1">
                    <span class="font-semibold">Top Level Domain:</span> ${
                      data.tld[0]
                    }
                  </p>
                  <p class="text-sm py-1">
                    <span class="font-semibold">Currencies:</span> Euro
                  </p>
                  <p class="text-sm py-1">
                    <span class="font-semibold">Languages:</span> Dutch, French,
                    German
                  </p>
                </div>
              </div>

              <div class="border-countries--container md:flex gap-[1rem]">
                <h2 class="font-bold my-3">Border Countries:</h2>
                <div class="border-countries flex gap-3 items-center">
                  <div class="border-country text-center px-4 py-2 text-sm rounded cursor-pointer">
                    France
                  </div>
                  <div class="border-country text-center px-4 py-2 text-sm rounded cursor-pointer">
                    Germany
                  </div>
                  <div class="border-country text-center px-4 py-2 text-sm rounded cursor-pointer">
                    Netherlands
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>`;

    this.renderCountriesLocation(
      this.mapContainer,
      lat,
      lng,
      "Location Pinned!"
    );
    this.countryName.textContent = `${data.name.common}'s Location`;

    this.outerContainer.insertAdjacentHTML("afterbegin", html);
  }

  _getPosition() {
    let latitude;
    let longitude;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;

          this.renderCountriesLocation(
            this.myLocation,
            latitude,
            longitude,
            "your current location"
          );
        },
        () => {
          alert("Could not get your position");
        }
      );
    }
  }

  renderCountriesLocation(id, lat, lng, popupMsg) {
    this.#map = L.map(id).setView([lat, lng], this.#mapZoomLevel);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    L.marker([lat, lng]).addTo(this.#map).bindPopup(popupMsg).openPopup();
  }

  filterCountries(e) {
    let searchFilter;

    if (e.target.textContent === "Africa") {
      let filterAfrica = e.target.textContent;
      searchFilter = this.data.filter((country) => {
        return country.region
          .toLowerCase()
          .includes(filterAfrica.toLowerCase());
      });
      this.renderCountry(searchFilter);
      this.dropdown.classList.add("hidden");
    }

    if (e.target.textContent === "America") {
      let filterAmerica = e.target.textContent;
      searchFilter = this.data.filter((country) => {
        return country.region
          .toLowerCase()
          .includes(filterAmerica.toLowerCase());
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
        return country.region
          .toLowerCase()
          .includes(filterEurope.toLowerCase());
      });
      this.renderCountry(searchFilter);
      this.dropdown.classList.add("hidden");
    }

    if (e.target.textContent === "Oceania") {
      let filterOceania = e.target.textContent;
      searchFilter = this.data.filter((country) => {
        return country.region
          .toLowerCase()
          .includes(filterOceania.toLowerCase());
      });
      this.renderCountry(searchFilter);
      this.dropdown.classList.add("hidden");
    }
  }

  searchCountries(e) {
    const searchString = e.target.value.toLowerCase();
    const searchFilter = this.data.filter((country) => {
      return (
        country.name.common.toLowerCase().includes(searchString) ||
        country.name.official.toLowerCase().includes(searchString)
      );
    });
    this.renderCountry(searchFilter);
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
      if (!res.ok) throw new error("something went wrong");

      this.data = await res.json();
      this.renderCountry(this.data);
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
      // prettier-ignore
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
