import './App.css'
import Game, { Area, Climb } from './components/Game'
import GameOver from './components/GameOver'
import Menu from './components/Menu'
import { createContext, useContext, useEffect, useState } from 'react'
import { requestGET, requestPOST } from './helpers/sendRequest'

export enum GameMode {
  Initialization,
  Running,
  GameOver
}

export interface GameStatus {
  mode: GameMode,
  areasSelected: Array<Area>,
  climbs: Array<Climb>,
  roundsRemaining: number,
  score: number
}

function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus>({
    mode: GameMode.Initialization,
    areasSelected: [],
    climbs: [],
    roundsRemaining: 5,
    score: 0
  });
  
  const modeToRender = (mode: GameMode) => {
    switch (mode) {
      case GameMode.Initialization:
        return (<Menu gameStatus={gameStatus} setGameStatus={setGameStatus}/>)
      case GameMode.Running:
        return (<Game gameStatus={gameStatus} setGameStatus={setGameStatus}/>)
      case GameMode.GameOver:
        return (<GameOver gameStatus={gameStatus} setGameStatus={setGameStatus}/>)
      default:
        return (<h1>Something went wrong...</h1>);
    }
  }

  return (
    <>
      {modeToRender(gameStatus.mode)}
    </>
  )
}

export default App
