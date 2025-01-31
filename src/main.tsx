import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const colors = {
  brand: {
    dark: '#003B5C',
    light: '#109EEE',
    bg: '#E8F0F2',
  },
}

const theme = extendTheme({ colors });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </StrictMode>,
)
