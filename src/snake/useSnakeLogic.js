import { useState, useEffect, useRef } from "react"

import {
  canvasSize,
  scale,
  snake_start,
  directions,
  BASIC_POINTS,
} from "./constans"

import img_0 from "./images/fruits/0.png"
import img_1 from "./images/fruits/1.png"
import img_2 from "./images/fruits/2.png"
import img_3 from "./images/fruits/3.png"
import img_4 from "./images/fruits/4.png"
import img_5 from "./images/fruits/5.png"
import img_6 from "./images/fruits/6.png"
import img_7 from "./images/fruits/7.png"
import img_8 from "./images/fruits/8.png"
import img_9 from "./images/fruits/9.png"
import img_10 from "./images/fruits/10.png"
import img_11 from "./images/fruits/11.png"
import img_12 from "./images/fruits/12.png"
import img_13 from "./images/fruits/13.png"
import img_14 from "./images/fruits/14.png"
import img_15 from "./images/fruits/15.png"
import img_16 from "./images/fruits/16.png"
import img_17 from "./images/fruits/17.png"
import img_18 from "./images/fruits/18.png"
import coin20 from "./images/bonuses/coins/20.png"
import coin25 from "./images/bonuses/coins/25.png"
import coin50 from "./images/bonuses/coins/50.png"
import coin100 from "./images/bonuses/coins/100.png"
import sparkle from "./images/bonuses/sparkle_spritesheet.png"
import key from "./images/bonuses/door/key.png"
import doorClosed from "./images/bonuses/door/door_closed.png"
import doorOpened from "./images/bonuses/door/door_opened.png"
import boom from "./images/collision/boom.png"
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
  img_13,
  img_14,
  img_15,
  img_16,
  img_17,
  img_18,
]

