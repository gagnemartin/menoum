import Box from '@material-ui/core/Box'

const PageHeader = ({ children }) => {
  return (
    <Box py={8} px={2}>
      {children}
    </Box>
  )
}

export default PageHeader
