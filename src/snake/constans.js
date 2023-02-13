const canvas = [800, 800]
const scale = 40
const snake_start = [
  [8, 18],
  [8, 19],
]
// const snake_start = () => {
//   let snake = []
//   const num = (i) => {
//     if (i === 1) {
//       return 16
//     }
//     return 19
//   }
//   console.log(snake, "snake")
//   for (let i = 1; i <= 19; i++) {
//     for (let j = num(i); j >= 0; j--) {
//       console.log(j, "j")
//       snake.push([j, i])
//     }
//   }
//   console.log(snake, "snake")
//   return snake
// }

const apple_start = [11, 12]
const directions = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
}
const SPEED = 500
const BASIC_POINTS = 1
export {
  canvas,
  scale,
  snake_start,
  apple_start,
  directions,
  SPEED,
  BASIC_POINTS,
}
