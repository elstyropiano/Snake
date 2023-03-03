import { styled, css, Button, Typography } from "@mui/material"

const StyledTypography = styled(Typography)(
  ({ score }) =>
    css`
      color: ${score ? "rgb(112, 99, 192)" : "lightgray"};
      margin-bottom: 30px;
    `
)
const Wrapper = styled("div")(
  css`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    opacity: 0;
    animation: fadeIn 2s forwards;

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `
)

const GameOver = ({ score, playAgain, win, opacity }) => (
  <Wrapper>
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
  </Wrapper>
)

export default GameOver
