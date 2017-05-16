import test from 'ava'
import React from 'react'
import ReactTestRenderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import stateful from '../src/index'

test('does not break stateless components', t => {
  const StatelessButton = ({ label }) => (
    <button>{label}</button>
  )
  const StatefulButton = stateful(StatelessButton)

  t.deepEqual(
    render(<StatefulButton label='Click me!' />),
    render(<button>Click me!</button>)
  )
})

test('simple counter component works', t => {
  const increase = () => state => ({ clicks: state.clicks + 1 })

  const Counter = (props, state, { setState }) => (
    <div>
      <div className='times'>Clicked {state.clicks} times</div>
      <button onClick={() => setState(increase())}>Increase +</button>
    </div>
  )

  const StatefulCounter = stateful(Counter, { clicks: 0 })
  const counter = shallow(<StatefulCounter />)

  t.is(counter.find('.times').text(), 'Clicked 0 times')
  counter.find('button').simulate('click')
  t.is(counter.find('.times').text(), 'Clicked 1 times')
})

test('login form component with prop handlers works', t => {
  const LoginForm = (props, state) => (
    <form>
      <input type='email' placeholder='Email' value={state.email} onChange={props.onEmailChange} />
      <input type='password' placeholder='Password' value={state.password} onChange={props.onPasswordChange} />
      <button type='submit' onClick={props.onSubmitClick}>Login</button>
    </form>
  )

  const initialState = {
    email: '',
    password: ''
  }

  const StatefulLoginForm = stateful(LoginForm, initialState, {
    onEmailChange: event => ({ setState }) => setState({ email: event.target.value }),
    onPasswordChange: event => ({ setState }) => setState({ password: event.target.value }),
    onSubmitClick: event => (_, props, state) => props.onLogin(state.email, state.password)
  })

  const onLogin = sinon.spy()
  const form = shallow(<StatefulLoginForm onLogin={onLogin} />)

  form.find('input[type="email"]').simulate('change', { target: { value: 'octocat@github.com' } })
  form.find('input[type="password"]').simulate('change', { target: { value: 'SuperSecretPassword' } })
  t.false(onLogin.called)

  form.find('button').simulate('click')
  t.is(onLogin.callCount, 1)
  t.deepEqual(onLogin.lastCall.args, [
    'octocat@github.com',
    'SuperSecretPassword'
  ])
})

function render (reactElement) {
  return ReactTestRenderer.create(reactElement).toJSON()
}
