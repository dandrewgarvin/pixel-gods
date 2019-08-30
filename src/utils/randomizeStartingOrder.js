module.exports = function randomizeStartingOrder(players) {
  const newPlayers = [];

  // sort players by team
  const teams = {};

  // sort players by team
  players.forEach(player => {
    if (!teams[player.team]) {
      teams[player.team] = [];
    }

    teams[player.team].push(player);
  });

  // change team names to randomly generated strings (to make sure blue team isn't always first because it's alphabetically first)
  for (team in teams) {
    const scrambled = generateRandomString() + `:${team}`;
    teams[scrambled] = teams[team];
    delete teams[team];

    // sort players in each team by playerId
    teams[scrambled] = teams[scrambled].sort((a, b) => {
      if (a.id > b.id) return 1;
      if (a.id < b.id) return -1;
      return 0;
    });
  }

  let sortedTeams = {};
  Object.keys(teams)
    .sort()
    .forEach(key => {
      sortedTeams[key] = teams[key];
    });

  // map over team object, pulling first player from each team until all teams are empty
  while (Object.keys(sortedTeams).length) {
    for (team in sortedTeams) {
      if (!sortedTeams[team].length) {
        delete sortedTeams[team];
      } else {
        newPlayers.push(sortedTeams[team][0]);

        sortedTeams[team].shift();
      }
    }
  }

  return newPlayers;
};

function generateRandomString(STRING_LENGTH = 5) {
  let alphabet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  let str = '';

  while (str.length <= STRING_LENGTH) {
    str = str + alphabet[~~(Math.random() * alphabet.length - 1)];
  }

  return str;
}
