const faker = require('faker')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')

async function seed(knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(async () => {
      // Inserts seed entries
      const password = await bcrypt.hash('123456', 10)
      return knex('users').insert([
        {
          email: 'test_admin@gmail.com',
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          password,
          role: 'admin',
          refresh_token: uuidv4()
        },
        {
          email: 'test_user@gmail.com',
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          password,
          role: 'user',
          refresh_token: uuidv4()
        },
        {
          email: 'test_moderator@gmail.com',
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          password,
          role: 'moderator',
          refresh_token: uuidv4()
        },
        {
          email: 'test_content_manager@gmail.com',
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          password,
          role: 'content_manager',
          refresh_token: uuidv4()
        }
      ])
    })
}

module.exports = { seed }
