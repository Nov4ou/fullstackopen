import { useEffect, useState } from 'react'
import axios from 'axios'

const Find = ({ filter, handleFilterChange }) => (
  <div>
    <p>
      find countries
      <input value={filter} onChange={handleFilterChange} />
    </p>
  </div>
)

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
    const capital = country.capital
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${API_KEY}&units=metric`

    axios
      .get(url)
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.log("Error fetching weather:", error)
      })
  }, [country])

  return (
    <div>
      <div>
        <h1>{country.name.common}</h1>
        <p>Capital {country.capital}</p>
        <p>Area {country.area}</p>
        <h2>Language</h2>
        <ul>
          {/* {Object.values(country.languages).map((languages, index) =>
        <li key={index}>{languages}</li> 
      )} */}
          {Object.entries(country.languages).map(([code, language]) =>
            <li key={code}>{language}</li>
          )}
        </ul>
        <img src={country.flags.png} alt={country.alt} />
      </div>

      <div>
        <h2>Weather in {country.capital}</h2>
        {weather ? (
          <div>
            <p>Temperature: {weather.main.temp} Celsius</p>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <p>Wind: {weather.wind.speed} m/s</p>
          </div>
        ) : (
          <p>Loading weather...</p>
        )}
      </div>
    </div>
  )
}

const Country = ({ filteredCountries, filter, handleShow, selectedCountry }) => {
  if (filteredCountries.length >= 10 && filter) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  }
  else {
    if (filteredCountries.length == 1) {
      return (
        <CountryDetails country={filteredCountries[0]} />
      )
    }
    else {
      return (
        <div>
          {filteredCountries.map(country =>
            <p key={country.cca3}>
              {country.name.common}
              <button onClick={() => handleShow(country)}>Show</button>
              {selectedCountry && selectedCountry.name.common === country.name.common ? (
                <CountryDetails country={selectedCountry} />
              ) : null}
            </p>
          )}
        </div>
      )
    }
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    console.log('effect')
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [])
  console.log('render', countries.length, 'countries')

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const handleShow = (country) => {
    if (selectedCountry && selectedCountry.name.common === country.name.common) {
      setSelectedCountry(null)
    }
    else {
      setSelectedCountry(country)
    }
  }

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )
  console.log('render', filteredCountries.length, 'filtered countries')

  return (
    <div>
      <Find value={filter} handleFilterChange={handleFilterChange} />
      <Country
        filteredCountries={filteredCountries}
        filter={filter}
        handleShow={handleShow}
        selectedCountry={selectedCountry}
      />

    </div>
  )
}

export default App