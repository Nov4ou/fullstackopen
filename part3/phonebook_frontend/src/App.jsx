import { useEffect, useState } from 'react'
import axios from 'axios'
import phonebookService from './services/phonebook'

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    filter shown with <input value={filter} onChange={handleFilterChange} />
  </div>
)

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={message.type}>
      {message.text}
    </div>
  )
}

const PersonForm = ({
  addPerson,
  newName,
  handlePersonChange,
  newNumber,
  handleNumberChange
}) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handlePersonChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Person = ({ filteredPersons, handleDelete }) => (
  <div>
    {filteredPersons.map(person =>
      <p key={person.id}>
        {person.name} {person.number}
        <button onClick={() => handleDelete(person)}>delete</button>
      </p>
    )}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setNewFilter] = useState('')
  const [addMessage, setAddMessage] = useState({ text: null, type: '' })

  useEffect(() => {
    console.log('effect')
    phonebookService
      .getAll()
      .then(respnose => {
        console.log('promise fulfilled')
        setPersons(respnose.data)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const isNameExists = (name) => {
    return persons.some((persons) => persons.name === name)
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (isNameExists(newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(person => person.name === newName)
        const changePerson = { ...person, number: newNumber }
        phonebookService
          .update(changePerson.id, changePerson)
          .then(response => {
            setPersons(persons.map(person => person.name === newName ? response.data : person))
          })
          .catch(error => {
            setAddMessage({ text: `Information of ${newName} has already been removed from server`, type: 'error' })
            setTimeout(() => {
              setAddMessage({ text: null, type: '' })
            }, 5000)
          })
      }
    }
    else {
      const personObject = {
        name: newName,
        number: newNumber,
        // id: String(persons.length + 1),
      }

      phonebookService
        .create(personObject)
        .then(respnose => {
          setAddMessage({ text: `Add ${newName}`, type: 'success' })
          setTimeout(() => {
            setAddMessage({ text: null, type: '' })
          }, 5000)
          console.log('person:', respnose)
          console.log('whole', persons)
          setPersons(persons.concat(respnose))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    }
    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
  }

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      phonebookService
        .deletePhonebook(person.id)
        .then(reponse => {
          setPersons(persons.filter(persons => persons.id != person.id))
        })
    }
  }

  const handlePersonChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={addMessage} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handlePersonChange={handlePersonChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Person filteredPersons={filteredPersons} handleDelete={handleDelete} />

    </div>
  )
}

export default App