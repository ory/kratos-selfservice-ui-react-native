import { Configuration, FrontendApi } from "@ory/client"
import axiosFactory from "axios"
import Constants from "expo-constants"
import { resilience } from "./axios"

const axios = axiosFactory.create()
resilience(axios) // Adds retry mechanism to axios

// canonicalize removes the trailing slash from URLs.
const canonicalize = (url: string = "") => url.replace(/\/+$/, "")

// This value comes from ../../app.config.js
export const kratosUrl = (project: string = "playground") => {
  const url = canonicalize(Constants.manifest?.extra?.kratosUrl) || ""

  if (url.indexOf("https://playground.projects.oryapis.com/") == -1) {
    // The URL is not from Ory, so let's just return it.
    return url
  }

  // We handle a special case where we allow the project to be changed
  // if you use an ory project.
  return url.replace("playground.", `${project}.`)
}

export const newOrySdk = (project: string) =>
  new FrontendApi(
    new Configuration({
      basePath: kratosUrl(project),
      baseOptions: {
        // Setting this is very important as axios will send the CSRF cookie otherwise
        // which causes problems with ORY Kratos' security detection.
        withCredentials: false,

        // Timeout after 5 seconds.
        timeout: 10000,
      },
    }),
    "",
    // Ensure that we are using the axios client with retry.
    axios,
  )
