import { useState, useEffect, useRef } from "react"

import {
  canvasSize,
  scale,
  snake_start,
  directions,
  BASIC_POINTS,
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
  const [applePosition, setApplePosition] = useState([])
  const [bonusPosition, setBonusPosition] = useState([])
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
  const [opacity, setOpacity] = useState(1)
  const [elementCollision, setElementCollision] = useState(false)
  const [textPosition, setTextPosition] = useState([])
  const [startingTextPosition, setStartingTextPosition] = useState([])

  const [win, setWin] = useState(false)
  const [bonus, setBonus] = useState(false)

  const [gameLoopNum, setGameLoopNum] = useState(0)
  const [timeToBonusAppear, setTimeToBonusAppear] = useState(null)
  const [timeToBonusDisappear, setTimeToBonusDisappear] = useState(null)
  const [counterBonusDisappearId, setCounterBonusDisappearId] = useState(null)
  const [counterBonusAppearId, setCounterBonusAppearId] = useState(null)
  const canvasRef1 = useRef()
  const canvasRef2 = useRef()
  const canvasRef3 = useRef()
  const decimalPlaces = 1
  const pointsForFruitText = `+${BASIC_POINTS * pointsMultiplier} points`
  const fruitText = "fruit"
  const bonusText = "bonus"
  useEffect(() => {
    if (snake.length === 378) {
      setWin(true)
      setStart(false)
      setGameOver(true)
      return
    }
    if (start) {
      const context = createContext(canvasRef2)
      const snakeHead = snake[0]
      drawSnake(context)

      if (checkElementIsDrawn(context, snakeHead)) setFirstRender(null)
    }
  }, [snake])

  useEffect(() => {
    if (start) {
      if (bonus) {
        createElementPosition(applePosition, setBonusPosition)
        const randomNum = Math.floor(Math.random() * 3) + 5
        setTimeToBonusDisappear(randomNum)
        const counterId = counter(setTimeToBonusDisappear, false)
        setCounterBonusDisappearId(counterId)
        return
      }
      const randomNum = Math.floor(Math.random() * 2) + 5
      setTimeToBonusAppear(randomNum)
      const counterId = counter(setTimeToBonusAppear, true)

      setCounterBonusAppearId(counterId)
    }
  }, [bonus, start])

  useEffect(() => {
    if (start) {
      const context = createContext(canvasRef3)
      console.log(elementCollision, "elementCollision")

      if (elementCollision) {
        const textAfterCollison =
          elementCollision === "fruit" ? pointsForFruitText : "bonus"
        drawTextElementCollision(context, textAfterCollison)
      }

      // if (elementCollision)
      //   drawTextElementCollision(context, pointsForFruitText)
      if (bonus) drawBonus(context)

      drawFruit(context)
    }
  }, [gameLoopNum])

  useEffect(() => {
    if (start) {
      const context = createContext(canvasRef1)
      const bonusStatus = timeToBonusAppear ? "appear" : "disappear"
      const counter = timeToBonusAppear
        ? timeToBonusAppear
        : timeToBonusDisappear
      drawTopBar(context, bonusStatus, counter)
    }
  }, [score, start, timeToBonusAppear, timeToBonusDisappear])

  const createElementPosition = (elementToCompare, setPosition) => {
    let newElementPosition
    const arr = ["", ""]
    do {
      newElementPosition = arr.map((_, i) =>
        i === 1
          ? Math.floor((Math.random() * (canvasSize[i] - 40)) / scale) + 1
          : Math.floor((Math.random() * canvasSize[i]) / scale)
      )
    } while (checkCollision(newElementPosition, snake, elementToCompare))

    setPosition(newElementPosition)
  }

  const counter = (setTime, bonusStatus) => {
    const countdown = setInterval(
      () =>
        setTime((prev) => {
          if (prev - 1 === 0) {
            setBonus(bonusStatus)
            clearInterval(countdown)
            return null
          }
          return (prev -= 1)
        }),
      1000
    )
    return countdown
  }

  const gameElementsLoop = () => setGameLoopNum((prev) => (prev += 1))

  const createContext = (ref) => {
    const context = ref.current.getContext("2d")
    context.clearRect(0, 0, canvasSize[0], canvasSize[1])
    context.setTransform(scale, 0, 0, scale, 0, 0)
    return context
  }

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

  const startGame = () => {
    createElementPosition(bonusPosition, setApplePosition) //create apple
    setBonusPosition([])
    setDirection(directions.ArrowRight)
    setSnake(snake_start)
    setStart(true)
  }

  const pauseGame = () => {
    setPause(!pause)
  }

  const endGame = () => {
    const intervalToStopId = bonus
      ? counterBonusDisappearId
      : counterBonusAppearId

    clearInterval(intervalToStopId)

    setGameOver(true)
    setSpeed(10)
    setStart(false)

    setBonus(false)
  }

  const choseImage = () => images[fruitNumber]

  const drawTextElementCollision = (context, text) => {
    context.font = `${24 / scale}px Arial`
    context.fillStyle = `rgba(76, 175, 80, ${opacity})`
    context.fillText(text, textPosition?.[0], textPosition?.[1])

    if (opacity <= 0) setElementCollision(false)

    setTextPosition((prev) => textAnimation(prev))
    setOpacity((prev) => (prev -= 0.03))
  }

  const textAnimation = (position) => {
    const moveX = startingTextPosition[0] === 17 ? -0.03 : 0.03
    const moveY = startingTextPosition[1] >= 3 ? -0.03 : 0.03
    position[0] += moveX
    position[1] += moveY
    return position
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

  const checkCollision = (piece, snk = snake, compareItem) => {
    // collision snakeHead with wall
    if (
      piece[0] * scale >= canvasSize[0] ||
      piece[0] < 0 ||
      piece[1] * scale >= canvasSize[1] ||
      piece[1] < 0 + 40 / scale
    )
      return true

    // collision snakeHead with snake body
    for (const segment of snk)
      if (piece[0] === segment[0] && piece[1] === segment[1]) {
        return true
      }
    //apple and bonus colision
    if (piece?.[0] === compareItem?.[0] && piece?.[1] === compareItem?.[1])
      return true

    return false
  }

  const checkElementCollision = (
    snake,
    elementPosition,
    elementCollisionText,
    setFruitNumber,
    elementToCompare,
    setPosition,
    setBonus
  ) => {
    const snakeHead = snake[0]

    if (
      snakeHead[0] === elementPosition[0] &&
      snakeHead[1] === elementPosition[1]
    ) {
      const randomNumber = Math.floor(Math.random() * 13)
      const newTextPosition = [...elementPosition]
      const newStartingTextPosition = [...snakeHead]

      if (elementPosition[0] >= 18) {
        newTextPosition[0] = 17
        newStartingTextPosition[0] = 17
      }
      if (elementCollisionText === "fruit") {
        createElementPosition(elementToCompare, setPosition)
      }

      setElementCollision(elementCollisionText)
      setTextPosition(newTextPosition)
      setStartingTextPosition(newStartingTextPosition)
      setOpacity(1)

      if (setFruitNumber) setFruitNumber(randomNumber)
      setScore((prev) => newScore(prev))
      if (setBonus) setBonus(false)
      return true
    }
  }
  const snakeLoop = () => {
    const snakeCopy = [...snake]
    const snakeHead = snakeCopy[0]

    const newSnakeHead = [
      snakeHead[0] + direction[0],
      snakeHead[1] + direction[1],
    ]
    snakeCopy.unshift(newSnakeHead)
    if (checkCollision(newSnakeHead)) endGame()
    if (
      !checkElementCollision(
        snakeCopy,
        applePosition,
        fruitText,
        setFruitNumber,
        bonusPosition,
        setApplePosition
      )
    )
      snakeCopy.pop()

    if (
      checkElementCollision(
        snakeCopy,
        bonusPosition,
        bonusText,
        false,
        bonusPosition,
        setApplePosition,
        setBonus
      )
    ) {
      console.log("cos sie dzieje po najechaniu bonusu")
    }
    setSnake(snakeCopy)
  }

  const drawTopBar = (context, bonusStatus, counter) => {
    context.fillStyle = "rgb(112, 99, 192)"
    context.strokeStyle = "rgb(112, 99, 192)"
    context.beginPath()
    context.moveTo(0, 37 / scale)
    context.lineTo(canvasSize[0] / scale, 37 / scale)
    context.lineWidth = 3 / scale
    context.stroke()
    context.font = `${25 / scale}px Arial`
    context.fillText(`Snake speed: ${speed}%`, 20 / scale, 25 / scale)
    context.fillText(`Bonus ${bonusStatus}: ${counter}s`, 7, 25 / scale)
    context.fillText(
      `Score  ${score}`,
      canvasSize[0] / scale - 150 / scale,
      25 / scale
    )
  }

  const drawFruit = (context) => {
    const appleImage = new Image()
    appleImage.src = choseImage()
    context.drawImage(appleImage, applePosition[0], applePosition[1], 1, 1)
  }

  const drawBonus = (context) => {
    context.fillStyle = "rgb(112, 99, 192)"
    // const appleImage = new Image()
    // appleImage.src = choseImage()
    context.fillRect(bonusPosition?.[0], bonusPosition?.[1], 1, 1)
  }

  const checkElementIsDrawn = (context, element) =>
    context
      .getImageData(element[0] * scale, element[1] * scale, scale, scale)
      .data.some((channel) => channel !== 0)

  useInterval(
    () => snakeLoop(),
    firstRender ? firstRender : 7000 / speed,
    start,
    pause
  )
  useInterval(
    () => gameElementsLoop(),
    firstRender ? firstRender : 80,
    start,
    pause
  )

  const playAgain = () => {
    setStart(false)

    setTimeToBonusAppear(false)
    setGameOver(false)

    setPointsMultiplier(5)
    setSpeed(50)
    setScore(0)
    setSnake(snake_start)
    setWin(false)
    setTextPosition(null)
    setFirstRender(1)
    setElementCollision(false)
  }

  return {
    moveSnake,
    playAgain,
    pauseGame,
    startGame,
    applePosition,
    setApplePosition,
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
    canvasRef1,
    moveSnake,
    win,
    canvasRef2,
    canvasRef3,
  }
}

export default useSnakeLogic
