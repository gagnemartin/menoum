import Elasticsearch from '@elastic/elasticsearch'

const { ELASTIC_HOST, ELASTIC_PORT } = process.env

export default class Elastic {
  constructor() {
    this.elasticclient = new Elasticsearch.Client({ node: `http://${ELASTIC_HOST}:${ELASTIC_PORT}` })
  }

  get client() {
    return this.elasticclient
  }
}
