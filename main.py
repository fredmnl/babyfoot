import sys

from fastapi import FastAPI
from fastapi.responses import HTMLResponse, FileResponse
app = FastAPI()

import api

@app.get("/api/getPlayers/")
async def read_root():
    return api.getPlayers()

@app.get("/api/getGames/")
async def read_root():
    return api.getGames()

@app.get("/api/insertGame/")
async def read_root(blueDefense: str, blueOffense: str, redDefense: str, redOffense: str, blueScore: int, redScore: int):

    if (blueScore != 5 and redScore != 5) or (blueScore == 5 and redScore == 5):
        return {"status": "NOK", "reason": f"Invalid score : {blueScore}-{redScore}"}
    knownPlayers = [player["name"] for player in api.getPlayers()]
    for player in [blueDefense, blueOffense, redDefense, redOffense]:
        if player not in knownPlayers:
            return {"status": "NOK", "reason": f"Unknown player: {player}"}
    if blueDefense in [redDefense, redOffense]:
        return {"status": "NOK", "reason": f"Invalid teams: {blueDefense} cannot be in both teams"}
    if blueOffense in [redDefense, redOffense]:
        return {"status": "NOK", "reason": f"Invalid teams: {blueOffense} cannot be in both teams"}

    result = api.insertGame(blueDefense, blueOffense, redDefense, redOffense, blueScore, redScore)
    result["status"] = "OK"
    return result

@app.get("/api/addPlayer/")
async def read_root(player: str):

    knownPlayers = [player["name"] for player in api.getPlayers()]
    if player in knownPlayers:
        return {"status": "NOK", "reason": f"Player already known: {player}"}

    api.addPlayer(player)
    return {"status": "OK"}
