const Header = (props) => <h1>{props.course}</h1>

const Content = (props) => {
  return (
    <div>
      <ul>
        {props.parts.map(part =>
          <Part key={part.id} part={part} />
        )}
      </ul>
    </div>
  )
}

const Part = (props) => (
  <li>
    {props.part.name} {props.part.exercises}
  </li>
)

const Total = (props) => <p>Number of exercises {props.total}</p>

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
    </div>
  )
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}

export default App