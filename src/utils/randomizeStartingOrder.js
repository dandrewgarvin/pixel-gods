module.exports = function randomizeStartingOrder(players) {
  const newPlayers = [];
  console.log('players', players);

  // sort players by team
  const teams = {};

  // sort players by team
  players.forEach(player => {
    if (!teams[player.team]) {
      teams[player.team] = [];
    }

    teams[player.team].push(player);
  });

  // sort players in each team by playerId

  // change team names to randomly generated strings (to make sure blue team isn't always first because it's alphabetically first)

  // map over team object, pulling first player from each team until all teams are empty

  // return newPlayers array with sorted play order

  console.log('teams', teams);
  

  newPlayers.push(players[~~(Math.random() * players.length)]);

  return newPlayers;
}