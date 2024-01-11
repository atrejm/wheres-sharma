import './App.css'
import Game, { Area, Climb } from './components/Game'
import GameOver from './components/GameOver'
import Menu from './components/Menu'
import { useState } from 'react'
import HighScorePanel from './components/HighscorePanel'

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
  
  console.debug("SCORE: ", gameStatus.score);

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
    <div className='row'>
      <div className='col-8'>
        {modeToRender(gameStatus.mode)}
      </div>
      <div className='col-4'>
        <HighScorePanel gameStatus={gameStatus}/>
      </div>
    </div>
  )
}

export default App
