import redis

db = redis.Redis(host="database")

def addPlayer(player):
    db.sadd('players', player)

def getPlayers():
    players = [player.decode('UTF-8') for player in db.smembers("players")]
    players.sort()
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

    new_game = 'game-%d'%(game_id)
    db.lpush('games', new_game)
    db.hmset(new_game, {'blueDefense': blueDefense,
                        'blueOffense': blueOffense,
                        'redDefense' : redDefense,
                        'redOffense' : redOffense,
                        'blueScore'  : blueScore,
                        'redScore'   : redScore})

