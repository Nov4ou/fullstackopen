import { useState } from 'react'

const Person = (props) => (
  <p>{props.name}</p>
)

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ])
  const [newName, setNewName] = useState('')

  const isNameExists = (name) => {
    return persons.some((persons) => persons.name === name)
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (isNameExists(newName)) {
      alert(`${newName} is already added to phonebook`)
    }
    else {
      const personObject = {
        name: newName,
        id: String(persons.length + 1),
      }

      setPersons(persons.concat(personObject))
      setNewName('')
    }
  }

  const handlePersonChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handlePersonChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map(person =>
        <Person key={person.name} name={person.name} />
      )}
    </div>
  )
}

export default App