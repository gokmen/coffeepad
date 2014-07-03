
#
# Examples taken from coffeescript.org
#

module.exports = [

  {
    title: "Overview"
    content: """
      # Assignment:
      number   = 42
      opposite = true

      # Conditions:
      number = -42 if opposite

      # Functions:
      square = (x) -> x * x

      # Arrays:
      list = [1, 2, 3, 4, 5]

      # Objects:
      math =
        root:   Math.sqrt
        square: square
        cube:   (x) -> x * square x

      # Splats:
      race = (winner, runners...) ->
        print winner, runners

      # Existence:
      alert "I knew it!" if elvis?

      # Array comprehensions:
      cubes = (math.cube num for num in list)
    """
  }

  {
    title: "Objects and Arrays"
    content: """
      song = ["do", "re", "mi", "fa", "so"]

      singers = {Jagger: "Rock", Elvis: "Roll"}

      bitlist = [
        1, 0, 1
        0, 0, 1
        1, 1, 0
      ]

      kids =
        brother:
          name: "Max"
          age:  11
        sister:
          name: "Ida"
          age:  9
    """
  }

  {
    title: "Splats"
    content: """
      gold = silver = rest = "unknown"

      awardMedals = (first, second, others...) ->
        gold   = first
        silver = second
        rest   = others

      contenders = [
        "Michael Phelps"
        "Liu Xiang"
        "Yao Ming"
        "Allyson Felix"
        "Shawn Johnson"
        "Roman Sebrle"
        "Guo Jingjing"
        "Tyson Gay"
        "Asafa Powell"
        "Usain Bolt"
      ]

      awardMedals contenders...

      alert "Gold: " + gold
      alert "Silver: " + silver
      alert "The Field: " + rest
    """
  }

  {
    title: "Loops and Comprehensions"
    content: """
      # Functions
      eat = (food)->
        console.log food

      menu = (num, dish)->
        console.info num, dish

      # Eat lunch.
      eat food for food in ['toast', 'cheese', 'wine']

      # Fine five course dining.
      courses = ['greens', 'caviar', 'truffles', 'roast', 'cake']
      menu i + 1, dish for dish, i in courses

      # Health conscious meal.
      foods = ['broccoli', 'spinach', 'chocolate']
      eat food for food in foods when food isnt 'chocolate'
    """
  }

]