import React from 'react'
import addState from '../../src'

interface Props {
  email: string,
  password: string,
  onLogin: (email: string, password: string) => void,
  onSubmit: () => void,
  changeEmail: (event: React.SyntheticEvent) => void,
  changePassword: (event: React.SyntheticEvent) => void
}

const LoginForm = (props: Props) => (
  <form>
    <input type='email' placeholder='Email' value={props.email} onChange={props.changeEmail} />
    <input type='password' placeholder='Password' value={props.password} onChange={props.changePassword} />
    <button type='submit' onClick={props.onSubmit}>Login</button>
  </form>
)

interface State {
  email: string,
  password: string
}

const initialState: State = {
  email: '',
  password: ''
}

const StatefulLoginForm = addState<State>((setState, getProps) => ({
  onSubmit: () => {
    const { email, password, onLogin } = getProps()
    onLogin(email, password)
  },
  changeEmail: (event: React.SyntheticEvent) => setState({ email: (event.target as any).value }),
  changePassword: (event: React.SyntheticEvent) => setState({ password: (event.target as any).value })
}), initialState)(LoginForm)

export default StatefulLoginForm
