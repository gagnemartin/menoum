import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'

const Steps = ({ steps, handleStep }) => {
  return (
    <List>
      {Object.keys(steps).map((key) => (
        <ListItem disableGutters key={key}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={8}>
              <TextField
                onChange={handleStep}
                value={steps[key].value}
                type='text'
                name='steps[]'
                label='Step'
                inputProps={{
                  'data-key': key,
                  'data-testid': 'recipe-form-input-step'
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                onChange={handleStep}
                value={steps[key].section}
                type='text'
                name='sections[]'
                label='Section'
                inputProps={{
                  'data-key': key,
                  'data-testid': 'recipe-form-input-step-section'
                }}
                fullWidth
              />
            </Grid>
          </Grid>
        </ListItem>
      ))}
    </List>
  )
}

export default Steps
