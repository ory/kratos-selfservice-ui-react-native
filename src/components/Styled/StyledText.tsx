import React, { ReactNode } from 'react'
import styled from 'styled-components/native'
import {
  typographyCaptionStyles,
  typographyCodeStyles,
  typographyH1Styles,
  typographyH2Styles,
  typographyH3Styles,
  typographyLeadStyles,
  typographyParagraphStyles
} from '@ory/themes'
import { TextProps } from 'react-native'

interface StyledTextProps extends TextProps {
  variant?:
    | 'p'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'caption'
    | 'lead'
    | 'code'
    | 'code-block'
  children: ReactNode
}

const Paragraph = styled.Text(typographyParagraphStyles)

const H1 = styled.Text(typographyH1Styles)

const H2 = styled.Text(typographyH2Styles)

const H3 = styled.Text(typographyH3Styles)

const Caption = styled.Text(typographyCaptionStyles)

const Lead = styled.Text(typographyLeadStyles)

const Code = styled.Text(typographyCodeStyles)

export default ({ variant, ...props }: StyledTextProps) => {
  switch (variant) {
    case 'h1':
      return <H1 {...props} />
    case 'h2':
      return <H2 {...props} />
    case 'h3':
      return <H3 {...props} />
    case 'caption':
      return <Caption {...props} />
    case 'lead':
      return <Lead {...props} />
    case 'code':
      return <Code {...props} />
    case 'p':
    default:
      return <Paragraph {...props} />
  }
}
