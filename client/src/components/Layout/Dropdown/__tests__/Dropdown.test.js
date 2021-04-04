import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Dropdown from '../'

const Header = () => {
  return <p>Button</p>
}

describe('<Dropdown />', () => {
  it('should render with dropdown hidden', () => {
    const { queryByTestId } = render(
      <Dropdown header={<Header />}>
        <p data-testid='dropdown-element'>Hello</p>
      </Dropdown>
    )

    expect(queryByTestId('dropdown-button')).toBeInTheDocument()
    expect(queryByTestId('dropdown-content').classList.contains('is-visible')).toBeFalsy()
  })

  it('should render with dropdown visible with initialIsVisible prop', () => {
    const { queryByTestId } = render(
      <Dropdown header={<Header />} initialIsVisible>
        <p data-testid='dropdown-element'>Hello</p>
      </Dropdown>
    )

    expect(queryByTestId('dropdown-button')).toBeInTheDocument()
    expect(queryByTestId('dropdown-content').classList.contains('is-visible')).toBeTruthy()
  })

  it('should show the dropdown content when clicking the button', async () => {
    const { queryByTestId } = render(
      <Dropdown header={<Header />}>
        <p data-testid='dropdown-element'>Hello</p>
      </Dropdown>
    )
    const dropdownButton = queryByTestId('dropdown-button')

    userEvent.click(dropdownButton)

    await waitFor(() => {
      const dropdownContent = queryByTestId('dropdown-content')
      expect(dropdownContent.classList.contains('is-visible')).toBeTruthy()
    })
  })

  it('should hide the dropdown content on escape key', async () => {
    const { queryByTestId, container } = render(
      <Dropdown header={<Header />} initialIsVisible>
        <p data-testid='dropdown-element'>Hello</p>
      </Dropdown>
    )

    userEvent.type(container, '{esc}', { skipClick: true })

    await waitFor(() => {
      const dropdownContent = queryByTestId('dropdown-content')
      expect(dropdownContent.classList.contains('is-visible')).toBeFalsy()
    })
  })

  it('should not hide the dropdown content on any other key than escape', async () => {
    const { queryByTestId, container } = render(
      <Dropdown header={<Header />} initialIsVisible>
        <p data-testid='dropdown-element'>Hello</p>
      </Dropdown>
    )

    userEvent.type(container, '{space}', { skipClick: true })

    await waitFor(() => {
      const dropdownContent = queryByTestId('dropdown-content')
      expect(dropdownContent.classList.contains('is-visible')).toBeTruthy()
    })
  })

  it('should hide the dropdown content on click out', async () => {
    const { queryByTestId, container } = render(
      <Dropdown header={<Header />} initialIsVisible>
        <p data-testid='dropdown-element'>Hello</p>
      </Dropdown>
    )

    userEvent.click(container)

    await waitFor(() => {
      const dropdownContent = queryByTestId('dropdown-content')
      expect(dropdownContent.classList.contains('is-visible')).toBeFalsy()
    })
  })

  it('should not hide the dropdown content on click inside the dropdown', async () => {
    const { queryByTestId, container } = render(
      <Dropdown header={<Header />} initialIsVisible>
        <p data-testid='dropdown-element'>Hello</p>
      </Dropdown>
    )

    const dropdownContent = queryByTestId('dropdown-content')

    userEvent.click(dropdownContent)

    await waitFor(() => {
      const dropdownContent = queryByTestId('dropdown-content')
      expect(dropdownContent.classList.contains('is-visible')).toBeTruthy()
    })
  })
})
