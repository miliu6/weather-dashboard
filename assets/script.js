// var searchButtonEl = document.querySelector('#search-button');
// var searchCityEl = document.querySelector('#search-city');
// var historyEl = document.querySelector('#history');
// var apiKey = "4b9b6edec9e1e68028e9e58e3975e5a1";
// var forecastEl = document.querySelector('#forecast');
// var today = moment().format("LL");

// var search = function(event) {
//     event.preventDefault();

//     var cityName = searchCityEl.value;
//     if(cityName) {
//         getWeather(cityName);
//     } else {
//         alert('Please search for a city');
//         return;
//     }

//     var previousCityNames = json.parse(localStorage.getItem("searchHistory"));
//     if(previousCityNames == null) {
//         previousCityNames = [];
//     }
//     previousCityNames.push(cityName);
//     localStorage.setItem("searchHistory", json.stringify(previousCityNames));
//     displayHistory();
// };

// var getWeather = function(city) {
//     var apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}";

//     $.ajax({
//         url: queryUrl,
//         method: "GET"
//     }).then(function(cityWeatherResults) {
//         console.log(cityWeatherResults);

//         $("#weatherContent").css("display", "block");
//         $("#todays").empty();

//         var iconCode = cityWeatherResults.weather[0].icon;
//         var iconUrl = "https://openweathermap.org/img/w/${iconCode}.png";
//     })
// }


var apiKey = "4b9b6edec9e1e68028e9e58e3975e5a1";
// Moment.js time format
var today = moment().format('LL');
// created an array for searched history 
var searchHistoryList = [];



// function for current weather condition 
function currentWeather(city) {

    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(cityWeatherResults) {
        console.log(cityWeatherResults);
        
        $("#weatherContent").css("display", "block");
        $("#cityStyle").empty();
        
        var iconCode = cityWeatherResults.weather[0].icon;
        var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;

        //city name and date
        // an icon representation of weather conditions
        // the temperature, the humidity
        // the wind speed
        var currentCity = $(`
            <h2 id="currentCity">
                ${cityWeatherResults.name} ${today} <img src="${iconURL}" alt="${cityWeatherResults.weather[0].description}" />
            </h2>
            <p>Temperature: ${cityWeatherResults.main.temp} °F</p>
            <p>Humidity: ${cityWeatherResults.main.humidity}\%</p>
            <p>Wind Speed: ${cityWeatherResults.wind.speed} MPH</p>
        `);

        $("#cityStyle").append(currentCity);

        // UV index
        var lat = cityWeatherResults.coord.lat;
        var lon = cityWeatherResults.coord.lon;
        var uviQueryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        $.ajax({
            url: uviQueryURL,
            method: "GET"
        }).then(function(uviResults) {
            console.log(uviResults);

            var uvIndex = uviResults.value;
            var uvIndexP = $(`
                <p>UV Index: 
                    <span id="uvIndexColor" class="px-2 py-2 rounded">${uvIndex}</span>
                </p>
            `);

            $("#cityStyle").append(uvIndexP);

            futureWeather(lat, lon);

            // WHEN I view the UV index
            // THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
            // 0-2 green#3EA72D, 3-5 yellow#FFF300, 6-7 orange#F18B00, 8-10 red#E53210, 11+violet#B567A4
            if (uvIndex >= 0 && uvIndex <= 2) {
                $("#uvIndexColor").css("background-color", "#3EA72D").css("color", "white");
            } else if (uvIndex >= 3 && uvIndex <= 5) {
                $("#uvIndexColor").css("background-color", "#FFF300");
            } else if (uvIndex >= 6 && uvIndex <= 7) {
                $("#uvIndexColor").css("background-color", "#F18B00");
            } else if (uvIndex >= 8 && uvIndex <= 10) {
                $("#uvIndexColor").css("background-color", "#E53210").css("color", "white");
            } else {
                $("#uvIndexColor").css("background-color", "#B567A4").css("color", "white"); 
            };  
        });
    });
}

// function for future condition
function futureWeather(lat, lon) {

    // THEN I am presented with a 5-day forecast
    var futureForecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;

    $.ajax({
        url: futureForecastURL,
        method: "GET"
    }).then(function(futureResponse) {
        console.log(futureResponse);
        $("#fiveDay").empty();
        
        for (let i = 1; i < 6; i++) {
            var cityInfo = {
                date: futureResponse.daily[i].dt,
                icon: futureResponse.daily[i].weather[0].icon,
                temp: futureResponse.daily[i].temp.day,
                humidity: futureResponse.daily[i].humidity
            };

            var currDate = moment.unix(cityInfo.date).format("MM/DD/YYYY");
            var iconURL = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png" alt="${futureResponse.daily[i].weather[0].main}" />`;

            // displays the date
            // an icon representation of weather conditions
            // the temperature
            // the humidity
            var futureCard = $(`
                <div class="pl-3">
                    <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem;>
                        <div class="card-body">
                            <h5>${currDate}</h5>
                            <p>${iconURL}</p>
                            <p>Temp: ${cityInfo.temp} °F</p>
                            <p>Humidity: ${cityInfo.humidity}\%</p>
                        </div>
                    </div>
                <div>
            `);

            $("#fiveDay").append(futureCard);
        }
    }); 
}

// add on click event listener 
 
$("#searchBtn").on("click", function(event) {
    event.preventDefault();
   
       
    var city = $("#enterCity").val().trim();
    currentWeather(city);
    if (!searchHistoryList.includes(city)) {
        searchHistoryList.push(city);
        var searchedCity = $(`
            <li class="list-group-item">${city}</li>
            `);
        $("#searchHistory").append(searchedCity);
    };
    

    
    localStorage.setItem("city", JSON.stringify(searchHistoryList));
    console.log(searchHistoryList);
});

$(document).on('keypress', function (e) {
    if (e.which == 13) {
        var city = $("#enterCity").val().trim();
        currentWeather(city);
        if (!searchHistoryList.includes(city)) {
            searchHistoryList.push(city);
            var searchedCity = $(`
                <li class="list-group-item">${city}</li>
                `);
            $("#searchHistory").append(searchedCity);
        };


        localStorage.setItem("city", JSON.stringify(searchHistoryList));
        console.log(searchHistoryList);
    }
});


// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
$(document).on("click", ".list-group-item", function() {
    var listCity = $(this).text();
    currentWeather(listCity);
});

// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast
$(document).ready(function() {
    var searchHistoryArr = JSON.parse(localStorage.getItem("city"));

    if (searchHistoryArr !== null) {
        var lastSearchedIndex = searchHistoryArr.length - 1;
        var lastSearchedCity = searchHistoryArr[lastSearchedIndex];
        currentWeather(lastSearchedCity);
        console.log(`Last searched city: ${lastSearchedCity}`);
    }
});