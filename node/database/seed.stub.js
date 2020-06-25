async function seed(knex) {
  // Deletes ALL existing entries
  return knex('table_name').del()
    .then(function () {
      // Inserts seed entries
      return knex('table_name').insert([
        { id: 1, field_name: 'name' }
      ])
    })
}

module.exports = { seed }
