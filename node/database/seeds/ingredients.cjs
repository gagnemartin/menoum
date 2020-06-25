const ingredients = [
  { name: 'Viande hachée' },
  { name: 'Patate' },
  { name: 'Oeuf' },
  { name: 'Lait' },
  { name: 'Farine' },
  { name: 'Huile d\'olive' },
  { name: 'Poitrine de poulet' }
]

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('ingredients').del()
    .then(function () {
      // Inserts seed entries
      return knex('ingredients').insert(ingredients)
    })
}
