import StyledCard from './StyledCard';
import { TouchableHighlight, View } from 'react-native';
import StyledText from './StyledText';
import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components/native';

interface Props {
  onPress(): void;

  cta: string;
  description: string;
}

export default ({ onPress, cta, description }: Props) => {
  const theme = useContext(ThemeContext);
  return (
    <StyledCard>
      <TouchableHighlight onPress={onPress}>
        <View>
          <StyledText variant="h3" style={{ textAlign: 'center' }}>
            {description}{' '}
            <StyledText variant="h3" style={{ color: theme.primary60 }}>
              {cta}
            </StyledText>
          </StyledText>
        </View>
      </TouchableHighlight>
    </StyledCard>
  );
};
