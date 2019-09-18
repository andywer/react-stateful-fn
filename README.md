# react-stateful-fn - Functional *stateful* components

[![Build Status](https://travis-ci.org/andywer/react-stateful-fn.svg?branch=master)](https://travis-ci.org/andywer/react-stateful-fn)
[![NPM Version](https://img.shields.io/npm/v/react-stateful-fn.svg)](https://www.npmjs.com/package/react-stateful-fn)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

> ⚠️ This repository is archived. Use React hooks instead.

Functional components are considered best practice in React, but as soon as we need local component state we cannot use them. Let's fix that!

What this package provides:

- [x] setState for functional components
- [x] No need to bind component methods
- [x] Optimized for performance
- [x] Extremely small: < 1kB (gzipped + minified)
- [x] Zero dependencies


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

### Optimizing

If you care about performance you will not be completely happy with the previous example:

The button's `onClick` handler is an arrow function defined in the functional component. Thus it will be a new function on every render and will cause the child component to re-render every time.

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
The handlers defined here will be passed to the component as props.

If such handlers return a function (as seen above) then this function will be called with the `{ setState }` object, allowing you to update the state according to the event.


## Forms

Forms can be quite an elaborate business in React. Fortunately, stateful functional components turn out to be a convenient approach to create forms easily.

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

Make a functional component stateful. Wraps the component with a thin `React.Component` class and takes care to minimize the work done in `render()` to optimize performance.

#### component

This is supposed to be a functional React component. You can use any ordinary functional component. The difference to a stateless component are the additional parameters.

The component will be called with the parameters `(props: Object, state: Object, { setState: Function })`.

#### initialState *(optional)*

Pass a custom initial state here. Otherwise it will default to `{}`.

#### propHandlers *(optional)*

Use `propHandlers` to pass stateful event handlers as props to the component. Useful to avoid arrow function event handlers which are considered bad practice.

If a property of `propHandlers` is not a function it will be added to the component's props as it is.

If a `propHandlers` handler returns a function this function will be called with the parameters `({ setState }, props, state)`.


## See also

Another great tool for writing functional React components is [recompose](https://github.com/acdlite/recompose). Use its [withContext()](https://github.com/acdlite/recompose/blob/master/docs/API.md#withcontext) if you need stateful functional components with access to the context. It also comes with [withState()](https://github.com/acdlite/recompose/blob/master/docs/API.md#withstate) which allows you to write stateful functional components like this package does.

`Recompose` allows you to compose functional components very nicely, including the component state. Beware that you will *have to* compose the component state and end up having X stateful components under the hood if you need X different properties in a component's state. That might decrease performance.


## License

MIT
