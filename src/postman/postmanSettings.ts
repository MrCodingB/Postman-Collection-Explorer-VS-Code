export interface RequestSettings {
  followOriginalHttpMethod?: boolean;
  followAuthorizationHeader?: boolean;
  maxRedirects?: number;
  tlsPreferServerCiphers?: boolean;
  disableCookies?: boolean;
  disableUrlEncoding?: boolean;
  removeRefererHeaderOnRedirect?: boolean;
  followRedirects?: boolean;
  strictSSL?: boolean;
  tlsDisabledProtocols?: string[];
  tlsCipherSelection?: string[];
}

export const REQUEST_SETTINGS: {
  key: keyof RequestSettings;
  title: string;
  description: string;
  type: 'number' | 'boolean' | 'array' | 'select';
  default: boolean | [] | number | 'settings';
  options?: string[];
}[] = [
  {
    key: 'strictSSL',
    title: 'Enable SSL certificate verification',
    description: 'Verify SSL certificates when sending a request. Verification failures will result in the request being aborted.',
    type: 'boolean',
    default: 'settings'
  },
  {
    key: 'followRedirects',
    title: 'Automatically follow redirects',
    description: 'Follow HTTP 3xx responses as redirects.',
    type: 'boolean',
    default: 'settings'
  },
  {
    key: 'followOriginalHttpMethod',
    title: 'Follow original HTTP Method',
    description: 'Redirect with the original HTTP method instead of the default behavior of redirecting with GET.',
    type: 'boolean',
    default: false
  },
  {
    key: 'followAuthorizationHeader',
    title: 'Follow Authorization header',
    description: 'Retain authorization header when a redirect happens to a different hostname.',
    type: 'boolean',
    default: false
  },
  {
    key: 'removeRefererHeaderOnRedirect',
    title: 'Remove referer header on redirect',
    description: 'Remove the referer header when a redirect happens.',
    type: 'boolean',
    default: false
  },
  {
    key: 'disableUrlEncoding',
    title: 'Disable URL encoding',
    description: 'Disabled encoding the URL\'s path, query parameters, and authentication fields.',
    type: 'boolean',
    default: false
  },
  {
    key: 'disableCookies',
    title: 'Disable cookie jar',
    description: 'Prevent cookies used in this request from being stored in the cookie jar. Existing cookies in the cookie jar will not be added as headers for this request.',
    type: 'boolean',
    default: false
  },
  {
    key: 'tlsPreferServerCiphers',
    title: 'Use server cipher suite during handshake',
    description: 'Use the server\'s cipher suite order instead of the client\'s during handshake.',
    type: 'boolean',
    default: false
  },
  {
    key: 'maxRedirects',
    title: 'Maximum number of redirects',
    description: 'Set a cap on the maximum number of redirects to follow.',
    type: 'number',
    default: 10
  },
  {
    key: 'tlsDisabledProtocols',
    title: 'Protocols disabled during handshake',
    description: 'Specify the SSL and TLS protocol versions to be disabled during handshake. All other protocols will be enabled.',
    type: 'select',
    options: [ 'SSL v2', 'SSL v3', 'TLS v1', 'TLS v1.1', 'TLS v1.2' ],
    default: []
  },
  {
    key: 'tlsCipherSelection',
    title: 'Cipher suite selection',
    description: 'Order of cipher suites that the SSL server profile uses to establish a secure connection.',
    type: 'array',
    default: []
  }
];
