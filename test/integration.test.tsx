import test from 'ava'
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { JSDOM } from 'jsdom'
import React from 'react'
import ReactTestRenderer from 'react-test-renderer'
import addState from '../src'
import StatefulCounter from './components/counter'
import StatefulLoginForm from './components/login-form'

const jsdom = new JSDOM('<!doctype html><html><body></body></html>')

Object.assign(global as any, {
  document: (jsdom.window as any).document,
  window: jsdom.window
})

configure({ adapter: new Adapter() })

function render (reactElement: React.ReactElement<any>) {
  return ReactTestRenderer.create(reactElement).toJSON()
}

test('does not break stateless components', t => {
  const StatelessButton = (props: { label: React.ReactNode }) => (
    <button>{props.label}</button>
  )
  const StatefulButton = addState(() => ({}))(StatelessButton)

  t.deepEqual(
    render(<StatefulButton label='Click me!' />),
    render(<button>Click me!</button>)
  )
})

test('counter component works', t => {
  const counter = mount(<StatefulCounter />)

  t.is(counter.find('.times').text(), 'Clicked 0 times')
  counter.find('button').simulate('click')
  t.is(counter.find('.times').text(), 'Clicked 1 times')
})

test('login form works', t => {
  const onLogin = (email: string, password: string) => {
    (onLogin as any).calls.push({ email, password })
  }
  (onLogin as any).calls = []

  const form = mount(<StatefulLoginForm onLogin={onLogin} />)

  form.find('input[type="email"]').simulate('change', { target: { value: 'octocat@github.com' } })
  form.find('input[type="password"]').simulate('change', { target: { value: 'SuperSecretPassword' } })
  t.is((onLogin as any).calls.length, 0)

  form.find('button').simulate('click')
  t.is((onLogin as any).calls.length, 1)
  t.deepEqual((onLogin as any).calls[0], {
    email: 'octocat@github.com',
    password: 'SuperSecretPassword'
  })
})
