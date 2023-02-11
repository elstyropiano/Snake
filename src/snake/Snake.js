import { styled, css, Button } from "@mui/material"

import StartGameArea from "./StartGameArea"
import { canvas } from "./constans"
import GameOver from "./GameOver"
import Logic from "./useSnakeLogic"

const Canvas = styled("canvas")(
  css`
    border: 3px solid rgb(112, 99, 192);
    background-color: rgb(7, 13, 38);
  `
)
const GameWrapper = styled("div")(
  css`
    width: 800px;
    height: 800px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid black;
    position: relative;
    margin-top: 50px;
  `
)

const Wrapper = styled("div")(
  css`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgb(7, 13, 38);
  `
)

const Snake = () => {
  const {
    pointsMultiplier,
    speed,
    gameOver,
    start,
    pause,
    score,
    win,
    canvasRef,
    setPointsMultiplier,
    setSpeed,
    startGame,
    moveSnake,
    playAgain,
    pauseGame,
  } = Logic()

  return (
    <>
      <div role='button' tabIndex='0' onKeyDown={(e) => moveSnake(e)}>
        <GameWrapper>
          {!gameOver && start && (
            <Canvas width={canvas[0]} height={canvas[1]} ref={canvasRef} />
          )}
          <Wrapper>
            {!start && !gameOver && (
              <StartGameArea
                startGame={startGame}
                speed={speed}
                setSpeed={setSpeed}
                setPointsMultiplier={setPointsMultiplier}
                pointsMultiplier={pointsMultiplier}
              />
            )}
            {gameOver && (
              <GameOver win={win} score={score} playAgain={playAgain} />
            )}
          </Wrapper>
        </GameWrapper>
        <Button variant='contained' onClick={pauseGame}>
          {pause ? "Start" : "Pause"}
        </Button>
      </div>
    </>
  )
}

export default Snake
