import random
from api import *

# Allow time for the DB to start
while not db.ping():
    sleep(0.1)

addPlayer('Bruno')
addPlayer('Camille')
addPlayer('Damien')
addPlayer('Cyrille')
addPlayer('Romain')
addPlayer('Frédéric')
addPlayer('Nicolas S.')

players = [player["name"] for player in getPlayers()]

for _ in range(100):
    sample = random.sample(players, 4)
    losingScore = random.choice([0, 1, 2, 3, 4])
    if random.choice(["blue", "red"]) == "blue":
        blueScore = 5
        redScore = losingScore
    else:
        blueScore = losingScore
        redScore = 5
    insertGame(sample[0], sample[1], sample[2], sample[3], blueScore, redScore)
