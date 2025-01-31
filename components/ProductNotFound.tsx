import { Flex, Heading, Text } from '@chakra-ui/react'

const ProductNotFound = () => {
  return (
    <Flex bg='brand.bg' w='100vw' h='90vh' justify='center' align='center' gap={4} direction='column'>
      <Heading color='brand.light'>Produto não encontrado.</Heading>
      <Text as='h2' fontSize='xl' color='brand.dark'>Por favor, tente novamente mais tarde.</Text>
    </Flex>
  )
}

export default ProductNotFound