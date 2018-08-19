# Zappy

### Authors
[nkouris][nk], [alnim][al]


Server : [nkouris][nk]

AI Client : [alnim][al]

Graphical Client : [alnim][al]

[nk]: https://github.com/nkouris
[al]: https://github.com/alnimra

## Brief Overview

Zappy is an entirely automatic game where some computer programs play amongst themselves,
and is divided into three distinct parts:

1.	A single thread, single process (as dictated by the project spec) server that contains the board, resources,
	and manages the logic and timing of the	game.
	
2.	A client that will connect to the server and “pilot” one player. There can be many clients
	piloting players across any number of teams.

3.	A graphical client that connects to the server and acts as a visualizer for what happens
	on the board and to the clients.

The board consists of a featurless map of square tiles, and is supported, server-side, up to 10,000x10,000 units, with
up to 1000 players.

### Notes on the server

The server, as I've implemented here, is gated with blocking sockets and a single select statement as the condition in 
a while loop.  A generalized event engine manages all commands issued by either the players or graphical client, and 
uses objects from various memory pools created on server initialization.  Event timings influence the time that the select 
statement blocks, and the main loop of the server will execute on either an event being ready to execute, or a message is 
recieved.  Multiple events can be executed in a single iteration of the loop.

## Game Rules

The game world that the AI clients inhabit runs at a speed according to the variable _t_, specified at server initialization,
and then continues running in real-time until either all players have died of starvation, or 6 members of a team reach level 8.

Teams collect resources and food that are randomly generated on the board, using the resources for "elevation" rituals to level
up, and food to survive.

Here are the commands each player can issue while the game is running:

### Movement
| Action | Time Cost | Result |
|---|:---:|---|
| Advance | 7 / _t_ | Advance one tile |
| Right | 7 / _t_ | Turn right 90 degrees |
| Left | 7 / _t_ | Turn left 90 degrees |
### Actions
| Action | Time Cost | Result |
|---|:---:|---|
| See | 7 / _t_ | See contents of tiles in widening arc, depending on level |
| Inventory | 1 / _t_ | Get inventory |
| Take | 7 / _t_ | Pick up an object from the board |
| Put | 7 / _t_ | Put an object onto the board |
| Kick | 7 / t | Kick all players from tile |
| Broadcast | 7 / _t_ | Send message to all players on board |
| Incantation | 300 / _t_ | Level up |
| Fork | 42 / _t_ | "Spawn" a new player |
| Connect_nbr | 0 / t | Recieve the number of players connected |

#### Notes on some actions
Movement happends one board unit at a time in the direction the player is facing, and players have no understanding 
of their surroundings unless they explicitly "see" what is around them.  Communication is only possible through broadcasting 
a message that is visible to every player on the board.
