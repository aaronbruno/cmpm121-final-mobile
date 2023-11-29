## Devlog Entry - 11/28

[Back To README](../README.md)

### How we satisfied the software requirements
For each of the F0 requirements, give a paragraph of explanation for how your game’s implementation satisfies the requirements.
Your team can earn partial credit for covering only a subset of the F0 requirements at this stage. (It is much better to satisfy the requirements in a sloppy way right now than lock in your partial credit.)

**[F0.a] You control a character moving on a 2D grid.**\
We implemented basic top down character movement for the blue koala man. The player uses the arrow keys to move their character across the grid freely, similar to classic top down games like Stardew Valley. In order to make the farming grid visible to the player we used a tile map. Each grid cell is 128x128.

**[F0.b] You advance time in the turn-based simulation manually.**\
As the player chooses to move so far, time progresses and plants grow. We set the distance threshold at 300 pixels for one turn to pass–i.e. the player’s turn ends once they move 300px from where they started their turn. 

**[F0.c] You can reap (gather) or sow (plant) plants on the grid when your character is near them.**\
Players can gather and plant on tiles within a 150 pixel block radius of their character. A 150 pixel radius essentially means the player has to be near-adjacent or touching a tile to reap/sow there. Assuming you are within range, the player left-clicks an empty tile to plant a crop and left-clicks a tile with a fully-grown crop to harvest it.

**[F0.d] Grid cells have sun and water levels. The incoming sun and water for each cell is somehow randomly generated each turn. Sun energy cannot be stored in a cell (it is used immediately or lost) while water moisture can be slowly accumulated over several turns.**\
Using a seeded random number generator, each turn a current sun level is generated for the entire grid and incoming water is generated for each tile individually. The current sun level is displayed at the top of the screen, and clicking on a tile displays its current moisture level in the bottom left corner.

**[F0.e] Each plant on the grid has a type (e.g. one of 3 species) and a growth level (e.g. “level 1”, “level 2”, “level 3”).**\
We have a red, green, and purple mushroom type. Each type has 3 growth stages, each of which has a corresponding  sprite. Each mushroom type has slightly different behaviors, but they are all instances of the same `Crop` class.

**[F0.f] Simple spatial rules govern plant growth based on sun, water, and nearby plants (growth is unlocked by satisfying conditions).**\
The green mushroom grows best with a medium amount of sun and water, but prefers to have no neighbors. The purple mushroom wants little sun, but a lot of water and neighbors. The red mushroom wants lots of sun, but only a little bit of water,  and a few neighbors. Every time a turn passes, each crop checks if its requirements are satisfied before progressing to the next stage.

**[F0.g] A play scenario is completed when some condition is satisfied (e.g. at least X plants at growth level Y or above).**\
The player wins once they’ve collected 30 mushrooms, indicated by a congratulatory message that appears on screen once this condition is reached. Afterwards, they can continue to plant and harvest mushrooms to reach a higher score.


### Reflection
Looking back on how you achieved the F0 requirements, how has your team’s plan changed? Did you reconsider any of the choices you previously described for Tools and Materials or your Roles? It would be very suspicious if you didn’t need to change anything. There’s learning value in you documenting how your team’s thinking has changed over time.

Generally, we stayed the same with our roles in the group. We think that we could have probably benefited from the appointment of a production lead to kind of guide a plan for the code since we had to regularly have meetings to catch each other up to speed on changes we made. We also had some misunderstanding about requirements so ultimately someone to better guide the assignment and code direction would have/be beneficial. We also all bled into each other's work a little between code and design.
