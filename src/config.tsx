import {PublicApi} from "@oryd/kratos-client";

// canonicalize removes the trailing slash from URLs.
const canonicalize = (url: string = '') =>
  url.replace(/\/+$/, '')

export const kratos = new PublicApi(
  canonicalize(process.env.KRATOS_PUBLIC_URL
    || 'http://127.0.0.1:4433'))

//