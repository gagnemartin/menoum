import { Client } from '@elastic/elasticsearch'

const { ELASTIC_HOST, ELASTIC_PORT } = process.env

const ElasticClient = new Client({ host: ELASTIC_HOST, post: ELASTIC_PORT })

export default ElasticClient
