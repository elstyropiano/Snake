import { useState, useEffect, useRef } from "react"

import {
  canvas,
  scale,
  snake_start,
  apple_start,
  directions,
  BASIC_POINTS,
  snakeBody,
} from "./constans"
import img_0 from "./images/0.png"
import img_1 from "./images/1.png"
import img_2 from "./images/2.png"
import img_3 from "./images/3.png"
import img_4 from "./images/4.png"
import img_5 from "./images/5.png"
import img_6 from "./images/6.png"
import img_7 from "./images/7.png"
import img_8 from "./images/8.png"
import img_9 from "./images/9.png"
import img_10 from "./images/10.png"
import img_11 from "./images/11.png"
import img_12 from "./images/12.png"
import { useInterval } from "./useInterval"

const images = [
  img_0,
  img_1,
  img_2,
  img_3,
  img_4,
  img_5,
  img_6,
  img_7,
  img_8,
  img_9,
  img_10,
  img_11,
  img_12,
]

const useSnakeLogic = () => {
  const [apple, setApple] = useState(apple_start)
  const [bonus, setBonus] = useState(null)
  const [pointsMultiplier, setPointsMultiplier] = useState(5)
  const [snake, setSnake] = useState(snake_start)
  const [direction, setDirection] = useState(directions.ArrowRight)
  const [speed, setSpeed] = useState(50)
  const [gameOver, setGameOver] = useState(false)
  const [fruitNumber, setFruitNumber] = useState(0)
  const [start, setStart] = useState(false)
  const [pause, setPause] = useState(false)
  const [firstRender, setFirstRender] = useState(1)
  const [score, setScore] = useState(0)
  const [snakeHead, setSnakeHead] = useState(null)
  const [textPosition, setTextPosition] = useState(null)
  const [appleCollision, setAppleCollision] = useState(false)
  const [win, setWin] = useState(false)
  const canvasRef = useRef()
  const decimalPlaces = 1
  let opacity = 1

  useEffect(() => {
    if (snake.length === 378) {
      setWin(true)
      setGameOver(true)
      return
    }

    if (start) {
      const context = canvasRef.current.getContext("2d")
      context.clearRect(0, 0, canvas[0], canvas[1])
      context.setTransform(scale, 0, 0, scale, 0, 0)
      if (appleCollision) {
        console.log("kloizja z japkiem")
        setAppleCollision(false)
      }
      drawTopBar(context)
      drawFruit(context)
      drawBonus(context)
      drawSnake(context)
      // drawGainPointsText(context)
      if (checkFruitIsDrawn(context)) setFirstRender(null) //We need that state because when we click start, we have to wait first for render snake, which is depend on speed, every render is speed. When speed is low snake apears with delay. We have to load snake as fast as it passible so if image apear first render state change for null and then normal speed is working
    }
  }, [snake, apple, gameOver])

  const startGame = () => setStart(true)

  const pauseGame = () => {
    setPause(!pause)
  }

  const endGame = () => {
    setSpeed(10)
    setStart(false)
    setGameOver(true)
  }

  const choseImage = () => images[fruitNumber]

  const drawGainPointsText = (context) => {
    let fadeIn = true

    // context.clearRect(0, 0, canvas.width, canvas.height)

    context.font = `12/${scale}px Arial`
    context.fillStyle = `rgba(22, 11, 255, ${opacity})`
    context.fillText(
      `+${BASIC_POINTS * pointsMultiplier} xp`,
      textPosition?.[0],
      textPosition?.[1]
    )

    if (fadeIn) {
      opacity += 0.05
    } else {
      opacity -= 0.05
    }

    if (opacity >= 1) {
      fadeIn = false
    } else if (opacity <= 0) {
      fadeIn = true
    }
  }
  const newScore = (prev) => {
    const num = prev + BASIC_POINTS * pointsMultiplier
    const newScore =
      Math.round(num * Math.pow(10, decimalPlaces)) /
      Math.pow(10, decimalPlaces)
    return newScore
  }

  const moveSnake = (e) => {
    if (snakeHead === snake[0]) return // if we click very fast on arrows snake head doesnt have time to change position and it make collison

    //collision protection when we click oposit key to snake direction.
    if (direction[1] !== 0) {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") return
    }
    if (direction[0] !== 0) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") return
    }

    setDirection(directions[e.key])
    setSnakeHead(snake[0])
  }

  const createApple = () =>
    apple.map((_, i) => {
      if (i === 1) {
        // we dont need y at position 0 because is topbar
        const positionY = Math.floor(Math.random() * canvas[i] - 40 / scale) + 1
        return positionY
      }
      const positonX = Math.floor((Math.random() * canvas[i]) / scale)
      return positonX
    })

  const createBonus = () =>
    bonus.map((_, i) => Math.floor((Math.random() * canvas[i]) / scale))

  const checkCollision = (piece, snk = snake, compareItem) => {
    // collision snakeHead with wall
    if (
      piece[0] * scale >= canvas[0] ||
      piece[0] < 0 ||
      piece[1] * scale >= canvas[1] ||
      piece[1] < 0 + 40 / scale
    )
      return true

    for (const segment of snk) {
      // collision snakeHead with snake body
      if (piece[0] === segment[0] && piece[1] === segment[1]) {
        console.log("kolizja ze snejkiem")
        return true
      }
    }
    if (piece?.[0] === compareItem?.[0] && piece?.[1] === compareItem?.[1]) {
      //apple and bonus colision
      console.log("kolizja z japkiem")
      return true
    }
    return false
  }

  const checkAppleCollision = (snake) => {
    const snakeHead = snake[0]

    if (snakeHead[0] === apple[0] && snakeHead[1] === apple[1]) {
      setAppleCollision(true)
      // setTextPosition([apple[0], apple[1] - 1])
      let newApple = createApple()
      const randomNumber = Math.floor(Math.random() * 13)
      setFruitNumber(randomNumber)
      setScore((prev) => newScore(prev))

      while (checkCollision(newApple, snake, bonus)) {
        newApple = createApple()
      }

      setApple(newApple)
      // setAppleCollision(false)
      return true
    }
  }
  const checkBonusCollision = (snake) => {
    const snakeHead = snake[0]

    if (snakeHead[0] === bonus?.[0] && snakeHead[1] === bonus?.[1]) {
      let newBonus = createBonus()
      while (checkCollision(newBonus, snake, apple)) {
        newBonus = createBonus()
      }
      setBonus(newBonus)
      return true
    }
  }
  const gameLoop = () => {
    const snakeCopy = [...snake]
    const snakeHead = snakeCopy[0]

    const newSnakeHead = [
      snakeHead[0] + direction[0],
      snakeHead[1] + direction[1],
    ]
    snakeCopy.unshift(newSnakeHead)
    if (checkCollision(newSnakeHead)) endGame()
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop()
    if (checkBonusCollision(snakeCopy)) {
      console.log("cos sie dzieje po najechaniu bonusu")
    }
    setSnake(snakeCopy)
  }

  const drawTopBar = (context) => {
    context.fillStyle = "rgb(112, 99, 192)"
    context.strokeStyle = "rgb(112, 99, 192)"
    context.beginPath()
    context.moveTo(0, 37 / scale)
    context.lineTo(canvas[0] / scale, 37 / scale)
    context.lineWidth = 3 / scale
    context.stroke()
    context.font = `${25 / scale}px Arial`
    context.fillText(`Snake speed: ${speed}%`, 20 / scale, 25 / scale)
    context.fillText(
      `Score  ${score}`,
      canvas[0] / scale - 150 / scale,
      25 / scale
    )
  }

  const drawFruit = (context) => {
    const appleImage = new Image()
    appleImage.src = choseImage()
    context.drawImage(appleImage, apple[0], apple[1], 1, 1)
  }

  const drawBonus = (context) => {
    context.fillStyle = "rgb(112, 99, 192)"
    // const appleImage = new Image()
    // appleImage.src = choseImage()
    context.fillRect(bonus?.[0], bonus?.[1], 1, 1)
  }

  const checkFruitIsDrawn = (context) =>
    context
      .getImageData(apple[0] * scale, apple[1] * scale, 1 * scale, 1 * scale)
      .data.some((channel) => channel !== 0)

  const drawSnake = (context) => {
    context.fillStyle = "rgb(112, 99, 192)"
    snake.forEach(([x, y]) => {
      context.beginPath()
      const circleRay = 20
      context.arc(
        x + circleRay / scale,
        y + circleRay / scale,
        circleRay / scale,
        0,
        2 * Math.PI
      )
      context.fill()
      // context.fillRect(x, y, 1, 1, 1)
    })
  }

  useInterval(
    () => gameLoop(),
    firstRender ? firstRender : 7000 / speed,
    start,
    pause,
    setFirstRender
  )
  const playAgain = () => {
    setGameOver(false)
    setStart(false)
    setPointsMultiplier(5)
    setSpeed(50)
    setScore(0)
    setSnake(snake_start)
    setWin(false)
  }

  return {
    moveSnake,
    playAgain,
    pauseGame,
    startGame,
    apple,
    setApple,
    pointsMultiplier,
    setPointsMultiplier,
    snake,
    setSnake,
    direction,
    setDirection,
    speed,
    setSpeed,
    gameOver,
    setGameOver,
    fruitNumber,
    setFruitNumber,
    start,
    setStart,
    pause,
    setPause,
    firstRender,
    setFirstRender,
    score,
    setScore,
    canvasRef,
    moveSnake,
    win,
  }
}

export default useSnakeLogic
