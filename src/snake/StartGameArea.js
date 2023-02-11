import { styled, css, Button } from "@mui/material"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

import SnakeSpeedSlider from "./SnakeSpeedSlider"

const StartButton = styled(Button)(
  css`
    margin-top: 30px;
    padding-right: 4px;
  `
)
const StyledArrowForwardIcon = styled(ArrowForwardIcon)(
  css`
    margin-left: 10px;
    font-size: 20px;
    font-weight: bold;
  `
)

const StartGameArea = ({ startGame, ...rest }) => (
  <>
    <SnakeSpeedSlider {...rest} />
    <StartButton color='success' variant='contained' onClick={startGame}>
      Start
      <StyledArrowForwardIcon />
    </StartButton>
  </>
)

export default StartGameArea
