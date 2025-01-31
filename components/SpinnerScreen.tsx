import { Flex, Spinner } from '@chakra-ui/react'

const SpinnerScreen = () => {
    return (
        <Flex bg='brand.bg' h='90vh' w='100vw' justify='center' p={8} align='center'>
            <Spinner />
        </Flex>
    )
}

export default SpinnerScreen