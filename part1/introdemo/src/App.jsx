const Hello = (props) => {
  console.log(props)
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
    </div>
  )
}

// const App = () => {
//   const name = 'Peter'
//   const age = 10

//   return (
//     <div>
//       <h1>Greetings</h1>
//       <Hello name='George' age={26 + 10} />
//       <Hello name={name} age={age} />
//     </div>
//   )
// }

const App = () => {
  const friends = ['Peter', 'Maya']

  return (
    <div>
      <p>{friends}</p>
    </div>
  )
}

export default App