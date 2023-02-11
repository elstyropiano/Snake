import { styled, css, Button, Typography } from "@mui/material"

const StyledTypography = styled(Typography)(
  ({ score }) =>
    css`
      color: ${score ? "rgb(112, 99, 192)" : "lightgray"};
      margin-bottom: 30px;
    `
)

const GameOver = ({ score, playAgain, win }) => (
  <>
    <StyledTypography variant='h2'>
      {win ? "You Win!" : "Game Over"}
    </StyledTypography>
    {win && (
      <StyledTypography
        gutterBottom
        variant='h5'
      >{`No more space for Snake`}</StyledTypography>
    )}
    <StyledTypography
      score
      gutterBottom
      variant='h5'
    >{`You have scored : ${score} points`}</StyledTypography>
    <StyledTypography gutterBottom variant='h4'>
      Do you want to play again?
    </StyledTypography>
    <Button color='success' variant='contained' onClick={playAgain}>
      YES
    </Button>
  </>
)

export default GameOver
