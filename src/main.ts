const dotenv = require('dotenv').config();
if (dotenv.error) {
  throw dotenv.error
}

const got = require('got');

interface Game {
  id: string
  name: string
}

class Stat {
  name: string
  streamer_count: number
  viewer_count: number
  streamer_pool: number

  constructor(name: string) {
    this.name = name;
    this.streamer_count = 0;
    this.streamer_pool = 0;
    this.viewer_count = 0;
  }

  /**
   * avg
   */
  public avg(): number {
    return Math.ceil(this.viewer_count / this.streamer_count)
  }
}

var interestedInGames = [
  {
    id: '313558',
    name: 'Diablo III: Reaper of Souls',
  },
  {
    id: '66170',
    name: 'Warframe',
  },
  {
    id: '512710',
    name: 'Call of Duty: Modern Warfare',
  },
  {
    id: '29307',
    name: 'Path of Exile',
  }
]

async function fetchStreamersData(game_id) {
  const response = await got(
    `https://api.twitch.tv/helix/streams?game_id=${game_id}&first=100`,
    {
      headers: { 'Client-ID': process.env.CLIENT_ID },
      responseType: 'json'
    }
  )
  return response.body['data'];
}


async function main() {
  var stats = {};

  for (let index = 0; index < interestedInGames.length; index++) {
    const game: Game = interestedInGames[index];

    stats[game.id] = new Stat(game.name)

    const streamers = await fetchStreamersData(game.id)

    streamers.forEach(streamer => {
      if (streamer.viewer_count < 1000) {
        stats[game.id].streamer_count += 1
        stats[game.id].viewer_count += streamer.viewer_count
      }
      stats[game.id].streamer_pool += 1
    })
  }

  Object.keys(stats).forEach(key => {
    var stat: Stat = stats[key];

    console.log(`${stat.name}\nviewers: ${stat.viewer_count}\nstreamers: ${stat.streamer_count}/${stat.streamer_pool}\navg streamer/views: ${stat.avg()}\n`)
  })



  // const response = await got(
  //   'https://api.twitch.tv/helix/games/top?first=100', {
  //   headers: { 'Client-ID': process.env.CLIENT_ID },
  //   responseType: 'json'
  // });
  // const data = response.body['data'];
  // console.log(data);

  // var games: Array<Game>;

  // // response.body['data'].forEach(element => {
  // //     games.push({id: element.id, name: element.name})
  // // });

  // // console.log(games);
}

main();
