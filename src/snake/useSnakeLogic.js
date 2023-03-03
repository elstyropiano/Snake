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
import teleportImg from "./images/teleport/teleport.png"
import cave from "./hole/cave.png"
import spiderWeb from "./hole/spiderWeb.png"
import muffin from "./images/muffin.png"
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
]

const useSnakeLogic = () => {
  const [fruitPosition, setFruitPosition] = useState([])
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
  const [sparkleColumn, setSparkleColumn] = useState(0)
  const [sparkleRow, setSparkleRow] = useState(0)
  const [sparkleAnimation, setSparkleAnimation] = useState(0)
  const [crashAnimation, setCrashAnimation] = useState(0)
  const [elementAnimation, setElementAnimation] = useState(0)
  const [sparkleAnimationId, setSparkleAnimationId] = useState(null)

  const [crashAnimationId, setCrashAnimationId] = useState(null)
  const [snakeLength, setSnakeLength] = useState(null)
  const [keyAmount, setKeyAmout] = useState(0)
  const [crashWithNoWall, setCrashWithNotWall] = useState(false)
  const [snakeDisappear, setSnakeDisappear] = useState(false)
  const [fruitsArray, setFruitsArray] = useState([])
  const [win, setWin] = useState(false)
  const [bonus, setBonus] = useState(false)
  const [bonusArea, setBonusArea] = useState(false)
  const [crashColumn, setCrashColumn] = useState(0)
  const [crashRow, setCrashRow] = useState(0)
  const [teleportColumn, setTeleportColumn] = useState(0)
  const [teleportRow, setTeleportRow] = useState(0)
  const [teleportAnimation, setTeleportAnimation] = useState(0)
  const [telportAnimationId, setTeleportAnimationId] = useState(null)

  const [timeToBonusAppear, setTimeToBonusAppear] = useState(null)
  const [timeToBonusDisappear, setTimeToBonusDisappear] = useState(null)
  const [counterBonusDisappearId, setCounterBonusDisappearId] = useState(null)
  const [counterBonusAppearId, setCounterBonusAppearId] = useState(null)
  const [teleportNumber, setTeleportNumber] = useState(0)

  const [bonusNumber, setBonusNumber] = useState(null)
  const canvasRef1 = useRef()
  const canvasRef2 = useRef()
  const canvasRef3 = useRef()
  const canvasRef4 = useRef()
  const canvasRef5 = useRef()
  const canvasRef6 = useRef()
  const canvasRef7 = useRef()
  const canvasRef8 = useRef()
  const decimalPlaces = 1
  const pointsForFruit = `+ ${BASIC_POINTS * pointsMultiplier} points`
  const fruitText = "fruit"
  const bonusText = "bonus"
  const imageSWidth = 64
  const imageSHeight = 64
  const teleportSWidth = 192
  const teleportSHeight = 192
  const teleportInCavePosition = [4, 4]

  useEffect(() => {
    if (start) {
      const context = createContext(canvasRef1)
      if (snakeDisappear) return
      if (snake.length === 378) {
        setWin(true)
        setStart(false)
        setGameOver(true)
        return
      }
      const snakeHead = snake[0]
      drawSnake(context)
      if (crashAnimation > 1) return

      if (checkElementIsDrawn(context, snakeHead)) setFirstRender(null)
    }
  }, [snake, crashAnimation, snakeDisappear, pause])

  useEffect(() => {
    if (crashWithNoWall) {
      return
    }
    if (start) {
      if (bonus) {
        const randomNum = generateRandomNum(3, 5)
        createElementPosition(fruitPosition, setBonusPosition)
        setBonusPosition([0, 19])
        setTimeToBonusDisappear(randomNum)
        const counterId = counter(setTimeToBonusDisappear, false)
        setCounterBonusDisappearId(counterId)
        randomBonusNumber()

        return
      }

      const randomNum = generateRandomNum(2, 5)
      setTimeToBonusAppear(randomNum)
      const counterId = counter(setTimeToBonusAppear, true)
      setCounterBonusAppearId(counterId)
    }
  }, [bonus, start, crashWithNoWall])

  useEffect(() => {
    if (start) {
      if (bonusArea) {
        createRadomFruitsArray()

        setTimeout(() => {
          setSnakeDisappear(false)
          setPause(false)
          elementsLoop()
        }, 1500)
      }
      if (!bonusArea) {
        console.log()
        createElementPosition(bonusPosition, setFruitPosition)
      }
    }
  }, [bonusArea])
  useEffect(() => {
    if (start) {
      const context = createContext(canvasRef3)
      const contextText = createContext(canvasRef5)
      if (bonusArea) {
        if (teleportNumber === 0) {
          teleportAnimationLoop()
          setTeleportNumber(1)
        }
        drawSpiderWeb(context)
        drawCave(context)
        drawBonusAreaCakes(context)
      }
      if (!bonusArea) {
        if (bonus) drawBonus(context)
        drawFruit(context)
      }
      drawKeyOnTopBar(contextText)
      if (elementCollision) {
        elementCollision === "fruit"
          ? drawTextElementCollision(contextText, pointsForFruit)
          : drawTextElementCollision(contextText, bonuses[bonusNumber].text)
      }
    }
  }, [elementAnimation, bonusArea])

  useEffect(() => {
    if (start) {
      const context = createContext(canvasRef4)

      if (snakeDisappear) return
      if (!bonus) clearInterval(sparkleAnimationId)
      if (bonus) {
        setSparkleImageRowsAndColumns()
        drawSparkle(context)
      }
    }
  }, [sparkleAnimation, bonus, snakeDisappear])

  useEffect(() => {
    if (start) {
      const context = createContext(canvasRef8)
      setTeleportImageRowsAndColumns()
      drawTeleport(context)
    }
  }, [teleportAnimation])

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
      setCrashImageRowsAndColumns()
      drawCrashAnimation(context)
    }
  }, [crashAnimation])

  const setCrashImageRowsAndColumns = () =>
    setCrashColumn((prev) => {
      if (prev + 1 > 7) {
        setCrashRow((prev) => {
          if (prev + 1 > 3) {
            clearInterval(crashAnimationId)
            endGame()
          }
          return (prev += 1)
        })
        return 0
      }
      return (prev += 1)
    })

  const setSparkleImageRowsAndColumns = () =>
    setSparkleColumn((prev) => {
      if (prev + 1 > 2) {
        setSparkleRow((prev) => {
          if (prev + 1 > 2) return 0
          return (prev += 1)
        })
        return 0
      }
      return (prev += 1)
    })

  const setTeleportImageRowsAndColumns = () =>
    setTeleportColumn((prev) => {
      if (prev + 1 > 4) {
        setTeleportRow((prev) => {
          if (prev + 1 > 7) {
            if (!bonusArea) {
              clearInterval(telportAnimationId)
              setBonusPosition(null)

              setSnakeDisappear(true)
              setBonusArea(true)
              setSnakeLength(snake.length)
              setDirection(directions.ArrowRight)
              setSnake([[4, 4]])
            }
            clearInterval(telportAnimationId)
            return 0
          }
          return (prev += 1)
        })
        return 0
      }
      return (prev += 1)
    })

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
  const createRadomFruitsArray = () => {
    let fruitsArray = []
    let newElementPosition
    const arr = ["", ""]
    for (let i = 0; i < 10; i++) {
      do {
        newElementPosition = arr.map((_, i) =>
          i === 1
            ? generateRandomNum((canvasSize[i] - 40) / scale, 1)
            : generateRandomNum(canvasSize[i] / scale, 0)
        )
      } while (checkFruitPositionExsist(newElementPosition, fruitsArray))

      fruitsArray.push(newElementPosition)
    }

    setFruitsArray(fruitsArray)
  }

  const checkFruitPositionExsist = (newElementPosition, fruitsArray) => {
    for (let i = 0; i < fruitsArray.length; i++) {
      if (
        newElementPosition[0] === fruitsArray[i][0] &&
        newElementPosition[1] === fruitsArray[i][1]
      )
        return true
      if (newElementPosition[0] === 4 && newElementPosition[0] === 4) {
        return true
      }
    }
    return false
  }

  const counter = (setTime, bonusStatus) => {
    const id = setInterval(
      () =>
        setTime((prev) => {
          if (prev - 1 === 0) {
            setBonus(bonusStatus)
            if (!bonusStatus) {
              setSnakeDisappear(false)
              setBonusArea(false)
              setTeleportNumber(0)
            }
            clearInterval(id)
            return null
          }
          return (prev -= 1)
        }),
      1000
    )
    return id
  }

  const createContext = (ref) => {
    const context = ref.current.getContext("2d")
    context.clearRect(0, 0, canvasSize[0], canvasSize[1])
    context.setTransform(scale, 0, 0, scale, 0, 0)
    return context
  }

  const drawSnake = (context) => {
    if (crashAnimation === 1 && !crashWithNoWall) {
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
  }
  const randomBonusNumber = () => {
    let randomNumBonus
    do {
      randomNumBonus = generateRandomNum(6, 0)
      console.log(randomNumBonus, "randomNumBonus")
    } while (randomNumBonus === 4 && keyAmount === 1)

    setBonusNumber(5)
    setKeyAmout(1)

    if (!(randomNumBonus === 5 && keyAmount === 0)) loopForSparkle()
  }
  const startGame = () => {
    createElementPosition(bonusPosition, setFruitPosition)
    setBonusPosition([])
    setDirection(directions.ArrowRight)
    setSnake(snake_start)
    setStart(true)
    elementsLoop()
    setTeleportNumber(0)
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
    setCrashWithNotWall(false)
    stopCounter()
    setGameOver(true)
    setSpeed(10)
    setStart(false)
    setPause(false)
    setCrashAnimation(0)
    setBonus(false)
    setCrashRow(0)
    setCrashColumn(0)
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
        setCrashWithNotWall(true)
        return true
      }
    //apple and bonus colision
    if (piece?.[0] === compareItem?.[0] && piece?.[1] === compareItem?.[1])
      return true

    return false
  }

  const checkElementCollision = (snake, elementPosition, elementType) => {
    if (bonusArea) return false
    const snakeHead = snake[0]

    if (
      snakeHead[0] === elementPosition?.[0] &&
      snakeHead[1] === elementPosition?.[1]
    ) {
      if (elementType === "fruit") {
        const randomNum = generateRandomNum(19, 0)
        setFruitNumber(randomNum)
        setScore((prev) => newScore(prev))
        createElementPosition(bonusPosition, setFruitPosition)
      }
      if (elementType === "bonus") {
        if (!(bonusNumber === 5 && keyAmount === 1)) setBonus(false)
        if (bonusNumber <= 3)
          setScore((prev) => (prev += bonuses[bonusNumber].points))
        if (bonusNumber === 4) setKeyAmout(1)
        if (bonusNumber === 5 && keyAmount === 1) openDoorCollision()
      }

      const newTextPosition = [...elementPosition]
      const newStartingTextPosition = [...snakeHead]

      if (elementPosition[0] >= 18) {
        newTextPosition[0] = 17
        newStartingTextPosition[0] = 17
      }
      setElementCollision(elementType)
      setTextPosition(newTextPosition)
      setStartingTextPosition(newStartingTextPosition)
      setOpacity(1)
      return true
    }
    return false
  }

  const openDoorCollision = () => {
    stopCounter()
    setKeyAmout(0)
    setPause(true)
    teleportAnimationLoop()
    setTimeout(() => {
      setTimeToBonusDisappear(15)
      const counterId = counter(setTimeToBonusDisappear, false)
      setCounterBonusDisappearId(counterId)
    }, 3000)
  }

  const checkCollisionWithBonusAreaFruit = (newSnakeHead) => {
    const newArray = fruitsArray.filter(([fruitX, fruitY]) => {
      if (newSnakeHead[0] === fruitX && newSnakeHead[1] === fruitY) {
        const newTextPosition = [fruitX, fruitY]
        const newStartingTextPosition = [...newSnakeHead]
        setScore((prev) => newScore(prev))
        setElementCollision(fruitText)
        setTextPosition(newTextPosition)
        setStartingTextPosition(newStartingTextPosition)
        setOpacity(1)
        return false
      }
      return true
    })

    setFruitsArray(newArray)
  }

  const snakeLoop = () => {
    const snakeCopy = [...snake]
    const snakeHead = snakeCopy[0]

    const newSnakeHead = [
      snakeHead[0] + direction[0],
      snakeHead[1] + direction[1],
    ]

    snakeCopy.unshift(newSnakeHead)

    if (bonusArea) checkCollisionWithBonusAreaFruit(newSnakeHead)

    if (!checkElementCollision(snake, fruitPosition, fruitText)) snakeCopy.pop()

    if (bonusArea) {
      if (snakeLength > snake.length) {
        setSnake([...snakeCopy, [4, 4]])
        return
      }
    }

    const bonusCollision = checkElementCollision(
      snake,
      bonusPosition,
      bonusText
    )
    if (checkCollision(newSnakeHead) && !bonusCollision) {
      setPause(true)
      crashAnimationLoop()
      stopCounter()
    }

    setSnake(snakeCopy)
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

  const loopForSparkle = () => {
    const id = setInterval(() => setSparkleAnimation((prev) => (prev += 1)), 90)
    setSparkleAnimationId(id)
  }
  const crashAnimationLoop = () => {
    const id = setInterval(() => setCrashAnimation((prev) => (prev += 1)), 100)
    setCrashAnimationId(id)
  }

  const teleportAnimationLoop = () => {
    const id = setInterval(
      () => setTeleportAnimation((prev) => (prev += 1)),
      80
    )
    setTeleportAnimationId(id)
  }

  const elementsLoop = () =>
    setInterval(() => setElementAnimation((prev) => (prev += 1), 200))

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
    setBonusArea(false)
  }
  //Draw functions - start

  const drawImage = (context, imageSrc, dx, dy, dWidth, dHeight) => {
    const image = new Image()
    image.src = imageSrc
    context.drawImage(image, dx, dy, dWidth, dHeight)
  }

  const drawTopBar = (context, bonusStatus, counter) => {
    context.font = `${25 / scale}px Arial`
    drawTopDivider(context)
    drawSnakeSpeed(context)
    drawCounter(context, bonusStatus, counter)
    drawKeyAmount(context)
    drawScore(context)
  }
  const drawTopDivider = (context) => {
    context.fillStyle = "rgb(112, 99, 192)"
    context.strokeStyle = "rgb(112, 99, 192)"
    context.beginPath()
    context.moveTo(0, 37 / scale)
    context.lineTo(canvasSize[0] / scale, 37 / scale)
    context.lineWidth = 3 / scale
    context.stroke()
  }

  const drawSnakeSpeed = (context) =>
    context.fillText(`Snake speed: ${speed}%`, 20 / scale, 25 / scale)

  const drawCounter = (context, bonusStatus, counter) =>
    context.fillText(`Bonus ${bonusStatus}: ${counter}s`, 7, 25 / scale)

  const drawScore = (context) =>
    context.fillText(
      `Score  ${score}`,
      canvasSize[0] / scale - 150 / scale,
      25 / scale
    )

  const drawKeyAmount = (context) =>
    context.fillText(
      `: ${keyAmount}`,
      canvasSize[0] / scale - 220 / scale,
      25 / scale
    )

  const drawBonus = (context) => {
    const bonuImg = choseImage()
    const bonusImgIsArray = checkBonusImgIsArray()
    const bonusHeight = 1
    let moveX = 0
    let bonusWidth = 1

    if (bonusImgIsArray && keyAmount === 0) {
      moveX = 0.25
      bonusWidth = 0.75
    }

    const dx = bonusPosition?.[0] + moveX
    const dy = bonusPosition?.[1]

    drawImage(context, bonuImg, dx, dy, bonusWidth, bonusHeight)
  }

  const drawCave = (context) => drawImage(context, cave, 3.5, 3.5, 2, 2)

  const drawFruit = (context) => {
    const fruitImage = choseImage("fruits")
    drawImage(context, fruitImage, fruitPosition[0], fruitPosition[1], 1, 1)
  }
  const drawSpiderWeb = (context) => drawImage(context, spiderWeb, 0, 0, 20, 20)

  const drawBonusAreaCakes = (context) =>
    fruitsArray.forEach(([fruitX, fruitY]) =>
      drawImage(context, muffin, fruitX, fruitY, 1, 1)
    )

  const drawKeyOnTopBar = (context) => {
    const dx = canvasSize[0] / scale - 250 / scale
    const dy = 4 / scale
    drawImage(context, key, dx, dy, 0.6, 0.6)
  }

  const drawSparkle = (context) => {
    const sx = imageSWidth * sparkleColumn
    const sy = imageSHeight * sparkleRow
    const dx = bonusPosition?.[0] - 0.5
    const dy = bonusPosition?.[1] - 0.5
    const dWidth = 2
    const dHeight = 2

    drawImageFromSpritesheet(
      context,
      sparkle,
      sx,
      sy,
      imageSWidth,
      imageSHeight,
      dx,
      dy,
      dWidth,
      dHeight
    )
  }

  const drawTeleport = (context) => {
    const sx = teleportSWidth * teleportColumn
    const sy = teleportSHeight * teleportRow
    const teleportPosition = bonusArea ? teleportInCavePosition : bonusPosition
    const dx = teleportPosition?.[0] - 1.5
    const dy = teleportPosition?.[1] - 1.5
    const dWidth = 4
    const dHeight = 4

    drawImageFromSpritesheet(
      context,
      teleportImg,
      sx,
      sy,
      teleportSWidth,
      teleportSHeight,
      dx,
      dy,
      dWidth,
      dHeight
    )
  }

  const drawCrashAnimation = (context) => {
    const crashImage = new Image()
    crashImage.src = boom
    const sx = imageSWidth * crashColumn
    const sy = imageSHeight * crashRow
    const dx = snake?.[0][0] - 1.5
    const dy = snake?.[0][1] - 1.5
    const dWidth = 4
    const dHeight = 4

    drawImageFromSpritesheet(
      context,
      boom,
      sx,
      sy,
      imageSWidth,
      imageSHeight,
      dx,
      dy,
      dWidth,
      dHeight
    )
  }

  const drawImageFromSpritesheet = (
    context,
    imageSrc,
    sx,
    sy,
    sWidth,
    sHeight,
    dx,
    dy,
    dWidth,
    dHeight
  ) => {
    const image = new Image()
    image.src = imageSrc
    context.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  }

  //Draw functions - end

  return {
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
    canvasRef7,
    canvasRef8,
    setPointsMultiplier,
    setSpeed,
    startGame,
    moveSnake,
    playAgain,
    pauseGame,
  }
}

export default useSnakeLogic
