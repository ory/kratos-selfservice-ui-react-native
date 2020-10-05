import styled from 'styled-components/native';

export default styled.TextInput`
  font-family: 'Rubik_400Regular';

  color: ${({ theme }) => theme.grey70};
  border-radius: ${({ theme }) => theme.borderRadius};
  width: 100%;
  padding: 5px 12px;

  margin-top: 7px;
  margin-bottom: ${({ help }) => (!help ? '15px' : '7px')};
  border: 1px solid ${({ theme }) => theme.grey10};

  background-color: ${({ theme }) => theme.grey0};
`;
