import { useState, useEffect, useRef } from "react"

import {
  canvasSize,
  scale,
  snake_start,
  apple_start,
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
  const [apple, setApple] = useState(apple_start)

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
  const [appleCollision, setAppleCollision] = useState(false)
  const [textPosition, setTextPosition] = useState(apple)
  const [applePosition, setApplePosition] = useState(apple_start)
  const [win, setWin] = useState(false)
  const [bonus, setBonus] = useState(false)
  const [bonusPosition, setBonusPosition] = useState([2, 9])
  const [timeToTheNextBonus, setTimeToTheNextBonus] = useState(null)
  const [timeCounterId, setTimeCounterId] = useState(null)
  const [gameLoopNum, setGameLoopNum] = useState(0)
  const [bonusApear, setBonusApear] = useState(null)
  const [counterTopBarId, setCounterTopBarId] = useState(null)
  const canvasRef1 = useRef()
  const canvasRef2 = useRef()
  const canvasRef3 = useRef()
  const decimalPlaces = 1

  useEffect(() => {
    if (snake.length === 378) {
      setWin(true)
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
      const context = createContext(canvasRef3)
      drawFruit(context)

      if (appleCollision) drawGainPointsText(context)
      if (bonus) drawBonus(context)
    }
  }, [gameLoopNum])

  useEffect(() => {
    if (start && timeToTheNextBonus) {
      console.log(timeToTheNextBonus, "timeToTheNextBonus")
      countdownToTheBonus(timeToTheNextBonus)
      // setBonusApear(timeToTheNextBonus)
    }
    if (!start || !timeToTheNextBonus) {
      clearInterval(timeCounterId)
      clearInterval(counterTopBarId)
    }
  }, [timeToTheNextBonus, start])

  useEffect(() => {
    if (!start) {
      return
    }
    if (start || !bonus) {
      const randomNum = Math.floor(Math.random() * 2) + 5
      setTimeToTheNextBonus(randomNum)
      setBonusApear(randomNum)
    }
  }, [start])

  useEffect(() => {
    if (start) {
      const context = createContext(canvasRef1)
      const bonusStatus = bonusApear ? "cooldown" : "disapear"
      drawTopBar(context, bonusStatus, bonusApear)
    }
  }, [score, start, bonusApear])

  const countdownToTheBonus = (timeToTheNextBonus) => {
    let timeRemaning = timeToTheNextBonus
    const couterTopBar = setInterval(() => {
      timeRemaning -= 1
      setBonusApear((prev) => {
        console.log(prev, "prev")
        return (prev -= 1)
      })
    }, 1000)

    setCounterTopBarId(couterTopBar)
    const timeCounterId = setInterval(() => {
      setBonus(true)
      setTimeToTheNextBonus(null)
    }, timeToTheNextBonus * 1000)

    setTimeCounterId(timeCounterId)
  }

  const gameElementsLoop = () => setGameLoopNum((prev) => (prev += 1))

  const createContext = (ref) => {
    const context = ref.current.getContext("2d")
    context.clearRect(0, 0, canvasSize[0], canvasSize[1])
    context.setTransform(scale, 0, 0, scale, 0, 0)
    return context
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
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop()
    if (checkBonusCollision(snakeCopy)) {
      // console.log("cos sie dzieje po najechaniu bonusu")
    }
    setSnake(snakeCopy)
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
    setApple(apple_start)
    setBonusPosition([2, 9])
    setDirection(directions.ArrowRight)
    setSnake(snake_start)
    setStart(true)
  }

  const pauseGame = () => {
    setPause(!pause)
  }

  const endGame = () => {
    setGameOver(true)
    setSpeed(10)
    setStart(false)
    setTimeToTheNextBonus(null)
  }

  const choseImage = () => images[fruitNumber]

  const drawGainPointsText = (context) => {
    context.font = `${24 / scale}px Arial`
    context.fillStyle = `rgba(76, 175, 80, ${opacity})`
    context.fillText(
      `+${BASIC_POINTS * pointsMultiplier} points`,
      textPosition?.[0],
      textPosition?.[1]
    )
    setTextPosition((prev) => textAnimation(prev))
    if (opacity <= 0) {
      setAppleCollision(false)
    }
    setOpacity((prev) => (prev -= 0.05))
  }

  const textAnimation = (position) => {
    const moveX = applePosition[0] >= 17 ? -0.05 : 0.05
    const moveY = applePosition[1] >= 3 ? -0.05 : 0.05
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

  const createApple = () =>
    apple.map((_, i) => {
      if (i === 1) {
        // we dont need y at position 0 because is topbar
        const positionY =
          Math.floor(Math.random() * canvasSize[i] - 40 / scale) + 1
        return positionY
      }
      const positonX = Math.floor((Math.random() * canvasSize[i]) / scale)
      return positonX
    })

  const createBonus = () =>
    bonus.map((_, i) => Math.floor((Math.random() * canvasSize[i]) / scale))

  const checkCollision = (piece, snk = snake, compareItem) => {
    // collision snakeHead with wall
    if (
      piece[0] * scale >= canvasSize[0] ||
      piece[0] < 0 ||
      piece[1] * scale >= canvasSize[1] ||
      piece[1] < 0 + 40 / scale
    )
      return true

    for (const segment of snk) {
      // collision snakeHead with snake body
      if (piece[0] === segment[0] && piece[1] === segment[1]) {
        // console.log("kolizja ze snejkiem")
        return true
      }
    }
    if (piece?.[0] === compareItem?.[0] && piece?.[1] === compareItem?.[1]) {
      //apple and bonus colision
      return true
    }
    return false
  }

  const checkAppleCollision = (snake) => {
    const snakeHead = snake[0]

    if (snakeHead[0] === apple[0] && snakeHead[1] === apple[1]) {
      const newTextPosition = [...apple]
      setApplePosition(apple)
      if (apple[0] >= 18) {
        newTextPosition[0] = 17
        setTextPosition(newTextPosition)
      } else {
        setTextPosition(newTextPosition)
      }

      setAppleCollision(true)

      setOpacity(1)

      let newApple = createApple()
      const randomNumber = Math.floor(Math.random() * 13)
      setFruitNumber(randomNumber)
      setScore((prev) => newScore(prev))

      while (checkCollision(newApple, snake, bonus)) {
        newApple = createApple()
      }

      setApple([19, 1])

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
      setBonusPosition(newBonus)
      return true
    }
  }

  const drawTopBar = (context, bonusStatus, timeToTheNextBonus) => {
    context.fillStyle = "rgb(112, 99, 192)"
    context.strokeStyle = "rgb(112, 99, 192)"
    context.beginPath()
    context.moveTo(0, 37 / scale)
    context.lineTo(canvasSize[0] / scale, 37 / scale)
    context.lineWidth = 3 / scale
    context.stroke()
    context.font = `${25 / scale}px Arial`
    context.fillText(`Snake speed: ${speed}%`, 20 / scale, 25 / scale)
    context.fillText(`Bonus ${bonusStatus}: ${bonusApear}s`, 7, 25 / scale)
    context.fillText(
      `Score  ${score}`,
      canvasSize[0] / scale - 150 / scale,
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
    context.fillRect(bonusPosition?.[0], bonusPosition?.[1], 1, 1)
  }

  const checkElementIsDrawn = (context, element) => {
    return context
      .getImageData(element[0] * scale, element[1] * scale, scale, scale)
      .data.some((channel) => channel !== 0)
  }

  useInterval(
    () => snakeLoop(),
    firstRender ? firstRender : 7000 / speed,
    start,
    pause
  )
  useInterval(
    () => gameElementsLoop(),
    firstRender ? firstRender : 70,
    start,
    pause
  )

  const playAgain = () => {
    setStart(false)
    setTimeToTheNextBonus(null)
    setBonus(false)
    setGameOver(false)

    setPointsMultiplier(5)
    setSpeed(50)
    setScore(0)
    setSnake(snake_start)
    setWin(false)
    setTextPosition(null)
    setFirstRender(1)
    setAppleCollision(false)
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
    canvasRef1,
    moveSnake,
    win,
    canvasRef2,
    canvasRef3,
  }
}

export default useSnakeLogic
