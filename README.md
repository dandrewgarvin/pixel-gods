# TODO

## APP
- [x] Find pixel artwork for character and map
- [] Create player abilities
- [] Create player movements
- [] Create health
- [] Create turn
- [] Create starting menu
- [] Create end-game state
- [] Create share sheet

## SEVER

- Player enters code to create/join game
- UDP server
- Endpoints:
    1. Create/start game (generate code)
    2. Join game (enter code)
    3. Start Game (generate player sides and positions)
    4. Player movement updated
    5. Player attack (updated players health)
    6. Which players turn is it
    7. End game (who won, who lost)
    8. leave game


## TODO:
- [] Add currentPlayer for hosting and joining games so front end knows who they are
- [] Test that socket rooms are working
- [] add express sessions
- [] adding players to a game should switch back and forth between red and blue teams to prep for more players in a game