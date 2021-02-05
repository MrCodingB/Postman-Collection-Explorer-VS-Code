export const METHODS = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  patch: 'PATCH',
  delete: 'DELETE',
  copy: 'COPY',
  head: 'HEAD',
  options: 'OPTIONS',
  link: 'LINK',
  unlink: 'UNLINK',
  purge: 'PURGE',
  lock: 'LOCK',
  unlock: 'UNLOCK',
  propfind: 'PROPFIND',
  view: 'VIEW'
};

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'COPY' | 'HEAD' | 'OPTIONS' | 'LINK' | 'UNLINK' | 'PURGE' | 'LOCK' | 'UNLOCK' | 'PROPFIND' | 'VIEW';
