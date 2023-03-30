import React, { Component, ErrorInfo } from "react"
import { Text } from "react-native"

interface Props {}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state = {
    hasError: false,
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <Text>Something went wrong.</Text>
    }

    return this.props.children
  }
}
