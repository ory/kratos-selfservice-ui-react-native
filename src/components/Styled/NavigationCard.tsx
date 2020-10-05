import React, { useContext } from 'react';
import { TouchableHighlight, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';

import StyledCard from './StyledCard';
import StyledText from './StyledText';

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
