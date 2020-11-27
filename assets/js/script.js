// Variables added to store reference form the form element with an id of user form and the associated input
var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#cityname");

// variables to display the content
var currentWeatherContainerEl = document.querySelector("#current-weather-container");


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
            console.log(lat, lon);
            // call for UV (need the lat and lon from above call to make the UV call)
            var apiUV = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=21c61ce7ed658094b3e31aec36acdd81";
            fetch(apiUV).then(function(response) {
                response.json().then(function(info) {
                    console.log(info);
                    displayWeather(data, city, info); 
                });
            });
            //displayWeather(data, city, info);          
            //console.log(data);

      });
    });

    // call UV index API, but need the lat and long
    // var lat = data.coord.lat;
    // var lon = data.coord.lon;
    // console.log(lat, lon);

    // alternate text with error handling
    // fetch(apiUrl)
    //     .then(function(response) {
    //     // request was successful
    //     if (response.ok) {
    //         response.json().then(function(data) {
    //             displayRepos(data, user);
    //         });
    //     } else {
    //         alert("Error: " + response.statusText);
    //     }
    // })
    // .catch(function(error) { //catched network errors
    //     // Notice this `.catch()` getting chained onto the end of the `.then()` method
    //     alert("Unable to connect to GitHub");
    // });

};
//getWeather();


var displayWeather = function(data, city, uvInfo) {
    // check if api returned any repos.  if user has a user name but no repos
    if (data.length === 0) {
        console.log("no data");
        //currentWeatherContainerEl.textContent = "No City found.";
        return;
    }
    
    // clear old content
    //repoContainerEl.textContent = "";
    //repoSearchTerm.textContent = searchTerm; // this will display the search term on the screen

    currentWeatherContainerEl.textContent = city;
    //currentWeatherContainerEl.id = "current-title";

    console.log(data);
    console.log(city);

    // format the incoming information
    var cityName = city;
    var temp = data.main.temp;
    var humid = data.main.humidity;
    var windSpeed = data.wind.speed;
    var date = data.dt;
    var dateFormat = new Date(date*1000);
    var str = dateFormat.getMonth() + 1;
    console.log(str);
    // var test = dateFormat.getDate;
    // console.log("test" + test);

    // from UV
    //var date = uvInfo.date_iso;
    var uvIndex = uvInfo.value;

    console.log(cityName, temp, humid, windSpeed, date, str, uvIndex);

    
    
    // create a container for the current weather data
    var currentEl = document.createElement("div");
    currentEl.classList = "list-item flex-column justify-space-between align-start";
    

    // create a span element to hold data
    var titleEl = document.createElement("span");
    titleEl.textContent = cityName;
    titleEl.id = "current-title";
    //titleEl.classList = ""

    // append to container
    currentEl.appendChild(titleEl);

    // create a weather icon element
    // var currentIconEl = document.createElement("span");
    // currentIconEl.classList = "flex-row align-center";
    // var currentWeatherIcon = data.weather[0].icon;
    // var currentWeatherImage =document.createElement("img");
    // currentWeatherImage.setAttribute("src", "http://openweathermap.org/img/w/" + currentWeatherIcon + ".png");
    // currentIconEl.appendChild(currentWeatherImage);

    // currentIconEl.appendChild(titleEl);

    // var iconCode = data.weather[0].icon;
    // console.log(iconCode);
    // var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
    // currrentWeatherIconEl.innerHTML = "<img src='" + iconUrl  + "'>";


    
    // // weather icon
    // var currentIcon = document.querySelector("#current-title");
    // currentIcon.innerHTML = "";
    // var currentWeatherIcon = data.weather[0].icon;
    // var currentWeatherImage =document.createElement("img");
    // currentWeatherImage.setAttribute("src", "http://openweathermap.org/img/w/" + currentWeatherIcon + ".png");
    // currentIcon.appendChild(currentWeatherImage);
    
    
    
    
    
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
    uvIndexEl.textContent = "UV Index: " + uvIndex;

    // append to container
    currentEl.appendChild(uvIndexEl);

    // append container to the dom
    currentWeatherContainerEl.appendChild(currentEl);

    displayIcons(data);
};





var displayIcons = function(data) {
    // weather icon
    var currentIcon = document.querySelector("#current-title");
    //currentIcon.innerHTML = "";
    var currentWeatherIcon = data.weather[0].icon;
    var currentWeatherImage =document.createElement("img");
    currentWeatherImage.setAttribute("src", "http://openweathermap.org/img/w/" + currentWeatherIcon + ".png");
    currentIcon.appendChild(currentWeatherImage);
}






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
};




userFormEl.addEventListener("submit", formSubmitHandler);