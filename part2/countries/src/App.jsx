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

const CountryDetails = ({ country }) => (
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
)

const Country = ({ filteredCountries, filter }) => {
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

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )
  console.log('render', filteredCountries.length, 'filtered countries')

  return (
    <div>
      <Find value={filter} handleFilterChange={handleFilterChange} />
      <Country filteredCountries={filteredCountries} filter={filter} />
    </div>
  )
}

export default App