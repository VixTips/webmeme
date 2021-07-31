import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import theme from '../theme'
import {Provider, createClient, dedupExchange, cacheExchange, fetchExchange} from 'urql'
import { authExchange } from '@urql/exchange-auth';

 const client = createClient(
   {
     url: "http://127.0.0.1:4000/graphql",
     fetchOptions: {credentials: "include"}
    });


function MyApp({ Component, pageProps }) {
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
