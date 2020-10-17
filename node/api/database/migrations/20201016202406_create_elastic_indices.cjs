const { Client } = require('@elastic/elasticsearch')

const ElasticClient = new Client({ node: 'http://elastic:9200' })

async function up() {
  await ElasticClient.cluster.health({
    wait_for_status: 'yellow',
    timeout: '120s'
  })

  const ingredientsIndex = ElasticClient.indices.create({
    index: 'ingredients'
  })

  const recipesIndex = ElasticClient.indices.create({
    index: 'recipes'
  })

  await Promise.all([ingredientsIndex, recipesIndex])

  const ingredientsMapping = ElasticClient.indices.putMapping({
    index: 'ingredients',
    body: {
      properties: {
        name: {
          type: 'completion',
          analyzer: 'standard',
          search_analyzer: 'standard'
        }
      }
    }
  })

  return ingredientsMapping
}

async function down() {
  const ingredientsIndex = ElasticClient.indices.delete({
    index: 'ingredients'
  })

  const recipesIndex = ElasticClient.indices.delete({
    index: 'recipes'
  })

  return Promise.all([ingredientsIndex, recipesIndex])
}

module.exports = { up, down }
