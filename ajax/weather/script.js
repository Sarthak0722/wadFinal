function getWeather() {
    const city = document.getElementById('cityInput').value.trim().toLowerCase();
  
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "weather.json", true);
    xhr.onload = function () {
      if (this.status === 200) {
        const data = JSON.parse(this.responseText);
        const cityData = data.cities.find(c => c.name === city);
  
        const resultDiv = document.getElementById('result');
        if (cityData) {
          resultDiv.innerHTML = `
            <strong>${cityData.name}</strong><br>
            Temperature: ${cityData.temperature}<br>
            Humidity: ${cityData.humidity}<br>
            Condition: ${cityData.condition}
          `;
        } else {
          resultDiv.innerHTML = "City not found in local data.";
        }
      }
    };
    xhr.send();
  }