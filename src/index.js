const React = require('react')

module.exports = makeStateful

function makeStateful (component, initialState, propHandlers) {
  const statefulComponent = class extends React.Component {
    constructor (props) {
      super(props)
      this.state = initialState || {}
      this.statefulMethods = {
        setState: this.setState.bind(this)
      }
      this.propHandlers = propHandlers ? this.preparePropHandlers(propHandlers) : null
    }

    render () {
      const props = this.propHandlers ? Object.assign({}, this.props, this.propHandlers) : this.props
      return component(props, this.state, this.statefulMethods)
    }

    preparePropHandlers (propHandlers) {
      const preparedHandlers = {}

      Object.keys(propHandlers).forEach(key => {
        const handler = propHandlers[key]
        preparedHandlers[key] = typeof handler !== 'function' ? handler : (...args) => {
          const result = handler(...args)

          if (typeof result === 'function') {
            const props = Object.assign({}, this.props, this.propHandlers)
            return result(this.statefulMethods, props, this.state)
          } else {
            return result
          }
        }
      })

      return preparedHandlers
    }
  }

  if (component.name) {
    statefulComponent.displayName = component.name
  }
  if (component.propTypes) {
    statefulComponent.propTypes = component.propTypes
  }

  return statefulComponent
}
