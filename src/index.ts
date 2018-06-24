import React from 'react'

type SetState<State> = React.Component<any, State, any>['setState']

const addState = <State extends {}, OutwardProps extends {} = any, ResultingHandlers = {}>(
  createStateHandlers: (setState: SetState<State>, getProps: () => (OutwardProps & ResultingHandlers & State)) => ResultingHandlers,
  initialState: Partial<State> = {}
) => (Component: React.ComponentType<OutwardProps & ResultingHandlers & State>) => {
  return class AddState extends React.Component<OutwardProps, State> {
    displayName: string
    handlers: ResultingHandlers

    constructor (props: OutwardProps) {
      super(props)
      this.displayName = `AddState(${Component.displayName || Component.name || ''})`
      this.state = initialState as any || {}
      this.handlers = createStateHandlers(this.setState.bind(this), this.getProps.bind(this))
    }

    getProps () {
      return Object.assign({}, this.props, this.handlers, this.state)
    }

    render () {
      return React.createElement(Component, this.getProps())
    }
  } as React.ComponentClass<OutwardProps>
}

(addState as any).default = addState  // So we have a ES module default export as well
export = addState
