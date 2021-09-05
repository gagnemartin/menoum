import { useEffect, useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import TextField from '@mui/material/TextField'

const Ingredients = ({ selectedIngredients, handleChangeIngredientData }) => {
  const [open, setOpen] = useState({})

  const handleClickCollapse = (e) => {
    const {
      currentTarget: {
        dataset: { key }
      }
    } = e

    setOpen((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  useEffect(() => {
    const ingredients = {}

    Object.keys(selectedIngredients).forEach((key) => {
      ingredients[key] = false
    })

    setOpen(ingredients)
  }, [setOpen])

  return (
    <List>
      {Object.keys(selectedIngredients).map((key) => (
        <Box component='li'>
          <ListItemButton onClick={handleClickCollapse} key={key} data-key={key} data-testid='recipe-form-ingredient-name' disableGutters>
            <ListItemIcon>Drag</ListItemIcon>
            <ListItemText primary={selectedIngredients[key].name} />
            {open[key] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open[key]} timeout='auto'>
            <Box p={2}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    onChange={handleChangeIngredientData}
                    label='Amount'
                    type='number'
                    name='amount'
                    value={selectedIngredients[key].amount}
                    inputProps={{
                      'data-key': key,
                      'data-testid': 'recipe-form-input-ingredient-amount'
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    onChange={handleChangeIngredientData}
                    label='Unit'
                    type='text'
                    name='unit'
                    value={selectedIngredients[key].unit}
                    inputProps={{
                      'data-key': key,
                      'data-testid': 'recipe-form-input-ingredient-unit'
                    }}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    onChange={handleChangeIngredientData}
                    label='Section'
                    type='text'
                    name='section'
                    value={selectedIngredients[key].section}
                    inputProps={{
                      'data-key': key,
                      'data-testid': 'recipe-form-input-ingredient-section'
                    }}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    onChange={handleChangeIngredientData}
                    label='Weight'
                    type='number'
                    name='weight'
                    value={selectedIngredients[key].weight}
                    inputProps={{
                      'data-key': key,
                      'data-testid': 'recipe-form-input-ingredient-weight',
                      step: 0.1
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </Box>
      ))}
    </List>
  )
}

export default Ingredients
