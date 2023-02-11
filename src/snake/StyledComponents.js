import styled, { css } from "styled-components"
import { Grid } from "@material-ui/core"

const box = css`
  display: block;
  background-color: ${({ theme }) => theme.palette.background.default};
  border: 1px solid ${({ theme }) => theme.palette.border.default};
  box-shadow: ${({ theme }) => theme.shadows[1]};
  padding: ${({ theme }) => theme.spacing(10, 10, 10)};
  border-radius: 10px;
`

export const SG = {
  Flex: styled(Grid)`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
  `,
  FlexRow: styled(Grid)`
    display: flex;
  `,
  FlexCol: styled(Grid)`
    display: flex;
    flex-direction: column;
  `,
  Box: styled(Grid)`
    ${box}
  `,
  CardBox: styled(Grid)`
    ${box}
    display: flex;
    height: 94px;
    padding: ${({ theme }) => theme.spacing(4, 2)};
    @media ${({ theme }) => theme.device.mobileL} {
      padding: ${({ theme }) => theme.spacing(4)};
    }
    @media ${({ theme }) => theme.device.laptop} {
      padding: ${({ theme }) => theme.spacing(5)};
    }
  `,
}
