import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import TacoLayout from '../src/components/TacoLayout'
import '../styles/globals.scss'
import { theme } from '../src/theme/theme'
function MyApp({ Component, pageProps }: AppProps) {

  return (
    <ChakraProvider theme={theme}>
     { <TacoLayout>
        <Component {...pageProps} />
      </TacoLayout>}
    </ChakraProvider>
  )


}

export default MyApp