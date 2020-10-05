import { NativeSyntheticEvent, NativeTouchEvent } from 'react-native';
import React from 'react';
import styled from 'styled-components/native';

const StyledText = styled.Text`
  font-family: 'Rubik_400Regular';
  font-weight: 400;
  font-size: 14px;
  line-height: ${({ big }) => (!big ? '20px' : '30px')};
  text-align: center;
  color: ${({ disabled, theme }) => (disabled ? theme.grey30 : theme.grey0)};
`;

const StyledContainer = styled.TouchableOpacity`
  background-color: ${({ disabled, theme }) =>
    disabled ? theme.grey30 : theme.primary60};
  border-radius: ${({ theme }) => theme.borderRadius};

  width: 100%;

  padding: 5px 12px;
  margin: 7px 0;
  border: 2px solid transparent;
`;

interface ButtonProps {
  title: string;
  onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void;
  color?: string;
  disabled?: boolean;
  big?: boolean;
}

const StyledButton = ({ onPress, title, big, disabled }: ButtonProps) => (
  <StyledContainer big={big} disabled={disabled} onPress={onPress}>
    <StyledText big={big} disabled={disabled}>
      {title}
    </StyledText>
  </StyledContainer>
);

export default StyledButton;
