import { useEffect, useState } from 'react'
import '@r2u/javascript-ar-sdk'
import { ProductType } from '../types/Product'

declare global {
    interface Window {
        R2U: any;
    }
}

const Ar = () => {

    const { R2U } = window;
    const CUSTOMER_ID = '9755e2a9-379b-45d7-af75-30a5e7c5dabc';
    const SKU = 'HCA0032';
    const fallbackOptions = {
        alertMessage: 'AR não suportado por este dispotivo.',
        fallback: 'viewer'
    };

    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [isSdkInitialized, setIsSdkInitialized] = useState(false);
    const [isQrCodeInitialized, setIsQrCodeInitialized] = useState(false);
    const [isArAtached, setIsArAtached] = useState(false);
    const [productData, setProductData] = useState<ProductType>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSomethingWrong, setIsSomethingWrong] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeScreen(window.innerWidth >= 1024);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        const initR2U = async () => {
            let product: ProductType | undefined;
            try {
                await R2U.init({ customerId: CUSTOMER_ID });
                setIsSdkInitialized(true);
                product = await R2U.sku.getData(SKU);
                setProductData(product);
            } catch (error) {
                console.error('Error getting product data:', error);
                setIsSomethingWrong(true);
            }
            if (!SKU || !product || !product.isActive) {
                setIsSomethingWrong(true);
                return;
            };
            const viewerPosition = document.getElementById('r2u-viewer');
            await R2U.viewer.create({
                element: viewerPosition,
                popup: true,
                sku: SKU,
            });
        }
        initR2U();
    }, []);

    useEffect(() => {
        const initAr = async () => {
            if (!isSdkInitialized) return;
            if (isLargeScreen && !isQrCodeInitialized) {
                const node = document.getElementById('r2u-qrcode');
                await R2U.qrCode.create({
                    element: node,
                    sku: SKU
                });
                setIsQrCodeInitialized(true);
            } else if (!isLargeScreen && !isArAtached) {
                const arButton = document.getElementById('r2u-ar-button');
                await R2U.ar.attach({
                    element: arButton,
                    sku: SKU,
                    fallbackOptions: fallbackOptions,
                    showInstructions: 'once'
                });
                setIsArAtached(true);
            }
        }
        initAr();
    }, [isLargeScreen, isSdkInitialized]);

    const buttonStyle = ' w-48 lg:mr-2 buy-button mt-8 hover:border-blue-500 hover:bg-transparent border-transparent border-2 border-solid hover:text-blue-500 text-white font-bold text-lg rounded-full py-2 bg-blue-500 cursor-pointer';

    return (!isSomethingWrong ? (
        <main className="p-4 flex flex-col lg:flex-row items-center justify-center" >
            <div className='lg:hidden'>
                <h1 className="font-bold text-lg mb-2">{productData?.name}</h1>
                <h2 className="font-medium text-lg text-gray-700 mb-4">R$ 290,90</h2>
            </div>
            <aside id="r2u" className="r2u relative">
                <div id="modal"
                    className={`fixed top-0 right-0 m-4 py-8 bg-white border border-gray-300 p-4 shadow-lg z-50 flex flex-col items-center justify-center rounded-md w-fit transition-all duration-500 ${isModalOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                    <button onClick={() => {
                        setIsModalOpen(false);
                    }}
                        className="absolute top-4 right-5 text-gray-600 hover:text-gray-900 cursor-pointer">
                        X
                    </button>
                    <span className="block text-gray-600 mb-6 mx-6">
                        Escaneie este QR Code para<br />visualizar o produto na sua casa!
                    </span>
                    <div id="r2u-qrcode" className='w-40 h-40'></div>
                </div>
                <div id="r2u-viewer" className="mt-4"></div>
            </aside>
            <div className='h-fit'>
                <div className='hidden lg:block'>
                    <h1 className="font-bold text-lg mb-2">{productData?.name}</h1>
                    <h2 className="font-medium text-lg text-gray-700 mb-4">R$ 290,90</h2>
                </div>
                <div className='flex justify-center items-center flex-col lg:flex-row'>
                    <button
                        id='r2u-qr-button'
                        className={'hidden lg:block' + buttonStyle}
                        onClick={() => {
                            setIsModalOpen(true);
                        }}>
                        Acessar RA
                    </button>
                    <button
                        id='r2u-ar-button'
                        className={'lg:hidden' + buttonStyle}>
                        Acessar RA
                    </button>
                    <a href={productData?.pdpUrl} target='_blank' className="w-48  lg:ml-2 buy-button mt-8 border-blue-500 border-2 border-solid text-blue-500 hover:text-white font-bold text-lg rounded-full py-2 hover:bg-blue-500 cursor-pointer">
                        Comprar Agora
                    </a>
                </div>
            </div>
        </main >
    ) : (
        <main className="p-4 flex flex-col lg:flex-row items-center justify-center">
            <h1 className="font-bold text-lg mb-2">Produto não encontrado</h1>
            <h2 className="font-medium text-lg text-gray-700 mb-4">Por favor, tente novamente mais tarde.</h2>
        </main>
    ));
};

export default Ar