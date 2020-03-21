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
    api.insertGame(blueDefense, blueOffense, redDefense, redOffense, blueScore, redScore)
    return {}
