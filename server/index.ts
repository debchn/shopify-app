import 'isomorphic-fetch';

import * as Koa from 'koa';
import * as session from 'koa-session';
import shopifyAuth, {verifyRequest} from '@shopify/koa-shopify-auth';
import graphQLProxy from '@shopify/koa-shopify-graphql-proxy';

import {ip, port} from '../config/server';
import {apiKey, secret, scopes, testShop} from '../config/app';
import renderApp from './render-app';

const app = new Koa();
app.keys = [secret];

app.use(session(app));

app.use(
  shopifyAuth({
    apiKey,
    secret,
    scopes,
    afterAuth(ctx) {
      ctx.redirect('/');
    },
  }),
);

app.use(graphQLProxy() as any);

const fallbackRoute = testShop === '' ? undefined : `/auth?shop=${testShop}`;
app.use(
  verifyRequest({
    fallbackRoute,
  }),
);

app.use(renderApp);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[init] listening on ${ip}:${port}`);
});

export default app;
