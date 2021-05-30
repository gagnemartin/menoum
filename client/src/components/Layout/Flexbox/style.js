import styled from 'styled-components'

const Style = styled.div((props) => ({
  display: 'flex',
  justifyContent: props.justifyContent,
  alignItems: props.alignItems
}))

export default Style
