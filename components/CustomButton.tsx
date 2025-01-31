import { Button, Link } from '@chakra-ui/react';
import React, { forwardRef } from 'react';

interface CustomButtonProps {
    onClick?: () => void;
    link?: string;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary';
    children?: React.ReactNode;
    hidden?: boolean;
}

const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
    ({ onClick, link, type = 'button', variant = 'primary', children, hidden }, ref) => {
        const bgColor = variant === 'primary' ? 'brand.light' : 'brand.dark';
        const hoverColor = variant === 'primary' ? 'brand.dark' : 'brand.light';

        if (hidden) return null;

        return link ? (
            <Link href={link} isExternal>
                <Button type={type} bg={bgColor} color='white' _hover={{ bg: hoverColor }} _active={{ bg: bgColor }}>
                    {children}
                </Button>
            </Link>
        ) : (
            <Button ref={ref} onClick={onClick} type={type} bg={bgColor} color='white' _hover={{ bg: hoverColor }} _active={{ bg: bgColor }}>
                {children}
            </Button>
        );
    }
);

export default CustomButton;
