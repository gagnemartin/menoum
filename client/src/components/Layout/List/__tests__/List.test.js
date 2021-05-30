import { render } from '@testing-library/react'
import List from '../List'

describe('<List />', () => {
  const testId = 'test-style'

  describe('<Ul />', () => {
    it('should have display flex', () => {
      const { getByTestId } = render(
        <List.Ul inline data-testid={testId}>
          <List.Item>Test</List.Item>
        </List.Ul>
      )

      const component = getByTestId(testId)

      expect(component).toHaveStyle('display: flex')
    })

    it('should have display block', () => {
      const { getByTestId } = render(
        <List.Ul data-testid={testId}>
          <List.Item>Test</List.Item>
        </List.Ul>
      )

      const component = getByTestId(testId)

      expect(component).toHaveStyle('display: block')
    })
  })

  describe('<Ol />', () => {
    it('should have display flex', () => {
      const { getByTestId } = render(
        <List.Ol inline data-testid={testId}>
          <List.Item>Test</List.Item>
        </List.Ol>
      )

      const component = getByTestId(testId)

      expect(component).toHaveStyle('display: flex')
    })

    it('should have display block', () => {
      const { getByTestId } = render(
        <List.Ol data-testid={testId}>
          <List.Item>Test</List.Item>
        </List.Ol>
      )

      const component = getByTestId(testId)

      expect(component).toHaveStyle('display: block')
    })
  })
})
