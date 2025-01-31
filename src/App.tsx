import { useBoolean } from '@chakra-ui/react'
import './App.css'
import { useEffect, useRef, useState } from 'react'
import '@r2u/javascript-ar-sdk'
import { ProductType } from '../types/Product'
import SpinnerScreen from '../components/SpinnerScreen'
import ProductNotFound from '../components/ProductNotFound'
import ProductScreen from '../components/ProductScreen'

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

  if (!productData) return <SpinnerScreen />;
  return (!isSomethingWrong ?
    <ProductScreen
      productData={productData}
      SKU={SKU}
      product={product}
      isLargeScreen={isLargeScreen}
      arButtonRef={arButtonRef}
      qrCodeRef={qrCodeRef} />
    : <ProductNotFound />)
}

export default App
