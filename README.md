# D1 starter

Flower Flow
A Cookie Clicker type game about picking petals.

## Game Link

[Flower Flow](https://anna-zhang6.github.io/cmpm121-d1/)

To run locally clone the repo and run `deno task setup` and `deno task dev`

## How to Play

To play flower flow you click the flower button in the center to gain petals. Petals allow you to purchase tools to help you
improve the speed at which you can get petals.

## Credits

Game made by Anna Zhang and Jade Gardner.

With help on requestAnimationFrame from Dipika Rajesh.

Data Structure for upgrades discussed with Ray Butts and Cassidy Croy-Perret

Images made by Jade Gardner

Tooling adapted from the [CMPM 121 Fall 2026 S01 starter](https://github.com/ucsc-cmpm-121-f26/s01-starter/tree/8974888efb6537be82e8eb069db139ea885039da), which has no explicit repository license. No new license is assigned to that material. The D1 scaffold and original SVG were authored with OpenAI GPT-6 Astra assistance. Dependencies retain their respective licenses.

## Fixing Code Smells

Using the ideas behind the single responsibility principle we moved the code to create visuls into it's own CSS folder
so now if we wanted to change the visual apperance of something we would only have to change one file.
We also condensed creating new upgrades such that you only have to add them to the structure and loops will make the rest for you.

## Changing Code

To add an upgrade go to src/main.ts, line 48 hold the passive upgarde data. To add your own upgrade match the format defined at line 36 and input it into the array (line 48) in the order you want it to appear in. The loop at line 112 will create the button with the data you gave it.