const bonuses = [
  { img: coin20, points: 20, text: "+ 20 points" },
  { img: coin25, points: 25, text: "+ 25 points" },
  { img: coin50, points: 50, text: "+ 50 points" },
  { img: coin100, points: 100, text: "+ 100 points" },
  { img: key, text: "you got the key" },
  {
    img: [doorOpened, doorClosed],
    text: ["You open doors", "You crash with doors"],
  },
  // { img: , text: "you got the key" },
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
  const [imgColumn, setImgColumn] = useState(0)
  const [imgRow, setImgRow] = useState(0)
  const [sparkleAnimation, setSparkleAnimation] = useState(0)
  const [crashAnimation, setCrashAnimation] = useState(0)
  const [elementAnimation, setElementAnimation] = useState(0)
  const [sparkleAnimationId, setSparkleAnimationId] = useState(null)
  const [elementLoopId, setElementLoopId] = useState(null)
  const [crashAnimationId, setCrashAnimationId] = useState(null)
  const [keyAmount, setKeyAmout] = useState(0)

  const [win, setWin] = useState(false)
  const [bonus, setBonus] = useState(false)

  const [crashColumn, setCrashColumn] = useState(0)
  const [crashRow, setCrashRow] = useState(0)

  const [gameLoopNum, setGameLoopNum] = useState(0)
  const [timeToBonusAppear, setTimeToBonusAppear] = useState(null)
  const [timeToBonusDisappear, setTimeToBonusDisappear] = useState(null)
  const [counterBonusDisappearId, setCounterBonusDisappearId] = useState(null)
  const [counterBonusAppearId, setCounterBonusAppearId] = useState(null)
  const [bonusNumber, setBonusNumber] = useState(null)
  const canvasRef1 = useRef()
  const canvasRef2 = useRef()
  const canvasRef3 = useRef()
  const canvasRef4 = useRef()
  const canvasRef5 = useRef()
  const canvasRef6 = useRef()
  const decimalPlaces = 1
  const pointsForFruit = `+ ${BASIC_POINTS * pointsMultiplier} points`
  const fruitText = "fruit"
  const bonusText = "bonus"
  const cutedImageWidth = 64
  const cutedImageHeight = 64
  // const crashCutedImageWidth = 128
  // const crashCutedImageHeight = 128

  useEffect(() => {
    if (snake.length === 378) {
      setWin(true)
      setStart(false)
      setGameOver(true)
      return
    }
    if (start) {
      const context = createContext(canvasRef1)
      const snakeHead = snake[0]
      drawSnake(context)
      if (crashAnimation > 1) return

      if (checkElementIsDrawn(context, snakeHead)) setFirstRender(null)
    }
  }, [snake, crashAnimation])

  useEffect(() => {
    if (start) {
      if (bonus) {
        const randomNum = generateRandomNum(3, 5)
        createElementPosition(applePosition, setBonusPosition)
        setTimeToBonusDisappear(randomNum)
        const counterId = counter(setTimeToBonusDisappear, false)
        setCounterBonusDisappearId(counterId)
        let randomNumBonus
        do {
          randomNumBonus = generateRandomNum(6, 0)
        } while (randomNumBonus === 4 && keyAmount === 1)

        setBonusNumber(randomNumBonus)
        if (!(randomNumBonus === 5 && keyAmount === 0)) loopForSparkle()

        return
      }
      const randomNum = generateRandomNum(2, 5)
      setTimeToBonusAppear(randomNum)
      const counterId = counter(setTimeToBonusAppear, true)
      setCounterBonusAppearId(counterId)
    }
  }, [bonus, start])

  useEffect(() => {
    if (start) {
      const context = createContext(canvasRef3)
      const contextKey = createContext(canvasRef5)
      if (elementCollision) {
        elementCollision === "fruit"
          ? drawTextElementCollision(context, pointsForFruit)
          : drawTextElementCollision(context, bonuses[bonusNumber].text)
      }

      if (bonus) {
        drawBonus(context)
      }
      drawKeyOnTopBar(contextKey)
      drawFruit(context)
    }
  }, [elementAnimation])

  useEffect(() => {
    if (start) {
      const context = createContext(canvasRef4)
      if (bonus) {
        setImgColumn((prev) => {
          if (prev + 1 > 2) {
            setImgRow((prev) => {
              if (prev + 1 > 2) {
                return 0
              }
              return (prev += 1)
            })
            return 0
          }
          return (prev += 1)
        })
        console.log(imgRow, "imgRow")
        console.log(imgColumn, "imgColumn")
        drawSparkle(context)

        return
      }
      clearInterval(sparkleAnimationId)
      setBonusPosition(null)
    }
  }, [sparkleAnimation, bonus])

  useEffect(() => {
    if (start) {
      const context = createContext(canvasRef2)
      const bonusStatus = timeToBonusAppear ? "appear" : "disappear"
      const counter = timeToBonusAppear
        ? timeToBonusAppear
        : timeToBonusDisappear
      drawTopBar(context, bonusStatus, counter)
    }
  }, [score, start, timeToBonusAppear, timeToBonusDisappear, keyAmount])

  useEffect(() => {
    if (start) {
      const context = createContext(canvasRef6)

      setCrashColumn((prev) => {
        if (prev + 1 > 7) {
          setCrashRow((prev) => {
            if (prev + 1 > 3) {
              clearInterval(crashAnimationId)
            }
            return (prev += 1)
          })
          return 0
        }
        return (prev += 1)
      })

      drawCrashAnimation(context)

      return
    }
  }, [crashAnimation])

  const createElementPosition = (elementToCompare, setPosition) => {
    let newElementPosition
    const arr = ["", ""]
    do {
      newElementPosition = arr.map((_, i) =>
        i === 1
          ? generateRandomNum((canvasSize[i] - 40) / scale, 1)
          : generateRandomNum(canvasSize[i] / scale, 0)
      )
    } while (checkCollision(newElementPosition, snake, elementToCompare))

    setPosition(newElementPosition)
  }

  const counter = (setTime, bonusStatus) => {
    const id = setInterval(
      () =>
        setTime((prev) => {
          if (prev - 1 === 0) {
            setBonus(bonusStatus)
            clearInterval(id)
            return null
          }
          return (prev -= 1)
        }),
      1000
    )
    return id
  }

  // const gameElementsLoop = () => setGameLoopNum((prev) => (prev += 1))

  const createContext = (ref, text) => {
    const context = ref.current.getContext("2d")
    if (!text) {
      context.clearRect(0, 0, canvasSize[0], canvasSize[1])
    }

    context.setTransform(scale, 0, 0, scale, 0, 0)

    return context
  }

  const drawSnake = (context) => {
    if (crashAnimation === 1) {
      snake.shift()
    }
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
    // if (crashAnimation > 0) {
    //   set
    // }
  }

  const startGame = () => {
    createElementPosition(bonusPosition, setApplePosition) //create apple
    setBonusPosition([])
    setDirection(directions.ArrowRight)
    setSnake(snake_start)
    setStart(true)
    elementsLoop()
  }

  const pauseGame = () => {
    setPause(!pause)
  }

  const stopCounter = () => {
    const intervalToStopId = bonus
      ? counterBonusDisappearId
      : counterBonusAppearId
    clearInterval(intervalToStopId)
  }
  const endGame = () => {
    stopCounter()
    setGameOver(true)
    setSpeed(10)
    setStart(false)

    setBonus(false)
  }
  const checkBonusImgIsArray = () => {
    const bonusImg = bonuses[bonusNumber]?.img
    return Array.isArray(bonusImg)
  }
  const choseImage = (arrayName) => {
    if (arrayName === "fruits") return images[fruitNumber]

    const bonusImgIsArray = checkBonusImgIsArray()
    if (bonusImgIsArray) {
      const doorKind =
        keyAmount !== 0
          ? bonuses[bonusNumber]?.img[0]
          : bonuses[bonusNumber]?.img[1]
      return doorKind
    }

    return bonuses[bonusNumber]?.img
  }

  const drawTextElementCollision = (context, text) => {
    context.font = `${24 / scale}px Arial`
    context.fillStyle = `rgba(76, 175, 80, ${opacity})`
    context.fillText(text, textPosition?.[0], textPosition?.[1])

    if (opacity <= 0) setElementCollision(false)

    setTextPosition((prev) => textAnimation(prev))
    setOpacity((prev) => (prev -= 0.005))
  }
  const drawCrashAnimation = (context) => {
    const crashImage = new Image()
    crashImage.src = boom

    context.drawImage(
      crashImage,
      cutedImageWidth * crashColumn,
      cutedImageHeight * crashRow,
      cutedImageWidth,
      cutedImageHeight,
      snake?.[0][0] - 1,
      snake?.[0][1] - 1,
      3,
      3
    )
    // console.log(snake, "snake w drawCrashAnimation")
    // +
  }

  const textAnimation = (position) => {
    const moveX = startingTextPosition[0] === 17 ? -0.002 : 0.002
    const moveY = startingTextPosition[1] >= 3 ? -0.002 : 0.002
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
      snakeHead[0] === elementPosition?.[0] &&
      snakeHead[1] === elementPosition?.[1]
    ) {
      const randomNum = generateRandomNum(19, 0)
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

      if (setFruitNumber) {
        setFruitNumber(randomNum)
        setScore((prev) => newScore(prev))
      }
      if (setBonus) {
        setBonus(false)
        // setBonusPosition(null)
      }
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
    if (checkCollision(newSnakeHead)) {
      console.log(snake, "snake")
      setPause(true)
      crashAnimationLoop()
      stopCounter()

      // endGame()
    }
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
      clearInterval(counterBonusDisappearId)
      if (bonusNumber === 4) setKeyAmout(1)
      else if (bonusNumber === 5) setKeyAmout(0)
      else setScore((prev) => (prev += bonuses[bonusNumber].points))
    }

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

    setSnake(snakeCopy)
  }
  const drawKeyOnTopBar = (context) => {
    const keyImage = new Image()
    keyImage.src = key
    context.drawImage(
      keyImage,
      canvasSize[0] / scale - 250 / scale,
      4 / scale,
      0.6,
      0.6
    )
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

    context.fillText(
      `: ${keyAmount}`,
      canvasSize[0] / scale - 220 / scale,
      25 / scale
    )
  }

  const drawFruit = (context) => {
    const appleImage = new Image()
    appleImage.src = choseImage("fruits")
    context.drawImage(appleImage, applePosition[0], applePosition[1], 1, 1)
  }

  const drawBonus = (context) => {
    let moveX = 0
    let bonusWidth = 1
    const bonusHeight = 1
    const bonusImage = new Image()
    bonusImage.src = choseImage()
    const bonusImgIsArray = checkBonusImgIsArray()

    if (bonusImgIsArray && keyAmount === 0) {
      moveX = 0.25
      bonusWidth = 0.75
    }

    context.drawImage(
      bonusImage,
      bonusPosition?.[0] + moveX,
      bonusPosition?.[1],
      bonusWidth,
      bonusHeight
    )
  }

  const drawSparkle = (context) => {
    console.log(imgColumn, "imgColumn w draw sprakle")
    console.log(imgRow, "imgRow  w draw sprakle")
    const sparkleImage = new Image()
    sparkleImage.src = sparkle
    context.drawImage(
      sparkleImage,
      cutedImageWidth * imgColumn,
      cutedImageWidth * imgRow,
      cutedImageWidth,
      cutedImageHeight,
      bonusPosition?.[0] - 0.5,
      bonusPosition?.[1] - 0.5,
      2,
      2
    )
  }

  const checkElementIsDrawn = (context, element) =>
    context
      .getImageData(element[0] * scale, element[1] * scale, scale, scale)
      .data.some((channel) => channel !== 0)

  const generateRandomNum = (amountOfNumbers, firstNumber) =>
    Math.floor(Math.random() * amountOfNumbers) + firstNumber

  useInterval(
    () => snakeLoop(),
    firstRender ? firstRender : 7000 / speed,
    start,
    pause
  )
  // useInterval(
  //   () => gameElementsLoop(),
  //   firstRender ? firstRender : 60,
  //   start,
  //   pause
  // )

  const loopForSparkle = () => {
    const id = setInterval(() => setSparkleAnimation((prev) => (prev += 1)), 90)
    setSparkleAnimationId(id)
  }
  const crashAnimationLoop = () => {
    const id = setInterval(() => setCrashAnimation((prev) => (prev += 1)), 100)
    setCrashAnimationId(id)
  }

  const elementsLoop = () => {
    const id = setInterval(() =>
      setElementAnimation((prev) => (prev += 1), 200)
    )
    setElementLoopId(id)
  }

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
    setKeyAmout(0)
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
    canvasRef4,
    canvasRef5,
    canvasRef6,
  }
}

export default useSnakeLogic
