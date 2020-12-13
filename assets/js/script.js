// Variables added to store reference form the form element with an id of user form and the associated input
var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#cityname");
var searchHistory = document.querySelector("#search-history");

// variables to display the content
var currentWeatherContainerEl = document.querySelector("#current-weather-container");
var futureWeatherContainerEl = document.querySelector("#future-weather-container");

var futureIconId = [];
var currentCitySearch = [];

// ------------------------------- Load Cities from Local Storage -------------------------------
var loadSearchHistory = function() {
    var citySearch = JSON.parse(localStorage.getItem("citySearch"));
    if (!citySearch) {
        var citySearch = [];
    }
    else {
        console.log(citySearch);
        populateSearchHistory(citySearch);
    }    
};

// ------------------------------- Update the search history -------------------------------
var updateSearchHistory = function(city) {    
    if (currentCitySearch.includes(city)) {
        // city is already in the currentCitySearch array
        var indexOfCity = currentCitySearch.indexOf(city);
        console.log(indexOfCity);
        currentCitySearch.splice(indexOfCity, 1);
        console.log(currentCitySearch);
        currentCitySearch.unshift(city);
    }
    else {
        // city has not been searched before
        currentCitySearch.unshift(city); 
    }
    //populate the search history given the above data
    populateSearchHistory(currentCitySearch);
};

// ------------------------------- Populate the Search history -------------------------------
var populateSearchHistory = function(citySearch) {
    // searchHistory is the #search-history id
    searchHistory.textContent = "";
    
    for (i = 0; i < citySearch.length; i++) {
        var searchHistoryEntry = document.createElement("li");
        searchHistoryEntry.classList = "card-content-history"; // adds style
        searchHistoryEntry.setAttribute("city", citySearch[i]);
        // set the text content to the saved array value
        searchHistoryEntry.textContent = citySearch[i];
        searchHistoryEntry.classList.add = "click-city";

        // append to container
        searchHistory.appendChild(searchHistoryEntry);
    };
    // update array
    currentCitySearch = citySearch;
    // save the searched
    saveSearchHistory(citySearch);
};

// ------------------------------- Save Search Histoy to Local Storage -------------------------------
var saveSearchHistory = function(citySearch) {
    localStorage.setItem("citySearch", JSON.stringify(citySearch));
};

// -------------------------------Get Weather Data -------------------------------
var getWeather = function(city) {
    // format the github api url
    var apiCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=21c61ce7ed658094b3e31aec36acdd81";
    
    // use this to test 
    //"https://api.openweathermap.org/data/2.5/weather?q=London&appid=21c61ce7ed658094b3e31aec36acdd81";

    // make a request to the url
    fetch(apiCurrent).then(function(response) {
        response.json().then(function(data) {
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            //console.log(lat, lon);
            // call for UV (need the lat and lon from above call to make the UV call)
            var apiUV = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=21c61ce7ed658094b3e31aec36acdd81";
            fetch(apiUV).then(function(response) {
                response.json().then(function(info) {
                    // call function to display the data that we just got.
                    displayWeather(city, info);  
                });
            });           
      });
    });
};

