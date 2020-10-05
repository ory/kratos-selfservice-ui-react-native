import { NativeSyntheticEvent, NativeTouchEvent } from 'react-native';
import React from 'react';
import styled from 'styled-components/native';
import { ThemeProps } from '@oryd/themes';

const StyledText = styled.Text`
  font-family: 'Rubik_400Regular';
  font-weight: 400;
  font-size: 14px;
  line-height: ${({ big }: ThemeProps & StyleProps) =>
    !big ? '20px' : '30px'};
  text-align: center;
  color: ${({ disabled, theme }: ThemeProps & StyleProps) =>
    disabled ? theme.grey30 : theme.grey0};
`;

const StyledContainer = styled.TouchableOpacity`
  background-color: ${({ disabled, theme }: ThemeProps & StyleProps) =>
    disabled ? theme.grey10 : theme.primary60};
  border-radius: ${({ theme }: ThemeProps) => theme.borderRadius};

  width: 100%;

  padding: 5px 12px;
  margin: 7px 0;
  border: 2px solid transparent;
`;

interface StyleProps {
  disabled?: boolean;
  big?: boolean;
}

interface ButtonProps extends StyleProps {
  title: string;
  onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void;
}

const StyledButton = ({ onPress, title, big, disabled }: ButtonProps) => (
  <StyledContainer big={big} disabled={disabled} onPress={onPress}>
    <StyledText big={big} disabled={disabled}>
      {title}
    </StyledText>
  </StyledContainer>
);

export default StyledButton;
