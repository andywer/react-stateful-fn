import React from 'react'
import addState from '../../src'

const Counter = (props: { clicks: number, increase: () => void }) => (
  <div>
    <div className='times'>Clicked {props.clicks} times</div>
    <button onClick={props.increase}>Increase +</button>
  </div>
)

interface State {
  clicks: number
}

const initialState: State = {
  clicks: 0
}

const StatefulCounter = addState<State>(setState => ({
  increase: () => setState(prevState => ({ clicks: prevState.clicks + 1 }))
}), initialState)(Counter)

export default StatefulCounter
