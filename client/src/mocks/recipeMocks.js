const mockRecipes = [
  {
    id: 199,
    uuid: '2dff4911-4596-4dc9-86d4-ce640fd6aeed',
    name: 'Voluptatum dolorum qui fuga nisi.',
    steps: [
      {
        type: 'section',
        value: 'Salad',
        steps: [
          {
            type: 'step',
            value: 'Iure alias labore consequatur officia.'
          },
          {
            type: 'step',
            value: 'Labore et sed eligendi dolorem.'
          },
          {
            type: 'step',
            value: 'Molestiae cum distinctio dolorem et.'
          }
        ]
      },
      {
        type: 'step',
        value: 'Non expedita nostrum quo libero.'
      },
      {
        type: 'step',
        value: 'Soluta qui nihil pariatur qui.'
      },
      {
        type: 'step',
        value: 'Iusto sint hic voluptatem et.'
      },
      {
        type: 'step',
        value: 'Repudiandae eligendi dolorem eum quo.'
      },
      {
        type: 'step',
        value: 'Ratione aliquid possimus est soluta.'
      },
      {
        type: 'step',
        value: 'Vel et consequatur accusamus labore.'
      }
    ],
    created_at: '2021-03-27T18:57:44.951Z',
    updated_at: '2021-03-27T18:57:44.951Z',
    ingredients: [
      {
        id: 396,
        name: 'fresh tuna',
        uuid: 'ddbc2042-e807-4bf4-98fa-8217589992a9',
        elastic_id: 'D1EMdXgBdqz25pkfoIkz',
        created_at: '2021-03-27T18:57:44.930658',
        updated_at: '2021-03-27T18:57:44.930658',
        recipe_count: 0,
        ingredients_recipes: {
          id: 1029,
          ingredient_id: 396,
          recipe_id: 199,
          unit: 'g',
          amount: 5,
          section: 'Bread',
          weight: 1.0,
          created_at: '2021-03-27T18:57:47.013142',
          updated_at: '2021-03-27T18:57:47.013142'
        }
      },
      {
        id: 964,
        name: 'summer cabbage',
        uuid: '871ea847-b9c7-4ea1-8e39-b821c69b33e1',
        elastic_id: 'R1EMdXgBdqz25pkfoIs2',
        created_at: '2021-03-27T18:57:44.930658',
        updated_at: '2021-03-27T18:57:44.930658',
        recipe_count: 0,
        ingredients_recipes: {
          id: 1021,
          ingredient_id: 964,
          recipe_id: 199,
          unit: 'ml',
          amount: 5,
          section: 'Starter',
          weight: 1.0,
          created_at: '2021-03-27T18:57:47.013142',
          updated_at: '2021-03-27T18:57:47.013142'
        }
      },
      {
        id: 1027,
        name: 'vanilla essence',
        uuid: 'f13e30a4-08f5-446a-82c4-9eeb8cb022fd',
        elastic_id: 'hlEMdXgBdqz25pkfoIs3',
        created_at: '2021-03-27T18:57:44.930658',
        updated_at: '2021-03-27T18:57:44.930658',
        recipe_count: 0,
        ingredients_recipes: {
          id: 1027,
          ingredient_id: 1027,
          recipe_id: 199,
          unit: 'ml',
          amount: 4,
          section: 'Pasta',
          weight: 1.0,
          created_at: '2021-03-27T18:57:47.013142',
          updated_at: '2021-03-27T18:57:47.013142'
        }
      },
      {
        id: 612,
        name: 'mint sauce',
        uuid: 'b4376bea-38c2-4249-9195-bb2db455e69b',
        elastic_id: '51EMdXgBdqz25pkfoIk1',
        created_at: '2021-03-27T18:57:44.930658',
        updated_at: '2021-03-27T18:57:44.930658',
        recipe_count: 0,
        ingredients_recipes: {
          id: 1026,
          ingredient_id: 612,
          recipe_id: 199,
          unit: 'ml',
          amount: 7,
          section: 'Bread',
          weight: 1.0,
          created_at: '2021-03-27T18:57:47.013142',
          updated_at: '2021-03-27T18:57:47.013142'
        }
      },
      {
        id: 131,
        name: 'buttercream icing',
        uuid: '02fb5ee5-1728-4cf1-99d8-810d21816c83',
        elastic_id: 'BlEMdXgBdqz25pkfoIgx',
        created_at: '2021-03-27T18:57:44.930658',
        updated_at: '2021-03-27T18:57:44.930658',
        recipe_count: 0,
        ingredients_recipes: {
          id: 1025,
          ingredient_id: 131,
          recipe_id: 199,
          unit: 'g',
          amount: 10,
          section: 'Sauce',
          weight: 1.0,
          created_at: '2021-03-27T18:57:47.013142',
          updated_at: '2021-03-27T18:57:47.013142'
        }
      },
      {
        id: 313,
        name: 'danish blue',
        uuid: '77fe7320-9417-449b-af72-9421da8daf96',
        elastic_id: 'vFEMdXgBdqz25pkfoIgy',
        created_at: '2021-03-27T18:57:44.930658',
        updated_at: '2021-03-27T18:57:44.930658',
        recipe_count: 0,
        ingredients_recipes: {
          id: 1024,
          ingredient_id: 313,
          recipe_id: 199,
          unit: 'g',
          amount: 7,
          section: 'Appetizers',
          weight: 1.0,
          created_at: '2021-03-27T18:57:47.013142',
          updated_at: '2021-03-27T18:57:47.013142'
        }
      },
      {
        id: 359,
        name: 'fenugreek',
        uuid: 'fc6f2954-4cf2-4d58-8f80-cdd72bc554fa',
        elastic_id: '6lEMdXgBdqz25pkfoIgz',
        created_at: '2021-03-27T18:57:44.930658',
        updated_at: '2021-03-27T18:57:44.930658',
        recipe_count: 0,
        ingredients_recipes: {
          id: 1023,
          ingredient_id: 359,
          recipe_id: 199,
          unit: 'ml',
          amount: 1,
          section: 'Salad',
          weight: 1.0,
          created_at: '2021-03-27T18:57:47.013142',
          updated_at: '2021-03-27T18:57:47.013142'
        }
      },
      {
        id: 667,
        name: 'orange',
        uuid: '551c5e6b-805f-45f9-b80d-7efdff1cf816',
        elastic_id: 'HlEMdXgBdqz25pkfoIo1',
        created_at: '2021-03-27T18:57:44.930658',
        updated_at: '2021-03-27T18:57:44.930658',
        recipe_count: 0,
        ingredients_recipes: {
          id: 1022,
          ingredient_id: 667,
          recipe_id: 199,
          unit: 'ml',
          amount: 2,
          section: 'Salad',
          weight: 1.0,
          created_at: '2021-03-27T18:57:47.013142',
          updated_at: '2021-03-27T18:57:47.013142'
        }
      },
      {
        id: 1034,
        name: 'vegetables',
        uuid: '522c6c91-480a-4eb2-81e8-b37139f10e91',
        elastic_id: 'jVEMdXgBdqz25pkfoIs3',
        created_at: '2021-03-27T18:57:44.930658',
        updated_at: '2021-03-27T18:57:44.930658',
        recipe_count: 0,
        ingredients_recipes: {
          id: 1020,
          ingredient_id: 1034,
          recipe_id: 199,
          unit: 'ml',
          amount: 1,
          section: 'Starter',
          weight: 2.0,
          created_at: '2021-03-27T18:57:47.013142',
          updated_at: '2021-03-27T18:57:47.013142'
        }
      },
      {
        id: 700,
        name: 'paw-paw',
        uuid: 'e5ae0f5d-77e6-4169-a6c8-d42a6f6e19de',
        elastic_id: 'P1EMdXgBdqz25pkfoIo1',
        created_at: '2021-03-27T18:57:44.930658',
        updated_at: '2021-03-27T18:57:44.930658',
        recipe_count: 0,
        ingredients_recipes: {
          id: 1028,
          ingredient_id: 700,
          recipe_id: 199,
          unit: 'g',
          amount: 4,
          section: 'Pasta',
          weight: 1.0,
          created_at: '2021-03-27T18:57:47.013142',
          updated_at: '2021-03-27T18:57:47.013142'
        }
      }
    ]
  }
]

const mockRecipesServiceResponse = {
  suggest: {
    success: {
      status: 'success',
      data: mockRecipes
    },
    error: {
      status: 'error',
      error: new Error('False Error')
    }
  },
  add: {
    success: {
      status: 'success',
      data: mockRecipes[0]
    },
    error: {
      status: 'error',
      error: new Error('False Error')
    }
  },
  update: {
    success: {
      status: 'success',
      data: mockRecipes[0]
    },
    error: {
      status: 'error',
      error: new Error('False Error')
    }
  },
  get: {
    success: {
      status: 'success',
      data: mockRecipes[0]
    },
    error: {
      status: 'error',
      error: new Error('False Error')
    }
  }
}

export { mockRecipesServiceResponse, mockRecipes }
