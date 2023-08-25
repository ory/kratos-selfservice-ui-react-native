// This file defines a React Context which keeps track of the authenticated session.

import { FrontendApi } from "@ory/client"
import React, {
  createContext,
  PropsWithChildren,
  useMemo,
  useState,
} from "react"
import { newOrySdk } from "../helpers/sdk"

interface Context {
  project: string
  setProject: (project: string) => void
  sdk: FrontendApi
}

export const ProjectContext = createContext<Context>({
  setProject: () => {},
  project: "playground",
  sdk: newOrySdk("playground"),
})

export default function ProjectContextProvider({
  children,
}: PropsWithChildren<unknown>) {
  const [project, setProject] = useState("playground")
  const sdk = useMemo(() => {
    return newOrySdk(project)
  }, [project])

  return (
    <ProjectContext.Provider
      value={{
        // Helpers to set the global Ory Project for this app.
        project,
        setProject,
        sdk,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}
