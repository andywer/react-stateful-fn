# react-addstate - Add state to functional components

<!--
[![Build Status](https://travis-ci.org/andywer/react-addstate.svg?branch=master)](https://travis-ci.org/andywer/react-addstate)
[![NPM Version](https://img.shields.io/npm/v/react-addstate.svg)](https://www.npmjs.com/package/react-addstate)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
-->

Do one thing and do it well: Add a thin layer of loosely-coupled component state to your functional components.

What this package provides:

- [x] state for functional components
- [x] No need to bind handler methods
- [x] Optimized for performance
- [x] Extremely small: < 1kB (minified)
- [x] Zero dependencies

Formerly known as *react-stateful-fn* (see [v0.1 branch](https://github.com/andywer/react-stateful-fn/tree/v0.1)).


## Installation

```sh
npm install react-addstate
# or
yarn add react-addstate
```


## Usage

Let's have a look at everyone's favorite sample code: A simple counter widget.

```js
import addState from 'react-addstate'

const Counter = ({ clicks = 0, increase }) => (
  <div>
    <div>Clicked {clicks} times</div>
    <button onClick={increase}>Increase +</button>
  </div>
)

const addCounterState = addState(setState => ({
  increase: () => setState(prevState => ({ clicks: prevState.clicks + 1 }))
}))

export default addCounterState(Counter)
```

Using `addState(setState => ({ ...handlers }))` we create a `addCounterState` function that, when called with our `Counter` component, will wrap it in a tiny stateful component that manages the counter's state.

The state and state update functions are exposed to `Counter` as properties. Every state property is passed as a property to `Counter` and so is every update function defined in the `addState()` call (= `increase`).

As you can see, we use React's [functional setState](https://medium.freecodecamp.com/functional-setstate-is-the-future-of-react-374f30401b6b) to update the state based on the previous state in `increase`.


## TypeScript

`react-addstate` comes with TypeScript typings out of the box, providing useful type information in your IDE, even if you are not using TypeScript in your application.

```tsx
import addState from 'react-addstate'

const Counter = (props: { clicks: number, increase: () => void }) => (
  <div>
    <div>Clicked {props.clicks} times</div>
    <button onClick={props.increase}>Increase +</button>
  </div>
)

interface State {
  clicks: number
}

const addCounterState = addState<State>(setState => ({
  increase: () => setState(prevState => ({ clicks: prevState.clicks + 1 }))
}), {
  // Initial state
  clicks: 0
})

export default addCounterState(Counter)
```


## Why?

### Performance: Clean event handlers

A key performance aspect of a React application is to avoid unnecessary rerenders. You are supposed to **not** use arrow functions or `.bind()` event handlers in the render function:

```jsx
class Counter extends React.Component {
  // ...

  render () {
    return <button onClick={() => this.setState({ /* ... */ })}>Increase +</button>   // BAD
    return <button onClick={() => this.increase)}>Increase +</button>                 // BAD
    return <button onClick={this.increase.bind(this)}>Increase +</button>             // BAD
  }
}

const Counter = ({ increase }) => {
  // GOOD: Always pass the same function reference as event handler
  return <button onClick={increase}>Increase +</button>
}
```

With `addState` we have a generic and concise solution to avoid this anti-pattern completely. Read more about the details [here](https://medium.com/@machnicki/handle-events-in-react-with-arrow-functions-ede88184bbb).

### Separation of Concern

With `addState` we separate representational code and state management logic. It nicely matches the underlying design of React: Components as mappers from props to DOM and state machines.

As a professional developer having worked on several enterprise-grade React projects over the years, I have often encountered these ever-growing "Hydra" components:

```jsx
class Hydra extends React.Component {
  render () {
    // use a few props, but not all
    // render something
    // render X, Y
  }
  renderFeatureX () {
    // use some state, but not all of it
    // render something
    // render Z
    // some state changes
  }
  renderFeatureY () {
    // use some more state
    // render something else
  }
  renderFeatureZ () {
    // ...
  }
}
```

Such a component does not just mix up what should be multiple components, but it will also be hard to see where props and state props are used. Such a component file can easily grow to several hundred lines of code in a matter of days.

Consequently using functional React components can counter this anti-pattern early on.

### Comparison to [recompose](https://github.com/acdlite/recompose)

`recompose` is a nice library and with its functions `withState` and `withHandler` it provides the utilities to do the same thing.

However, I experienced a few issues with it:

1. Types. Using `recompose` with TypeScript can be quite a pain, since you need to add types to each `withState()` and `withHandlers()` invocation or otherwise at least to the `compose()` which will make the code quite verbose and hard to read.

2. You end up having one stateful wrapping component *for each `withState()` and for each `withHandlers()`*. Using `addState` yields *one wrapping component altogether*.


## Forms

Forms can be quite an elaborate business in React. Fortunately, `addState` turn out to be a convenient approach to create forms easily.

```jsx
import addState from 'react-addstate'

/**
 * Use as:
 *
 * <LoginForm onLogin={(email, password) => { ... }} />
 */
const LoginForm = ({ email, password, onSubmit, updateEmail, updatePassword }) => (
  <form>
    <input type='email' placeholder='Email' value={email} onChange={updateEmail} />
    <input type='password' placeholder='Password' value={password} onChange={updatePassword} />
    <button type='submit' onClick={onSubmit}>Login</button>
  </form>
)

const initialState = {
  email: '',
  password: ''
}

const addLoginFormState = addState((setState, getProps) => ({
  updateEmail: event => setState({ email: event.target.value }),
  updatePassword: event => setState({ password: event.target.value }),
  onSubmit: () => {
    // We use getProps() here to access props as passed to the stateless LoginForm
    const { email, password, onLogin } = getProps()
    onLogin(email, password)
  }
}), initialState)

export default addLoginFormState(LoginForm)
```


## API

### addState(createHandlers: CreateHandlersFn, initialState?: any): StateWrapperFn

```ts
type CreateHandlersFn = (setState: ReactSetStateFn, getProps: GetPropsFn) => Handlers

type GetPropsFn = () => Props & State & Handlers
type ReactSetStateFn = React.Component['setState']

interface Handlers {
  [handlerName: string]: (...args: any[]) => any
}

type StateWrapperFn = (component: React.ComponentType<Props & State & Handlers>) => React.ComponentType<Props>
```


## License

MIT
