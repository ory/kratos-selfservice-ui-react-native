import { Configuration, PublicApi } from '@oryd/kratos-client';
import Constants from 'expo-constants';

console.log( Constants)

const url = Constants.manifest?.extra?.kratosUrl || '';

// canonicalize removes the trailing slash from URLs.
const canonicalize = (url: string = '') => url.replace(/\/+$/, '/');

// This exports the ORY Kratos SDK
export default new PublicApi(
  new Configuration({
    basePath: canonicalize(url),
  })
);
