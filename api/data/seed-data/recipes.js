const difficulty = {
  intermediate: 'intermediate'
}


const recipes = [
  {
    recipe_name: "Mordecai's Teriyaki Chicken",
    recipe_description: 'This is my Teriyaki Chicken recipe',
    recipe_difficulty: difficulty.intermediate,
    recipe_prep_duration: '{"hours":1,"minutes":10}',
    recipe_cook_duration: '{"hours":0,"minutes":30}',
    recipe_servings: 4,
    cuisine_type_id: 1,
    user_id: 1
  },
  {
    recipe_name: "Rigby's Cereal",
    recipe_description: 'There is the correct way to make cereal',
    recipe_difficulty: difficulty.intermediate,
    recipe_prep_duration: '{"hours":0,"minutes":1}',
    recipe_cook_duration: '{"hours":0,"minutes":1}',
    recipe_servings: 1,
    cuisine_type_id: 2,
    user_id: 2
  },
  {
    recipe_name: "Bensons's Grilled Cheese",
    recipe_description: 'How to make my famous grilled cheese',
    recipe_difficulty: difficulty.intermediate,
    recipe_prep_duration: '{"hours":0,"minutes":5}',
    recipe_cook_duration: '{"hours":0,"minutes":2}',
    recipe_servings: 1,
    cuisine_type_id: 2,
    user_id: 3
  },
]

module.exports = recipes;