import styled from 'styled-components'

const ListUl = styled.ul((props) => ({
  display: props.display,
  margin: 0,
  padding: 0,
  listStyle: props.listStyle
}))

const ListOl = styled.ol((props) => ({
  display: props.display,
  margin: 0,
  padding: 0,
  listStyle: props.listStyle
}))

const ListItem = styled.li({
  margin: 0,
  padding: 0
})

export { ListUl, ListOl, ListItem }
