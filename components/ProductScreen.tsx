import { Flex, Box, useBoolean } from '@chakra-ui/react'
import React from 'react'
import CustomModal from './CustomModal'
import ProductBox from './ProductBox'
import { ProductType } from '../types/Product';

interface ProductScreenProps {
    productData: ProductType;
    isLargeScreen: boolean;
    SKU: string;
    product: {
        color: string;
        prices: number[];
    };
    arButtonRef: React.RefObject<HTMLButtonElement>;
    qrCodeRef: React.RefObject<HTMLDivElement>;
}

const ProductScreen = ({ productData, SKU, product, isLargeScreen, arButtonRef, qrCodeRef }: ProductScreenProps) => {
    const [isModalOpen, setIsModalOpen] = useBoolean();
    return (
        <Flex bg='brand.bg' h={{ md: '90vh' }} w='100vw' justify='center' p={8} align='center' gap={8} direction={{ base: 'column-reverse', md: 'row' }}>
            <CustomModal isModalOpen={isModalOpen} close={setIsModalOpen} title={'Escaneie este QR Code para visualizar o produto na sua casa!'} maxW='20rem' >
                <Box ref={qrCodeRef} w='10rem' h='10rem' />
            </CustomModal>
            <Box id='r2u-viewer' h={{ base: '40vh', md: '60vh' }} w={{ base: 'full', md: '40%' }} />
            <ProductBox
                productData={productData}
                SKU={SKU}
                product={product}
                setIsModalOpen={setIsModalOpen}
                isLargeScreen={isLargeScreen}
                arButtonRef={arButtonRef}
            />
        </Flex>
    )
}

export default ProductScreen