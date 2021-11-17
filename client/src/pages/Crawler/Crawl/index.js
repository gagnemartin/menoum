import TextField from '@mui/material/TextField'
import LoadingButton from '@mui/lab/LoadingButton'
import Grid from '@mui/material/Grid'
import { useCrawlerService, useRecipesService } from '../../../services'
import RecipeForm from '../../../components/RecipeForm'
import { PageContainer, PageHeader, PageTitle } from '../../../components/Layout'
import useFormInput from '../../../hooks/useFormInput'
import { isSuccessResponse } from '../../../global/helpers'
import { useState } from 'react'

const Crawl = () => {
  const recipesService = useRecipesService()
  const crawlerService = useCrawlerService()
  const crawlUrl = useFormInput()
  const [isLoading, setIsLoading] = useState(false)
  const [structuredData, setStructuredData] = useState({})
  const [recipe, setRecipe] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsLoading(true)
    const { value } = crawlUrl
    const response = await crawlerService.crawl(value)
    setIsLoading(false)

    if (isSuccessResponse(response)) {
      setStructuredData(response.data)
      setRecipe(response.data)
    }
  }

  const submitRecipe = async (data) => {
    const response = await recipesService.add(data)
    return response
  }

  return (
    <>
      <PageHeader>
        <PageContainer maxWidth='xl'>
          <PageTitle textAlign='left'>Crawl Recipe</PageTitle>
        </PageContainer>
      </PageHeader>

      <PageContainer maxWidth='xl' data-testid='page-crawl-new'>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <form action='#' onSubmit={handleSubmit}>
              <Grid container>
                <Grid item xs={12} sm={10}>
                  <TextField {...crawlUrl} label='Url to crawl' type='url' fullWidth />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <LoadingButton
                    type='submit'
                    data-testid='crawl-form-button-submit'
                    variant='contained'
                    size='large'
                    loading={isLoading}
                    fullWidth
                  >
                    Crawl
                  </LoadingButton>
                </Grid>
              </Grid>
            </form>
          </Grid>

          {Object.keys(structuredData).length > 0 && (
            <Grid item sx={12}>
              <pre>
                <code>{JSON.stringify(structuredData, null, 4)}</code>
              </pre>
            </Grid>
          )}

          {Object.keys(recipe).length > 0 && (
            <Grid item xs={12}>
              <RecipeForm submitRecipe={submitRecipe} recipe={recipe} />
            </Grid>
          )}
        </Grid>
      </PageContainer>
    </>
  )
}

export default Crawl
