import Box from '@mui/material/Box'

const PageHeader = ({ children }) => {
  return (
    <Box py={8} px={2}>
      {children}
    </Box>
  )
}

export default PageHeader
