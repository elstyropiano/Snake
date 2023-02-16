import { Typography, Slider, Box, styled, css } from "@mui/material";
import { Stack } from "@mui/system";

const Wrapper = styled("div")(
  css`
    display: flex;
    flex-direction: column;
  `
);

const StyledTypography = styled(Typography)(
  ({ header }) =>
    css`
      text-align: center;
      color: lightgray;
      font-size: ${header ? "28px" : "18px"};
    `
);

const SliderDescriptionWrapper = styled("div")(
  css`
    display: flex;
    width: 100%;
    justify-content: space-between;
  `
);

const StyledSlider = styled(Slider)(
  ({ value }) => css`
    color: rgb(
      ${Math.round(255 * (100 - value)) / 100},
      ${Math.round((255 * value) / 100)},
      0
    );
  `
);

const SnakeSpeedSlider = ({
  setSpeed,
  speed,
  setPointsMultiplier,
  pointsMultiplier,
}) => {
  const handleChange = (e) => {
    const snakeSpeed = e.target.value;
    const newMultiplier = Math.ceil(snakeSpeed * 10) / 100;
    setSpeed(snakeSpeed);
    setPointsMultiplier(newMultiplier);
  };

  return (
    <Wrapper>
      <StyledTypography header gutterBottom>
        Please set the snake speed
      </StyledTypography>
      <Stack spacing={2} direction="column" sx={{ mb: 1 }} alignItems="center">
        <StyledSlider
          max={100}
          min={10}
          step={1}
          value={speed}
          onChange={(e) => handleChange(e)}
        />
        <SliderDescriptionWrapper>
          <StyledTypography>Speed</StyledTypography>
          <StyledTypography>{speed}%</StyledTypography>
        </SliderDescriptionWrapper>
      </Stack>
      <StyledTypography header gutterBottom>
        Points x {pointsMultiplier}
      </StyledTypography>
    </Wrapper>
  );
};

export default SnakeSpeedSlider;
