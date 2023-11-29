## Devlog Entry - 11/28

[Back To README](../README.md)

### How we satisfied the software requirements
For each of the F0 requirements, give a paragraph of explanation for how your game’s implementation satisfies the requirements.
Your team can earn partial credit for covering only a subset of the F0 requirements at this stage. (It is much better to satisfy the requirements in a sloppy way right now than lock in your partial credit.)

**[F0.a] You control a character moving on a 2D grid.**\
We implemented basic top down character movement for the blue koala man. He walks across the grid free moving for farming similar to classic top down games like Stardew Valley.

**[F0.b] You advance time in the turn-based simulation manually.**\
As the player chooses to move so far, time progresses and plants grow. We set the threshold at 300 pixels of movement for the plants to level up. 

**[F0.c] You can reap (gather) or sow (plant) plants on the grid when your character is near them.**\
Players can gather and plant within a 150 pixel block radius. The 150 pixel radius basically means the player has to be touching a tile to place there.

**[F0.d] Grid cells have sun and water levels. The incoming sun and water for each cell is somehow randomly generated each turn. Sun energy cannot be stored in a cell (it is used immediately or lost) while water moisture can be slowly accumulated over several turns.**\
Using a random seed, a current sun level for the entire grid, and water levels for each tile are generated on every turn. The sun level is displayed at the top of the screen, and the water level is displayed in the bottom left corner when a tile is clicked on.

**[F0.e] Each plant on the grid has a type (e.g. one of 3 species) and a growth level (e.g. “level 1”, “level 2”, “level 3”).**\
We have a red, green, and purple mushroom type. Each has 3 growth levels, which the player can see through changing sprites. Each crop type has slightly different behaviors, but all use the same Crop class.

**[F0.f] Simple spatial rules govern plant growth based on sun, water, and nearby plants (growth is unlocked by satisfying conditions).**\
The green mushroom grows best with a medium amount of sun and water, but prefers to have no neighbors. The purple mushroom wants little sun, but a lot of water and neighbors. The red mushroom wants lots of sun, but only a little bit of water,  a few neighbors.

**[F0.g] A play scenario is completed when some condition is satisfied (e.g. at least X plants at growth level Y or above).**\
The player wins once they’ve collected enough mushrooms. Afterwards, they can continue to plant and harvest mushrooms to reach a higher score.


### Reflection
Looking back on how you achieved the F0 requirements, how has your team’s plan changed? Did you reconsider any of the choices you previously described for Tools and Materials or your Roles? It would be very suspicious if you didn’t need to change anything. There’s learning value in you documenting how your team’s thinking has changed over time.

