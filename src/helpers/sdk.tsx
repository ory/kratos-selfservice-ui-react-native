import { Configuration, PublicApi } from '@oryd/kratos-client';

const url = process.env.EXPO_KRATOS_PUBLIC_URL || ''

console.log(url)

// canonicalize removes the trailing slash from URLs.
const canonicalize = (url: string = '') =>
  url.replace(/\/+$/, '');

// This exports the ORY Kratos SDK
export default new PublicApi(new Configuration({
  basePath: canonicalize(url),
}));
