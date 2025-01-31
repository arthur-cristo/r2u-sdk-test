import { Box, Flex, Heading, HStack, Spinner, Text, useBoolean } from '@chakra-ui/react'
import './App.css'
import { useEffect, useRef, useState } from 'react'
import '@r2u/javascript-ar-sdk'
import { ProductType } from '../types/Product'
import CustomButton from '../components/CustomButton'

declare global {
  interface Window {
    R2U: any;
  }
}

function App() {

  const { R2U } = window;
  const CUSTOMER_ID = '9755e2a9-379b-45d7-af75-30a5e7c5dabc';
  const SKU = 'HCA0032';
  const fallbackOptions = {
    alertMessage: 'AR não suportado por este dispotivo.',
    fallback: 'viewer'
  };
  const product = {
    color: 'Preta',
    prices: [325.90, 199.91],
  }

  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const [isSdkInitialized, setIsSdkInitialized] = useBoolean();
  const [isQrCodeInitialized, setIsQrCodeInitialized] = useBoolean();
  const [isArAttached, setIsArAttached] = useBoolean();
  const [productData, setProductData] = useState<ProductType | null>(null);
  const [isSomethingWrong, setIsSomethingWrong] = useBoolean();
  const [isModalOpen, setIsModalOpen] = useBoolean();

  const arButtonRef = useRef<HTMLButtonElement | null>(null);
  const qrCodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkScreenSize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize); // Cleanup event listener
  }, []);

  useEffect(() => {
    if (!R2U) return;

    const initR2U = async () => {
      try {
        await R2U.init({ customerId: CUSTOMER_ID });
        setIsSdkInitialized.on();

        const product = await R2U.sku.getData(SKU);
        if (!product?.isActive) throw new Error('Product not active');

        setProductData(product);

        const viewerPosition = document.getElementById('r2u-viewer');
        if (viewerPosition) {
          await R2U.viewer.create({
            element: viewerPosition,
            popup: true,
            sku: SKU
          });
        }
      } catch (error) {
        console.error('Error getting product data:', error);
        setIsSomethingWrong.on();
      }
    };

    initR2U();
  }, [R2U]);

  useEffect(() => {
    if (!isSdkInitialized) return;

    const initAr = async () => {
      try {
        if (isLargeScreen && !isQrCodeInitialized) {
          if (qrCodeRef.current) {
            await R2U.qrCode.create({ element: qrCodeRef.current, sku: SKU });
            setIsQrCodeInitialized.on();
          }
        } else if (!isLargeScreen && !isArAttached) {
          if (arButtonRef.current) {
            await R2U.ar.attach({
              element: arButtonRef.current,
              sku: SKU,
              fallbackOptions,
              showInstructions: 'once'
            });
            setIsArAttached.on();
          }
        }
      } catch (error) {
        console.error('Error initializing AR/QR:', error);
      }
    };

    initAr();
  }, [isLargeScreen, isSdkInitialized, qrCodeRef.current, arButtonRef.current]);

  if (!productData) return (
    <Flex bg='brand.bg' h='90vh' w='100vw' justify='center' p={8} align='center'>
      <Spinner />
    </Flex>
  );
  return (!isSomethingWrong ? (
    <Flex bg='brand.bg' h={{ md: '90vh' }} w='100vw' justify='center' p={8} align='center' gap={8} direction={{ base: 'column-reverse', md: 'row' }}>
      <Box id="modal"
        className={`fixed top-0 right-0 m-4 py-8 bg-white border border-gray-300 p-4 shadow-lg z-50 flex flex-col items-center justify-center rounded-md w-fit transition-all duration-500 ${isModalOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <button onClick={setIsModalOpen.off}
          className="absolute top-4 right-5 text-gray-600 hover:text-gray-900 cursor-pointer">
          X
        </button>
        <Text m={6} mt={0}>
          Escaneie este QR Code para<br />visualizar o produto na sua casa!
        </Text>
        <Box ref={qrCodeRef} w='10rem' h='10rem' />
      </Box>
      <Box id='r2u-viewer' h={{ base: '40vh', md: '60vh' }} w={{ base: 'full', md: '40%' }} />
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
    </Flex>
  ) : (
    <Flex bg='brand.bg' w='100vw' h='90vh' justify='center' align='center' gap={4} direction='column'>
      <Heading color='brand.light'>Produto não encontrado.</Heading>
      <Text as='h2' fontSize='xl' color='brand.dark'>Por favor, tente novamente mais tarde.</Text>
    </Flex>
  ))
}

export default App
