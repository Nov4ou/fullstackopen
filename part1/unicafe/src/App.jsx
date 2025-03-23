import { act, useState } from 'react'

const Header = (props) => {
  return (
    <div>
      <h1>
        {props.text}
      </h1>
    </div>
  )
}

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const Statistics = (props) => {
  if (props.feedback[3].value == 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }

  return (
    <div>
      <h1>statistics</h1>
      <p>good {props.feedback[0].value}</p>
      <p>neutral {props.feedback[1].value}</p>
      <p>bad {props.feedback[2].value}</p>
      <p>all {props.feedback[3].value}</p>
      <p>average {props.feedback[4].value}</p>
      <p>positive {(props.feedback[5].value * 100)} %</p>
    </div>
  )
}



const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const handleGoodClick = () => {
    const updatedGood = good + 1
    const updatedTotal = total + 1
    const updatedAverage = (updatedGood - bad) / updatedTotal
    const updatedPositive = updatedGood / updatedTotal
    console.log('good', updatedGood)
    console.log('average', updatedAverage)
    console.log('total', updatedTotal)
    console.log(`${(updatedPositive * 100).toFixed(0)}%`);
    setGood(updatedGood)
    setTotal(updatedTotal)
    setAverage(updatedAverage)
    setPositive(updatedPositive)
  }
  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1
    const updatedTotal = total + 1
    const updatedAverage = (good - bad) / updatedTotal
    const updatedPositive = good / updatedTotal
    console.log('neutral', updatedNeutral)
    console.log('average', updatedAverage)
    console.log('total', updatedTotal)
    console.log(`${(updatedPositive * 100).toFixed(0)}%`);
    setNeutral(updatedNeutral)
    setTotal(updatedTotal)
    setAverage(updatedAverage)
    setPositive(updatedPositive)
  }
  const handleBadClick = () => {
    const updatedBad = bad + 1
    const updatedTotal = total + 1
    const updatedAverage = (good - updatedBad) / updatedTotal
    const updatedPositive = good / updatedTotal
    console.log('bad', updatedBad)
    console.log('average', updatedAverage)
    console.log('total', updatedTotal)
    console.log(`${(updatedPositive * 100).toFixed(0)}%`);
    setBad(updatedBad)
    setTotal(updatedTotal)
    setAverage(updatedAverage)
    setPositive(updatedPositive)
  }

  const feedback = [
    {
      name: 'good',
      value: good
    },
    {
      name: 'netural',
      value: neutral
    },
    {
      name: 'bad',
      value: bad
    },
    {
      name: 'total',
      value: total
    },
    {
      name: 'average',
      value: average
    },
    {
      name: 'positive',
      value: positive
    }
  ]

  return (
    <div>
      <Header text="give feedback" />
      <Button onClick={handleGoodClick} text='good' />
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad' />
      <Statistics feedback={feedback} />

    </div>
  )
}

export default App