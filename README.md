# react-stateful-fn - Functional *stateful* components

[![Build Status](https://travis-ci.org/andywer/react-stateful-fn.svg?branch=master)](https://travis-ci.org/andywer/react-stateful-fn)
[![NPM Version](https://img.shields.io/npm/v/react-stateful-fn.svg)](https://www.npmjs.com/package/react-stateful-fn)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

- [x] setState on functional components
- [x] No need to bind your component methods
- [x] Optimized for performance
- [x] Zero dependencies
- [x] Extremely small: < 3kB


## Installation

```sh
npm install react-stateful-fn
# or
yarn add react-stateful-fn
```


## Usage

Let's have a look at everyone's favorite sample code: A simple counter widget.

```js
import stateful from 'react-stateful-fn'

const increase = () => state => ({ clicks: state.clicks + 1 })

const Counter = (props, state, { setState }) => (
  <div>
    <div>Clicked {state.clicks} times</div>
    <button onClick={() => setState(increase())}>Increase +</button>
  </div>
)

export default stateful(Counter, { clicks: 0 })
```

As you can see, functional stateful components are good friends with [functional setState](https://medium.freecodecamp.com/functional-setstate-is-the-future-of-react-374f30401b6b).

### We can do better

But if you care about performance you will probably not be completely happy with the previous example:

The button's `onClick` handler is an arrow function defined in the functional component. Thus it will be a different function on every render and will cause the button to re-render every time.

Let's fix that:

```js
import stateful from 'react-stateful-fn'

const increase = () => state => ({ clicks: state.clicks + 1 })

const Counter = (props, state) => (
  <div>
    <div>Clicked {state.clicks} times</div>
    <button onClick={props.onClick}>Increase +</button>
  </div>
)

export default stateful(Counter, { clicks: 0 }, {
  onClick: event => ({ setState }) => setState(increase())
})
```

We can wire props and setState together outside the function, similar to Redux' `connect()`.
The handlers defined there will be passed to the component as props.

If such a handler returns a function (as seen above) then this function is called with the `{ setState }` object, so you can update the state according to the event.


## Forms

Forms can be quite an elaborate business in React. Fortunately, stateful functional components turn out to be a convenient approach for easy form implementation.

```js
import stateful from 'react-stateful-fn'

/**
 * Use as:
 *
 * <LoginForm onLogin={(email, password) => { ... }} />
 */
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

export default stateful(LoginForm, initialState, {
  onEmailChange: event => ({ setState }) => setState({ email: event.target.value }),
  onPasswordChange: event => ({ setState }) => setState({ password: event.target.value }),
  onSubmitClick: event => (_, props, state) => props.onLogin(state.email, state.password)
})
```


## API

### stateful(component: Function, initialState: ?Object, propHandlers: ?Object): Function

Make a functional stateless component stateful.

#### component

This is supposed to be a functional React component. You can use any ordinary functional component. The difference to a stateless component are the additional parameters.

The component will be called with the parameters `(props: Object, state: Object, { setState: Function })`.

#### initialState *(optional)*

Pass a custom initial state here. Otherwise it will default to `{}`.

#### propHandlers *(optional)*

Use `propHandlers` to pass stateful event handlers as props to the component. Useful to avoid arrow function event handlers which are considered bad practice.

If a property of `propHandlers` is not a function it will be added to the component's props as it is.

If a `propHandlers` handler returns a function this function will be called with the parameters `({ setState }, props, state)`.


## License

MIT
