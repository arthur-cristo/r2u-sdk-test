import { Box, Heading, Flex, HStack, Text } from '@chakra-ui/react'
import React from 'react'
import CustomButton from './CustomButton'
import { ProductType } from '../types/Product'

interface ProductBoxProps {
    productData: ProductType;
    isLargeScreen: boolean;
    SKU: string;
    product: {
        color: string;
        prices: number[];
    };
    arButtonRef: React.RefObject<HTMLButtonElement>;
    setIsModalOpen: {
        on: () => void;
        off: () => void;
        toggle: () => void;
    }
}

const ProductBox = ({ productData, SKU, product, setIsModalOpen, isLargeScreen, arButtonRef }: ProductBoxProps) => {
    return (
        <Box w={{ base: 'full', md: '40%' }} >
            <Heading as='h3' size='md' mb='1rem' color='brand.dark' textAlign='start'>{productData.name}</Heading>
            <Flex justify='space-between' mb='1rem' align='center'>
                <Text>Cor: {product.color} • SKU: {SKU}</Text>
            </Flex>
            <HStack>
                <Text textDecor='line-through'>R$ {product.prices[0].toFixed(2)}</Text>
                <Heading as='h2' size='lg' color='brand.dark' textAlign='start'>R$ {product.prices[1].toFixed(2)}</Heading>
                <Text>no pix ou boleto</Text>
            </HStack>
            <HStack mt='1rem' w='100%'>
                <CustomButton onClick={setIsModalOpen.on} hidden={!isLargeScreen} variant='secondary' >Ver em RA</CustomButton>
                <CustomButton ref={arButtonRef} hidden={isLargeScreen} variant='secondary'>Ver em RA</CustomButton>
                <CustomButton link={productData.pdpUrl} variant='primary'>Comprar Agora</CustomButton>
            </HStack>
        </Box>
    )
}

export default ProductBox