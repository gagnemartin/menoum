import { structuredDataTest } from 'structured-data-testing-tool'
import { parse, toSeconds } from 'iso8601-duration'
import AppError from '../helpers/AppError.js'

const success = (data) => {
  const returnData = { status: 'success' }

  if (data) {
    returnData.data = data
  }

  return returnData
}

const error = (status, data) => {
  return new AppError(status, data)
}

const CrawlController = () => {
  const crawl = async (req, res, next) => {
    const {
      query: { url }
    } = req

    if (!url) next(error(400))
    const response = await structuredDataTest(url)

    const {
      structuredData: { jsonld }
    } = response

    if (jsonld.Recipe) {
      const data = jsonld.Recipe[0]
      const steps = data.recipeInstructions.map((step) => {
        if (step['@type'] === 'HowToSection') {
          return {
            type: 'section',
            value: step.name,
            steps: step.itemListElement.map((s) => ({ type: 'step', value: s.text }))
          }
        } else {
          return {
            type: 'step',
            value: step.text
          }
        }
      })
      const recipeData = {
        name: data.name,
        prep_time: toSeconds(parse(data.prepTime)) / 60,
        cook_time: toSeconds(parse(data.cookTime)) / 60,
        servings: parseFloat(data.recipeYield),
        yields: parseFloat(data.recipeYield),
        thumbnail: data.image,
        source: url,
        steps,
        ingredients: [],
        structuredDataIngredients: data.recipeIngredient
      }
      return res.status(200).json(success(recipeData))
    }

    next(error(404))
  }

  return { crawl }
}

export default CrawlController
