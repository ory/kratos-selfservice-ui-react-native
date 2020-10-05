import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import { ThemeProps } from '@oryd/themes/theme/index';
import {
  typographyCaptionStyles,
  typographyH1Styles,
  typographyH2Styles,
  typographyH3Styles,
  typographyParagraphStyles,
} from '@oryd/themes/lib/theme/native/typographyStyles';
import { TextProps } from 'react-native';

interface StyledTextProps extends TextProps {
  variant?: 'p' | 'h1' | 'h2' | 'h3' | 'caption';
  children: ReactNode;
}

const Paragraph = styled.Text`
  ${typographyParagraphStyles}

  font-family: "Rubik_300Light";
`;

const H1 = styled.Text`
  ${typographyH1Styles}

  font-family: "Rubik_500Medium";
`;

const H2 = styled.Text`
  ${typographyH2Styles}

  font-family: "Rubik_400Regular";
`;

const H3 = styled.Text`
  ${typographyH3Styles}

  font-family: "Rubik_400Regular";
`;

const Caption = styled.Text`
  ${typographyCaptionStyles}

  font-family: "Rubik_400Regular";
`;

export default ({ variant, ...props }: StyledTextProps) => {
  switch (variant) {
    case 'h1':
      return <H1 {...props} />;
    case 'h2':
      return <H2 {...props} />;
    case 'h3':
      return <H3 {...props} />;
    case 'caption':
      return <Caption {...props} />;
    case 'p':
    default:
      return <Paragraph {...props} />;
  }
};
