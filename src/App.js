import Snake from "../src/snake/Snake"
import { styled, css, Button, IconButton } from "@mui/material"

const StyledSnake = styled(Snake)(
  css`
    margin-top: 50px;
  `
)
function App() {
  return <StyledSnake />
}

export default App
