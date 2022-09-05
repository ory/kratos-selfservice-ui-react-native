import styled from "styled-components/native"
import { ThemeProps } from "@ory/themes"

export const GridContainer = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;

  background-color: ${({ theme }: ThemeProps) => theme.grey5};
  width: 100%;
  margin: 0 auto;
`

export const GridRow = styled.View`
  width: 100%;
  padding: 20px;
  align-self: stretch;
`
