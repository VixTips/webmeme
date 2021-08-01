import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import theme from '../theme'
import {Provider, createClient, dedupExchange, fetchExchange} from 'urql'
import { authExchange } from '@urql/exchange-auth';
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache';
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql';


function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
)
{
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

 const client = createClient(
   {
     url: "http://127.0.0.1:4000/graphql",
     fetchOptions: {credentials: "include"},
      exchanges: [
        dedupExchange,
        cacheExchange( {
            updates: {
              Mutation: {
                Login: (result, args, cache, info) =>
                {
                  cache.updateQuery({query: MeDocument}, (data) =>
                    {
                      const r = result as LoginMutation;
                      const d = data as MeQuery;

                      if (r.Login.errors)
                      {
                        return data as any;
                      }
                      else
                      {
                        return {Me: r.Login.user};
                      }
                    }
                  );
                },
                Register: (result, args, cache, info) =>
                {
                  cache.updateQuery({query: MeDocument}, (data) =>
                    {
                      const r = result as RegisterMutation;
                      const d = data as MeQuery;

                      if (r.Register.errors)
                      {
                        return data as any;
                      }
                      else
                      {
                        return {Me: r.Register.user};
                      }
                    }
                  );
                },
                Logout: (result, args, cache, info) =>
                {
                  cache.updateQuery({query: MeDocument}, (data) =>
                    {
                      //clear the cache
                      return {Me: null} as any;
                    }
                  );
                },
              }
            }
          }
        ),
        fetchExchange
        ] 
    }
);


function MyApp({ Component, pageProps }: any) {
  return (

    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
