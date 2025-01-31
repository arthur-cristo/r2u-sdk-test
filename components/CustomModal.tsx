import { Box, Text } from '@chakra-ui/react';
import React from 'react'

interface CustomModalProps {
    children: React.ReactNode;
    isModalOpen: boolean;
    title: string;
    close: {
        on: () => void;
        off: () => void;
        toggle: () => void;
    };
    maxW: string;
}

const CustomModal = ({ children, close, isModalOpen, title, maxW }: CustomModalProps) => {
    return (
        <Box id="modal" maxW={maxW} m={4} py={8} bg='white' border='1px' borderColor='gray.300' boxShadow='lg' zIndex={50} position='fixed' top={0} right={0} display='flex' flexDirection='column' alignItems='center' justifyContent='center' borderRadius='md' width='fit-content' transition='all 500ms' opacity={isModalOpen ? 1 : 0} transform={isModalOpen ? 'scale(1)' : 'scale(0.95)'} pointerEvents={isModalOpen ? 'auto' : 'none'}>
            <button onClick={close.off}
                className="absolute top-4 right-5 text-gray-600 hover:text-gray-900 cursor-pointer">
                X
            </button>
            <Text m={6} mt={0}>
                {title}
            </Text>
            {children}
        </Box>
    )
}

export default CustomModal