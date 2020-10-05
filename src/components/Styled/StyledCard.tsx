import styled from 'styled-components/native';

const StyledCard = styled.View`
  flex: 1;
  padding: 20px;

  margin-left: 20px;
  margin-right: 20px;

  margin-bottom: 18px;
  align-self: stretch;

  background-color: ${({ theme }) => theme.grey0};
  border: 1px solid ${({ theme }) => theme.grey10};
`;

export default StyledCard;
