import React, { ReactNode } from 'react'
import { GridContainer } from '../Styled/Grid'

import { SafeAreaView, ScrollView } from 'react-native'
import ForkMe from '../Styled/ForkMe'

const Layout = ({ children }: { children: ReactNode }) => (
  <ScrollView>
    <GridContainer>{children}</GridContainer>
  </ScrollView>
)

export default Layout
