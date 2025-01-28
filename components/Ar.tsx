import { useEffect } from 'react'
import '@r2u/javascript-ar-sdk'
import React from 'react';

declare global {
    interface Window {
        R2U: any;
    }
}

const Ar = () => {

    const { R2U } = window;
    const CUSTOMER_ID = '9755e2a9-379b-45d7-af75-30a5e7c5dabc';
    const SKU = 'HCA0032';

    useEffect(() => {
        const initR2U = async () => {
            await R2U.init({ customerId: CUSTOMER_ID });
            const IS_ACTIVE = await R2U.sku.isActive(SKU);
            if (!SKU || !IS_ACTIVE) {
                document.getElementById('r2u-ar-button')?.remove();
                return;
            };
            const viewerPosition = document.getElementById('r2u-viewer');
            await R2U.viewer.create({
                element: viewerPosition,
                popup: true,
                sku: SKU,
            });
            const node = document.getElementById('r2u-qrcode');
            await R2U.qrCode.create({
                element: node,
                sku: SKU
            });
            document.getElementById('r2u-ar-button')?.addEventListener('click', () => {
                console.log("click")
                const modal = document.getElementById('modal')
                if (modal) modal.hidden = !modal.hidden
            });
        }
        initR2U();
    }, []);

    return (
        <main className="p-4">
            <h1 className="font-bold text-lg mb-2">Pia Moderna</h1>
            <h2 className="font-medium text-lg text-gray-700 mb-4">R$ 290,90</h2>

            <div id="r2u" className="r2u relative">
                <div className="modal">
                    <div
                        id="modal"
                        hidden
                        className="w-fit fixed top-0 right-0 m-4 py-8 bg-white border border-gray-300 p-4 rounded shadow-lg z-50 flex flex-col items-center justify-center"
                    >
                        <button
                            onClick={() => {
                                const modal = document.getElementById("modal");
                                if (modal) modal.hidden = true;
                            }}
                            className="absolute top-4 right-5 text-gray-600 hover:text-gray-900 cursor-pointer"
                        >
                            X
                        </button>
                        <span className="block text-gray-600 mb-6 mx-6">
                            Escaneie este QR Code para visualizar o produto na sua casa!
                        </span>
                        <div id="r2u-qrcode" className='w-40 h-40'></div>
                    </div>
                </div>
                <div id="r2u-viewer" className="mt-4"></div>
            </div>
            <button id='r2u-ar-button' className="mr-2 buy-button mt-8 hover:border-blue-500 hover:bg-transparent border-transparent border-2 border-solid hover:text-blue-500 text-white font-bold text-lg rounded-full py-2 px-6 bg-blue-500 cursor-pointer">
                Ver em AR
            </button>
            <button className="ml-2 buy-button mt-8 border-blue-500 border-2 border-solid text-blue-500 hover:text-white font-bold text-lg rounded-full py-2 px-6 hover:bg-blue-500 cursor-pointer">
                Comprar Agora
            </button>
        </main>
    );
};

export default Ar