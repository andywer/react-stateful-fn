import test from 'ava'
import React from 'react'
import ReactTestRenderer from 'react-test-renderer'
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

function render (reactElement) {
  return ReactTestRenderer.create(reactElement).toJSON()
}
