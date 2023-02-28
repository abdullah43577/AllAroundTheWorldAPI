# Frontend Mentor - REST Countries API with color theme switcher solution

This is a solution to the [REST Countries API with color theme switcher challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/rest-countries-api-with-color-theme-switcher-5cacc469fec04111f7b848ca). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Your challenge is to integrate with the [REST Countries API](https://restcountries.com) to pull country data and display it like in the designs.

You can use any JavaScript framework/library on the front-end such as [React](https://reactjs.org) or [Vue](https://vuejs.org). You also have complete control over which packages you use to do things like make HTTP requests or style your project.

Your users should be able to:

- See all countries from the API on the homepage
- Search for a country using an `input` field
- Filter countries by region
- Click on a country to see more detailed information on a separate page
- Click through to the border countries on the detail page
- Toggle the color scheme between light and dark mode _(optional)_

### Screenshot

![](<./screenshots/Screenshot%20(129).png>)
![](<./screenshots/Screenshot%20(130).png>)
![](<./screenshots/Screenshot%20(131).png>)

### Links

- Solution URL: [Solution URL here](https://your-solution-url.com)
- Live Site URL: [Live site URL here](https://allaroundtheworld-api.netlify.app/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- Mobile-first workflow
- Javascript
- [Tailwind](https://tailwindcss.com/docs/installation) - CSS Framework

### What I learned

This was a really nice project, was a bit challenging but loved the experience all through while building this. I was very happy building this project, because it would be first real project I feel I can include on my portfolio, but it feels really nice.

I learned so much building this, starting from the css, I learnt how to toggle background colors easily with a little trick from css and javascript. This is far easier than my previous approach in toggling background colors.

Also, in javascript, I learned how to work with searchStrings, making it search for match in an object and returning a whole object if it found a match.

I also worked with the `sort()` method. I learnt how it truly works, it's very easy, so I used it sort the json data I got from making the ajax call from the restcountriesapi.

```css
:root {
  --primary-color-el: hsl(209, 23%, 22%);
  --primary-color-bg: hsl(207, 26%, 17%);
  --primary-color-txt: hsl(0, 0%, 100%);
}

.light-theme {
  --primary-color-el: hsl(0, 0%, 100%);
  --primary-color-bg: hsl(0, 0%, 98%);
  --primary-color-txt: hsl(200, 15%, 8%);
  --primary-color-inpt: hsl(0, 0%, 52%);
}
```

```js
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


  searchCountries(e) {
    const searchString = e.target.value.toLowerCase();
    const searchFilter = this.data.filter((country) => {
      return country.name.common.toLowerCase().includes(searchString) || country.name.official.toLowerCase().includes(searchString);
    });
    this.renderCountry(searchFilter);

    if (searchFilter.length === 0) document.querySelector(".loader-moana-input").classList.remove("hide-loader");
    else document.querySelector(".loader-moana-input").classList.add("hide-loader");
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
```

### Continued development

I'll continue to develop myself as a developer, my aim is to be the best version of myself in this coding journey.

### Useful resources

- [Font Awesome](https://fontawesome.com/) - All Icons used are from font awesome.
- [TailwindCSS](https://tailwindcss.com/docs/installation) - This helped styling the page much faster and easier.
- [Leaflet](https://leafletjs.com/index.html) - This is a js library used for the maps renderd on the details page.

## Author

- Website - [Abdullah Ayoola](https://github.com/abdullah43577)
- Frontend Mentor - [@abdullah43577](https://www.frontendmentor.io/profile/abdullah43577)
- Twitter - [@officialayo540](https://twitter.com/officialayo540)
