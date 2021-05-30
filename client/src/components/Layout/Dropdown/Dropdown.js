import { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
`

const Header = styled.a`
  color: inherit;
`

const Content = styled.div`
  position: absolute;
  display: none;
  &.is-visible {
    display: block;
  }
`

const Dropdown = ({ children, header, initialIsVisible }) => {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible)
  const ref = useRef(null)
  const refHeader = useRef(null)

  const handleHideDropdown = (event) => {
    if (event.key === 'Escape') {
      setIsComponentVisible(false)
    }
  }

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target) && refHeader.current && !refHeader.current.contains(event.target)) {
      setIsComponentVisible(false)
    }
  }

  const handleClick = (event) => {
    event.preventDefault()
    setIsComponentVisible((prevState) => !prevState)
  }

  useEffect(() => {
    document.addEventListener('keydown', handleHideDropdown, true)
    document.addEventListener('click', handleClickOutside, true)

    return () => {
      document.removeEventListener('keydown', handleHideDropdown, true)
      document.removeEventListener('click', handleClickOutside, true)
    }
  })
  return (
    <Wrapper>
      <Header href='#' onClick={handleClick} ref={refHeader} data-testid='dropdown-button'>
        {header}
      </Header>
      <Content className={isComponentVisible ? 'is-visible' : ''} ref={ref} data-testid='dropdown-content'>
        {children}
      </Content>
    </Wrapper>
  )
}

Dropdown.propTypes = {
  header: PropTypes.element.isRequired,
  initialIsVisible: PropTypes.bool
}

Dropdown.defaultProps = {
  initialIsVisible: false
}

export default Dropdown
