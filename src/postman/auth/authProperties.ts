/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { AuthBooleanVar } from './authBooleanVar';
import { AuthProperty } from './authProperty';
import { AuthStringVar } from './authStringVar';

const apikeyAuthVariables = () => ({
  in: new AuthStringVar('Add to', false, ['header', 'query']),
  value: new AuthStringVar('Value'),
  key: new AuthStringVar('Key')
});

const awsv4AuthVariables = () => ({
  addAuthDataToQuery: new AuthBooleanVar('Add authorization data to query?'),
  accessKey: new AuthStringVar('Access key'),
  secretKey: new AuthStringVar('Secret Key'),
  region: new AuthStringVar('AWS region', true),
  service: new AuthStringVar('Service name', true),
  sessionToken: new AuthStringVar('Session token', true)
});

const basicAuthVariables = () => ({
  username: new AuthStringVar('Username'),
  password: new AuthStringVar('Password')
});

const bearerAuthVariables = () => ({
  token: new AuthStringVar('Token')
});

const digestAuthVariables = () => ({
  disableRetryRequest: new AuthBooleanVar('Disable retrying the request?'),
  username: new AuthStringVar('Username'),
  password: new AuthStringVar('Password'),
  realm: new AuthStringVar('Realm', true),
  nonce: new AuthStringVar('Nonce', true),
  algorithm: new AuthStringVar('Algorithm', true, ['MD5', 'MD5-sess', 'SHA-256', 'SHA-256-sess', 'SHA-512-256', 'SHA-512-256-sess']),
  qop: new AuthStringVar('qop', true),
  nonceCount: new AuthStringVar('Nonce count', true),
  clientNonce: new AuthStringVar('Client nonce', true),
  opaque: new AuthStringVar('Opaque', true)
});

const edgegridAuthVariables = () => ({
  accessToken: new AuthStringVar('Access token'),
  clientToken: new AuthStringVar('Client token'),
  clientSecret: new AuthStringVar('Client secret'),
  nonce: new AuthStringVar('Nonce', true),
  timestamp: new AuthStringVar('Timestamp (yyyyMMddTHH:mm:ss+0000)', true),
  baseURL: new AuthStringVar('Base URL', true),
  headersToSign: new AuthStringVar('Headers to sign (comma-seperated)', true)
});

const hawkAuthVariables = () => ({
  includePayloadHash: new AuthBooleanVar('Include payload hash?'),
  authId: new AuthStringVar('Hawk auth id'),
  authKey: new AuthStringVar('Hawk auth key'),
  algorithm: new AuthStringVar('Algorithm', false, ['sha1', 'sha256']),
  user: new AuthStringVar('User'),
  nonce: new AuthStringVar('Nonce'),
  extraData: new AuthStringVar('Extra data'),
  app: new AuthStringVar('App'),
  delegation: new AuthStringVar('Delegation'),
  timestamp: new AuthStringVar('Timestamp (yyyyMMddTHH:mm:ss+0000)')
});

const ntlmAuthVariables = () => ({
  disableRetryRequest: new AuthBooleanVar('Disable retrying the request?'),
  username: new AuthStringVar('Username'),
  password: new AuthStringVar('Password'),
  domain: new AuthStringVar('Domain', true),
  workstation: new AuthStringVar('Workstation', true)
});

const oAuth1AuthVariables = () => ({
  addParamsToHeader: new AuthBooleanVar('Add parameters to header?'),
  includeBodyHash: new AuthBooleanVar('Include body hash?'),
  addEmptyParamsToSign: new AuthBooleanVar('Add emptry parameters to signature?'),
  disableHeaderEncoding: new AuthBooleanVar('Disable header encoding?'),
  signatureMethod: new AuthStringVar('Signature Method', false, ['HMAC-SHA1', 'HMAC-SHA256', 'HMAC-SHA512', 'RSA-SHA1', 'RSA-SHA256', 'RSA-SHA512', 'PLAINTEXT']),
  consumerKey: new AuthStringVar('Consumer key'),
  consumerSecret: new AuthStringVar('Consumer secret'),
  token: new AuthStringVar('Access token'),
  tokenSecret: new AuthStringVar('Token secret'),
  callback: new AuthStringVar('Callback URL', true),
  verifier: new AuthStringVar('Verifier', true),
  timestamp: new AuthStringVar('Timestamp (yyyyMMddTHH:mm:ss+0000)', true),
  nonce: new AuthStringVar('Nonce', true),
  version: new AuthStringVar('Version', true),
  realm: new AuthStringVar('Realm', true)
});

const oAuth2AuthVariables = () => ({
  accessToken: new AuthStringVar('Access token'),
  addTokenTo: new AuthStringVar('Add authorization data to', false, ['header', 'query']),
  headerPrefix: new AuthStringVar('Header prefix', true)
});

export class AuthProperties {
  apikey = new AuthProperty(apikeyAuthVariables());
  awsv4 = new AuthProperty(awsv4AuthVariables());
  basic = new AuthProperty(basicAuthVariables());
  bearer = new AuthProperty(bearerAuthVariables());
  digest = new AuthProperty(digestAuthVariables());
  edgegrid = new AuthProperty(edgegridAuthVariables());
  hawk = new AuthProperty(hawkAuthVariables());
  noauth = new AuthProperty({});
  ntlm = new AuthProperty(ntlmAuthVariables());
  oauth1 = new AuthProperty(oAuth1AuthVariables());
  oauth2 = new AuthProperty(oAuth2AuthVariables());
}
