const backendApi = {
  base: 'http://localhost',
  port: process.env.API_PORT || 4000,
  version: '/api/v1'
}

const crawlerApi = {
  base: 'http://localhost',
  port: process.env.CRAWLER_PORT || 9000,
  version: '/api/v1'
}

export { backendApi, crawlerApi }
