import { render } from '@testing-library/react'
import App from '../'

describe('<App />', () => {
  it('should render and match snapshot', () => {
    const { asFragment } = render(<App />)
    expect(asFragment()).toMatchSnapshot()
  })
})
