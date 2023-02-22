import { styled, css, Button } from "@mui/material"

import StartGameArea from "./StartGameArea"
import { canvasSize } from "./constans"
import GameOver from "./GameOver"
import Logic from "./useSnakeLogic"

const CanvasSnake = styled("canvas")(
  css`
    /* border: 3px solid rgb(112, 99, 192); */
    /* background-color: rgb(7, 13, 38); */
    position: absolute;
    top: 0;
    left: 0;
  `
)
const CanvasTopBar = styled("canvas")(
  css`
    position: absolute;
    top: 0;
    left: 0;

    /* border: 3px solid rgb(112, 99, 192);
    background-color: rgb(7, 13, 38); */
  `
)
const CanvasElements = styled("canvas")(
  css`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    /* border: 3px solid rgb(112, 99, 192);
    background-color: rgb(7, 13, 38); */
  `
)
const CanvasKey = styled("canvas")(
  css`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
    /* border: 3px solid rgb(112, 99, 192);
    background-color: rgb(7, 13, 38); */
  `
)
const CanvasSparkle = styled("canvas")(
  css`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    /* border: 3px solid rgb(112, 99, 192);
    background-color: rgb(7, 13, 38); */
  `
)
const CanvasBoom = styled("canvas")(
  css`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;
    /* border: 3px solid rgb(112, 99, 192);
    background-color: rgb(7, 13, 38); */
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
    canvasRef1,
    canvasRef2,
    canvasRef3,
    canvasRef4,
    canvasRef5,
    canvasRef6,
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
            <>
              <CanvasSnake
                width={canvasSize[0]}
                height={canvasSize[1]}
                ref={canvasRef1}
              />
              <CanvasTopBar
                width={canvasSize[0]}
                height={canvasSize[1]}
                ref={canvasRef2}
              />
              <CanvasElements
                width={canvasSize[0]}
                height={canvasSize[1]}
                ref={canvasRef3}
              />
              <CanvasSparkle
                width={canvasSize[0]}
                height={canvasSize[1]}
                ref={canvasRef4}
              />
              <CanvasKey
                width={canvasSize[0]}
                height={canvasSize[1]}
                ref={canvasRef5}
              />
              <CanvasBoom
                width={canvasSize[0]}
                height={canvasSize[1]}
                ref={canvasRef6}
              />
            </>
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
