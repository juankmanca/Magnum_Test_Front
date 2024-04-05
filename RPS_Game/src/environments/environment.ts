const host = 'http://localhost:3200/api/Game/'

export const environment = {
  production: false,
  startPlay : host + "registerPlayers",
  getCurrentGame : host + "getGameInfo/",
  newMovement: host +  'registerMovement',
  playAgain: host +  'playAgain/',
};
