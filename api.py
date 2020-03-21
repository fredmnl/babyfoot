import redis

db = redis.Redis(host="database")

def addPlayer(player):
    db.sadd('players', player)

def getPlayers():
    players = []
    game_id = db.get('game-id').decode('utf-8')
    last_game_data = db.hgetall(f'game-{game_id}')
    for player in db.smembers('players'):
        name = player.decode('utf-8')
        try:
            rating = int(last_game_data[f"elo-{name}".encode()].decode('utf-8'))
        except:
            rating = 1200
        players += [{'name': name, 'rating': rating}]

    players.sort(key=lambda x:x['rating'], reverse=True)
    return players

def getGamesKeys():
    game_keys = db.lrange("games", 0, -1)
    game_keys = [key.decode('UTF-8') for key in game_keys]
    return game_keys

def getGames():
    game_keys = getGamesKeys()

    games = {}
    for game_key in game_keys:
        game = db.hgetall(game_key)
        game = {k.decode('UTF-8'): v.decode('UTF-8') for k,v in game.items()}
        games[game_key] = game

    return games

def insertGame(blueDefense, blueOffense, redDefense, redOffense, blueScore, redScore):
    game_id = db.incr('game-id')

    last_game_name = f'game-{game_id - 1}'
    last_game_data = db.hgetall(last_game_name)
    try:
        blueDefenseElo = int(last_game_data[f"elo-{blueDefense}".encode()].decode('utf-8'))
    except:
        blueDefenseElo = 1200
    try:
        blueOffenseElo = int(last_game_data[f"elo-{blueOffense}".encode()].decode('utf-8'))
    except:
        blueOffenseElo = 1200
    try:
        redDefenseElo = int(last_game_data[f"elo-{redDefense}".encode()].decode('utf-8'))
    except:
        redDefenseElo = 1200
    try:
        redOffenseElo = int(last_game_data[f"elo-{redOffense}".encode()].decode('utf-8'))
    except:
        redOffenseElo = 1200

    blueElo = (blueDefenseElo + blueOffenseElo) / 2
    redElo = (redDefenseElo + redOffenseElo) / 2

    expectation_blue = 1 / (1 + 10 ** ((redElo - blueElo) / 400))
    delta_elo = 32 * ((1 if blueScore == 5 else 0) - expectation_blue)
    delta_elo = round(delta_elo)

    blueDefenseElo += delta_elo
    blueOffenseElo += delta_elo
    redDefenseElo  -= delta_elo
    redOffenseElo  -= delta_elo

    new_game = f'game-{game_id}'
    db.lpush('games', new_game)
    try:
        db.hmset(new_game, last_game_data)
    except:
        pass
    db.hmset(new_game, {'blueDefense': blueDefense,
                        'blueOffense': blueOffense,
                        'redDefense' : redDefense,
                        'redOffense' : redOffense,
                        f'elo-{blueDefense}' : blueDefenseElo,
                        f'elo-{blueOffense}' : blueOffenseElo,
                        f'elo-{redDefense}' : redDefenseElo,
                        f'elo-{redOffense}' : redOffenseElo,
                        'blueScore'  : blueScore,
                        'redScore'   : redScore})

    return {'game': new_game,
            'blueDefense': blueDefense,
            'blueOffense': blueOffense,
            'redDefense' : redDefense,
            'redOffense' : redOffense,
            f'elo-{blueDefense}' : blueDefenseElo,
            f'elo-{blueOffense}' : blueOffenseElo,
            f'elo-{redDefense}' : redDefenseElo,
            f'elo-{redOffense}' : redOffenseElo,
            'deltaElo' : delta_elo,
            'blueScore'  : blueScore,
            'redScore'   : redScore}
