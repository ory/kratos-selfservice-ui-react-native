import React, { ReactNode } from "react"
import { ScrollView } from "react-native"
import { GridContainer } from "./Grid"

const Layout = ({ children }: { children: ReactNode }) => (
  <ScrollView>
    <GridContainer>{children}</GridContainer>
  </ScrollView>
)

export default Layout
