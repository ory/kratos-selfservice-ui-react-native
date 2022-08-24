// This file defines a React Context which keeps track of the authenticated session.

import React, { createContext, ReactNode, useState } from 'react'

interface Context {
  project: string
  setProject: (project: string) => void
}

export const ProjectContext = createContext<Context>({
  setProject: () => {},
  project: 'playground'
})

interface Props {
  children: ReactNode
}

export default ({ children }: Props) => {
  const [project, setProject] = useState('playground')

  return (
    <ProjectContext.Provider
      value={{
        // Helpers to set the global Ory Project for this app.
        project,
        setProject: (project: string) => {
          setProject(project)
        }
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}
