import styled from 'styled-components/native';
import { ThemeProps } from '@oryd/themes';

interface Props extends ThemeProps {
  help?: string;
  editable?: boolean;
}

export default styled.TextInput`
  font-family: 'Rubik_400Regular';

  color: ${({ theme }: ThemeProps) => theme.grey70};
  border-radius: ${({ theme }: ThemeProps) => theme.borderRadius};
  width: 100%;
  padding: 5px 12px;

  margin-top: 7px;
  margin-bottom: ${({ help }) => (!help ? '15px' : '7px')};
  border: 1px solid ${({ theme }: ThemeProps) => theme.grey10};

  background-color: ${({ editable, theme }: ThemeProps & Props) =>
    !editable ? theme.grey10 : theme.grey0};
  color: ${({ editable, theme }: ThemeProps & Props) =>
    !editable ? theme.grey30 : theme.grey70};
`;
