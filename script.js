//Funzione che aspetta caricamento del DOM e attua fadeout del body
document.addEventListener("DOMContentLoaded", function(){
    document.body.classList.add('fade');  
   
    

let APIKEY = '54ad6d3736f06a74a09574cce356089d';
let cityName = document.getElementById("cityName");
let countryName = document.getElementById("country");
let weatherTime = document.getElementById("weatherTime");
let weatherDay = document.getElementById("weatherDay");
let tempValue = document.getElementById("tempValue");
let weatherPressure = document.getElementById("weatherPressure")
let weatherHumidity = document.getElementById("weatherHumidity")
let weatherWind = document.getElementById("weatherWind");
let weatherFeelslike = document.getElementById("weathertempfeelslike");
let weatherForecast = document.querySelector(".weather-forecast");
let weatherUnits= document.getElementById(".unit")
let weatherDescription= document.getElementById(".weatherDescription");
let inputval = document.querySelector('#cityinput')
let btn = document.getElementById('add')


//Funzione per ottenere lat e lon
navigator.geolocation.getCurrentPosition(position => {
    const {
        latitude,
        longitude
    } = position.coords;
    // Show a map centered at latitude / longitude.
   // console.log(latitude, longitude)

    getWeather(latitude, longitude);
    getCurrentWeather(latitude, longitude);
})

//Funzione per ottenere meteo corrente
async function getWeather(latitude, longitude) {
    let APIUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=metric&appid=${APIKEY}`;

    await fetch(APIUrl).then(response => {
        return response.json();
    }).then(data => {
        console.log(data)
  
    /*let time = new Date(data.current.dt * 1000);
    let day = time.toDateString().split(" ")[0];
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let formattedTime = `${hours}:${minutes}`;
    weatherTime.innerHTML = formattedTime;
    weatherDay.innerHTML = day;
    cityName.innerHTML = data.current.clouds;*/

    tempValue.innerHTML = (data.current.temp).toFixed(0);
    weatherPressure.innerHTML = data.current.pressure;
    weatherHumidity.innerHTML = data.current.humidity;
    weatherWind.innerHTML = data.current.wind_speed;
    weatherFeelslike.innerHTML = data.current.feels_like;

    document.getElementById("weatherIcon").src=  "http://openweathermap.org/img/w/" +data.current.weather[0].icon+ ".png";
    showFiveDayForecast(data);
       

    //Funzione per ottenere previsioni di 6 giorni
    function showFiveDayForecast(data) {
        for (let i = 1; i < 6; i ++ ) {
      // getting the day name for the weather forecast
      let timezone = data.timezone_offset;
      let dayWeek = new Date(data.daily[i].dt*1000+timezone*1000);
      let day = dayWeek.toDateString().split(" ")[0];
      //console.log(dayWeek)     
      let weatherForecast = document.querySelector(".weather-forecast");
      //console.log(weatherForecast)
      let div = document.createElement("div");
      div.setAttribute("id", "weather-forecast-day-" + i);
      div.innerHTML =    `
         <h3>${day}</h3>
         <img src=${"http://openweathermap.org/img/wn/" +data.daily[i].weather[0].icon+ "@2x"+".png"} alt=${data.daily[i].weather[0].main}">
        <p>${(data.daily[i].temp.max).toFixed(0)}°<br>${(data.daily[i].temp.min).toFixed(1)}°</p>     `
          weatherForecast.appendChild(div);
    }};

})}

//Funzione per ottenere il nome della posizione corrente
async function getCurrentWeather(latitude, longitude) {
    let APIUrl2 = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKEY}`;

    fetch(APIUrl2).then(resp => {
        return resp.json();
    }).then(currentObj => {
        console.log(currentObj)
        cityName.innerHTML = currentObj.name;
        document.getElementById("weatherDescription").innerHTML= currentObj.weather[0].description;
        countryName.innerHTML = currentObj.sys.country;
        document.getElementById("country").innerHTML= countryName.innerHTML;
    })};

//Funzione per inviare un click premendo Enter e ottenere i dati meteo
document.getElementById('cityinput').addEventListener('keypress', keyPressFunc);  
function keyPressFunc(evt) {
    if (evt.key === 'Enter') {
    return inputWeather();
}}

//Funzione click e ottenere i dati meteo
document.getElementById('add').onclick = function() {
    return inputWeather();
}

//Quando premo sulla X, mi mette focus sulla barra di ricerca
document.getElementById('reset').onclick = function() {
    document.getElementById('cityinput').value = '';
    document.getElementById("cityinput").focus();
}


//Funzione per ottenere meteo settimanale dall'imput
 function inputWeather(){

         
         fetch('https://api.openweathermap.org/data/2.5/weather?q='+inputval.value+'&units=metric&appid='+APIKEY)
         .then(response => response.json())
         .then(inputWeather => {
            console.log(inputWeather)

             /*console.log(inputWeather)
             d = new Date()
             localTime = d.getTime()
             var localOffset = d.getTimezoneOffset() * 60000
             utc = localTime - localOffset
             var atlanta = utc + (1000 * -7200)
            nd = new Date(atlanta)
             let timezone_offset = inputWeather.timezone;
             let day1 = new Date(inputWeather.dt*1000+timezone_offset*1000);    
            let day2=  day1.toDateString().split(" ")[0];       
              let hours = day1.getHours();
             let minutes = day1.getMinutes();
             let formattedTime = `${hours}:${minutes}`;
            weatherTime.innerHTML = formattedTime;
             weatherDay.innerHTML = day2;    */  

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

//Funzione per ottenere meteo corrente dall'imput
 function getCurrentWeather2(latitude1, longitude2) {

    let APIUrl3 = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude1}&lon=${longitude2}&exclude=minutely,hourly,alerts&units=metric&appid=${APIKEY}`;

    fetch(APIUrl3).then(response => {
        return response.json();
    }).then(WeekInputWeather => {

        for (let i = 1; i < 6; i ++ ) {

            let timezone = WeekInputWeather.timezone_offset;
            let dayWeek = new Date(WeekInputWeather.daily[i].dt*1000+timezone*1000);
            let day = dayWeek.toDateString().split(" ")[0];
            //console.log(dayWeek)     
            //let weatherForecast = document.createElement("div");
           // weatherForecast.id = "weather-container";
            //console.log(weatherForecast)
            //let div = document.createElement("div");
            //div.setAttribute("id","weather-forecast-day-" + i);
            let div= document.getElementById("weather-forecast-day-" + i);
            div.innerHTML =    `
            <h3>${day}</h3>
            <img src=${"http://openweathermap.org/img/wn/" +WeekInputWeather.daily[i].weather[0].icon+ "@2x"+".png"} alt=${WeekInputWeather.daily[i].weather[0].main}">
           <p>${(WeekInputWeather.daily[i].temp.max).toFixed(0)}°<br>${(WeekInputWeather.daily[i].temp.min).toFixed(1)}°</p>     `
           weatherForecast.appendChild(div);
            
}})};



});