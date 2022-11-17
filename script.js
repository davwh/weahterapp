document.addEventListener("DOMContentLoaded", function(){
    document.body.classList.add('fade');  
    

let APIKEY = '54ad6d3736f06a74a09574cce356089d';
let cityName = document.getElementById("cityName");
let countryName = document.getElementById("country");
let tempValue = document.getElementById("tempValue");
let weatherPressure = document.getElementById("weatherPressure")
let weatherHumidity = document.getElementById("weatherHumidity")
let weatherWind = document.getElementById("weatherWind");
let weatherFeelslike = document.getElementById("weathertempfeelslike");
let weatherForecast = document.querySelector(".weather-forecast");
let weatherDescription= document.getElementById(".weatherDescription");
let inputval = document.querySelector('#cityinput')
let btn = document.getElementById('add')


//Property that returns an object that provides access to the location of the device
navigator.geolocation.getCurrentPosition(position => {
    const {
        latitude,
        longitude
    } = position.coords;
    getWeather(latitude, longitude);
    getCurrentWeather(latitude, longitude);
})

//Function to get current weather
async function getWeather(latitude, longitude) {
    let APIUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=metric&appid=${APIKEY}`;
    await fetch(APIUrl).then(response => {
        return response.json();
    }).then(data => {
        tempValue.innerHTML = (data.current.temp).toFixed(0);
        weatherPressure.innerHTML = data.current.pressure;
        weatherHumidity.innerHTML = data.current.humidity;
        weatherWind.innerHTML = data.current.wind_speed;
        weatherFeelslike.innerHTML = data.current.feels_like;

        document.getElementById("weatherIcon").src=  "http://openweathermap.org/img/w/" +data.current.weather[0].icon+ ".png";
        showFiveDayForecast(data);
       

        //Function to get 5-day forecast
        function showFiveDayForecast(data) {
            for (let i = 1; i < 6; i ++ ) {    
                // Getting the day name for the weather forecast
                let timezone = data.timezone_offset;
                let dayWeek = new Date(data.daily[i].dt*1000+timezone*1000);
                let day = dayWeek.toDateString().split(" ")[0];
                let weatherForecast = document.querySelector(".weather-forecast");
                let div = document.createElement("div");
                div.setAttribute("id", "weather-forecast-day-" + i);
                div.innerHTML =  `<h3>${day}</h3>
                <img src=${"http://openweathermap.org/img/wn/" +data.daily[i].weather[0].icon+ "@2x"+".png"} alt=${data.daily[i].weather[0].main}">
                <p>${(data.daily[i].temp.max).toFixed(0)}°<br>${(data.daily[i].temp.min).toFixed(1)}°</p>  `
                weatherForecast.appendChild(div);
            }};
    })}
    
//Function to get the name of the current position
async function getCurrentWeather(latitude, longitude) {
    let APIUrl2 = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKEY}`;
    fetch(APIUrl2).then(resp => {
        return resp.json();
    }).then(currentObj => {
        cityName.innerHTML = currentObj.name;
        document.getElementById("weatherDescription").innerHTML= currentObj.weather[0].description;
        countryName.innerHTML = currentObj.sys.country;
        document.getElementById("country").innerHTML= countryName.innerHTML;
})};

//Function to trigger "Click" by pressing Enter and get the Weather Data
document.getElementById('cityinput').addEventListener('keypress', keyPressFunc);  
function keyPressFunc(evt) {
    if (evt.key === 'Enter') {
        return inputWeather();
    }}
    
//Get Weather Data onClick
document.getElementById('add').onclick = function() {
    return inputWeather();
}

//Automatic focus on input when the X button is clicked
document.getElementById('reset').onclick = function() {
    document.getElementById('cityinput').value = '';
    document.getElementById("cityinput").focus();
}

//Function to get Weekly Weather from the input
function inputWeather(){
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+inputval.value+'&units=metric&appid='+APIKEY)
    .then(response => response.json())
    .then(inputWeather => {
        if(inputWeather.cod == 400 || inputWeather.cod == 404 ){
            alert("Enter a correct location")
        }else{
            cityName.innerHTML = inputWeather.name;
            tempValue.innerHTML = (inputWeather.main.temp).toFixed(0);
            weatherPressure.innerHTML = inputWeather.main.pressure;
            weatherHumidity.innerHTML = inputWeather.main.humidity;
            weatherWind.innerHTML = inputWeather.wind.speed;  
            document.getElementById("weatherDescription").innerHTML= inputWeather.weather[0].description;
            document.getElementById("weatherIcon").src=  "http://openweathermap.org/img/w/" +inputWeather.weather[0].icon+ ".png";
            countryName.innerHTML = inputWeather.sys.country;
            document.getElementById("country").innerHTML= countryName.innerHTML;
            let latitude1 = inputWeather.coord.lat;
            let longitude2 = inputWeather.coord.lon;
            
            getCurrentWeather2(latitude1,longitude2);
        }
    })};

//Function to get Current Weather from input
function getCurrentWeather2(latitude1, longitude2) {
    let APIUrl3 = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude1}&lon=${longitude2}&exclude=minutely,hourly,alerts&units=metric&appid=${APIKEY}`;
    fetch(APIUrl3).then(response => {
        return response.json();
    }).then(WeekInputWeather => {
        for (let i = 1; i < 6; i ++ ) {
            let timezone = WeekInputWeather.timezone_offset;
            let dayWeek = new Date(WeekInputWeather.daily[i].dt*1000+timezone*1000);
            let day = dayWeek.toDateString().split(" ")[0];
            let div= document.getElementById("weather-forecast-day-" + i);
            div.innerHTML = `<h3>${day}</h3>
            <img src=${"http://openweathermap.org/img/wn/" +WeekInputWeather.daily[i].weather[0].icon+ "@2x"+".png"} alt=${WeekInputWeather.daily[i].weather[0].main}">
            <p>${(WeekInputWeather.daily[i].temp.max).toFixed(0)}°<br>${(WeekInputWeather.daily[i].temp.min).toFixed(1)}°</p>`
            weatherForecast.appendChild(div);
        }})};
    });