// ------------------------------- Display the data -------------------------------
var displayWeather = function(city, info) {
    
    // check if api returned any repos.  if user has a user name but no repos
    if (info.length === 0) {
        console.log("no data");
        //currentWeatherContainerEl.textContent = "No City found.";
        return;
    }
    
    // clear old content
    currentWeatherContainerEl.textContent = "";

    // format the incoming information
    var cityName = city;
    var temp = info.current.temp;
    var humid = info.current.humidity;
    var windSpeed = info.current.wind_speed;
    var uvIndex = info.current.uvi;
    // date information
    var date = info.current.dt;
    var dateFormat = new Date(date*1000);
    var month = dateFormat.getMonth() + 1;
    var day = dateFormat.getDate();
    var year = dateFormat.getFullYear();

    // create a container for the current weather data
    var currentEl = document.createElement("div");
    currentEl.classList = "list-item flex-column justify-space-between align-start";

    // create a span element to hold data
    var titleEl = document.createElement("span");
    titleEl.textContent = cityName + " (" + month + "/" + day + "/" + year + ") ";
    titleEl.id = "current-title";
    titleEl.classList = "current-header";

    // append to container
    currentEl.appendChild(titleEl);

    // create a span element to hold data
    var tempEl = document.createElement("span");
    tempEl.textContent = "Temperature: " + temp + " " + String.fromCharCode(176) + "F";

    // append to container
    currentEl.appendChild(tempEl);

    // create a span element to hold data
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + humid + " %";

    // append to container
    currentEl.appendChild(humidityEl);

    // create a span element to hold data
    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + windSpeed + " MPH";

    // append to container
    currentEl.appendChild(windSpeedEl);

    // create a span element to hold data
    var uvIndexEl = document.createElement("span");
    uvIndexEl.textContent = "UV Index: ";
    var uvIndexStatus = document.createElement("span");


    //check the UV index
    if (uvIndex <= 2) {
        uvIndexStatus.innerHTML = uvIndex;
        uvIndexStatus.classList = "uv-favorable";
        uvIndexEl.appendChild(uvIndexStatus);
    }
    else if (uvIndex >= 8) {
        uvIndexStatus.innerHTML = uvIndex;
        uvIndexStatus.classList = "uv-severe";
        uvIndexEl.appendChild(uvIndexStatus);
    }
    else {
        uvIndexStatus.innerHTML = uvIndex;
        uvIndexStatus.classList = "uv-moderate";
        uvIndexEl.appendChild(uvIndexStatus);
    }

    // append to container
    currentEl.appendChild(uvIndexEl);

    // append container to the dom
    currentWeatherContainerEl.appendChild(currentEl);

    // date information
    var date = info.daily[0].dt;
    var dateFormat = new Date(date*1000);
    console.log(dateFormat);

    // 5 Day Forecast

    // id arrray
    var forecastDay = ["#day0", "#day1", "#day2", "#day3", "#day4"];
    
    for (var i = 0; i < 5; i++) {
        // locate the forcast element
        var futureEl = document.querySelector(forecastDay[i]);
        futureEl.classList = "list-item-future flex-column justify-space-between align-start";
        futureEl.textContent = "";
    
        // get the date
        var date = info.daily[i].dt;
        var dateFormat = new Date(date*1000);
        var month = dateFormat.getMonth() + 1;
        var day = dateFormat.getDate();
        var year = dateFormat.getFullYear();

        // create the container for the date
        var dateEl = document.createElement("span");
        dateEl.textContent = month + "/" + day + "/" + year;
        //dateEl.id = "future" + i;
        dateEl.classList = "future-header";

        // append to container
        futureEl.appendChild(dateEl);

        // create span for the icon
        var iconEl = document.createElement("span");
        iconEl.textContent = "";
        iconEl.id = "future" + i;
        futureIconId[i] = "#future" + i;

        // append to the container
        futureEl.appendChild(iconEl);


        // get the temperature
        var temp = info.daily[i].temp.day;
        
        // create container for the temperature
        var futureTempEl = document.createElement("span");
        futureTempEl.textContent = "Temp: " + temp + " " + String.fromCharCode(176) + "F";
        futureTempEl.classList = "future-text";

        // append to container
        futureEl.appendChild(futureTempEl);
        
        // get the humidity
        var humid = info.daily[i].humidity;
        
        // create container for the humidity
        var futureHumEl = document.createElement("span");
        futureHumEl.textContent = "Humidity: " + humid + " %";
        futureHumEl.classList = "future-text";

        // append to container
        futureEl.appendChild(futureHumEl);
    }
    // call function to display the icons for the displayed data
    displayIcons(info);
    // update the search history
    updateSearchHistory(city);
};

// ------------------------------- Display Icons -------------------------------
var displayIcons = function(data) {
    // weather icon current
    var currentIcon = document.querySelector("#current-title");
    var currentWeatherIcon = data.current.weather[0].icon;
    var currentWeatherImage =document.createElement("img");
    currentWeatherImage.setAttribute("src", "http://openweathermap.org/img/w/" + currentWeatherIcon + ".png");
    currentIcon.appendChild(currentWeatherImage);
    
    for (var i = 0; i < 5; i++) {
        // locate the forcast element
        var futureIcon = document.querySelector(futureIconId[i]);

        var futureWeatherIcon = data.daily[i].weather[0].icon;
        var futureWeatherImage =document.createElement("img");
        futureWeatherImage.setAttribute("src", "http://openweathermap.org/img/w/" + futureWeatherIcon + ".png");
        futureIcon.appendChild(futureWeatherImage);
    };
};

// ------------------------------- Event listeners and form control -------------------------------
var formSubmitHandler = function(event) {
    event.preventDefault(); // prevents default action of browser, we then can specify what to do
    // get value from input element
    var city = cityInputEl.value.trim(); // get the input from the form.  trim() to get rd of any extra spaces at beg or end

    if (city) {         // if there is a username  entered
        getWeather(city); // call function with the entered user name
        //nameInputEl.value = ""; // then clear the form to get ready for the next request
    } else {
        alert("Please enter a city");
    }
    cityInputEl.value = "";
};

// event listener for previously searched cities
$(searchHistory).on("click", function(event) {
    if (event.target.classList.contains("card-content-history")) {
        var currentCityClick = event.target.innerHTML;
        console.log(currentCityClick);
    }
    else {
        return;
    }
    getWeather(currentCityClick);
});

// listen for submit in the form
userFormEl.addEventListener("submit", formSubmitHandler);

// ------------------------------- Auto run on reload -------------------------------
loadSearchHistory();