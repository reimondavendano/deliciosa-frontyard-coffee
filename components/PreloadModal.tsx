'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function PreloadModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show modal on mount
        setIsOpen(true);
    }, []);

    const handleOrderClick = () => {
        const foodpandaUrl = 'https://www.foodpanda.ph/restaurant/f1xu/deliciosa-purok-3';

        // Check if mobile to potentially trigger app intent better
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            // On mobile, navigating directly often triggers the app better than opening a new tab
            window.location.href = foodpandaUrl;
        } else {
            window.open(foodpandaUrl, '_blank');
        }

        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="w-[95%] rounded-xl p-4 sm:p-6 md:p-10 sm:max-w-lg md:max-w-4xl bg-white">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl md:text-4xl font-bold text-primary">Deliciosa Delivery</DialogTitle>
                    <DialogDescription className="text-center text-sm md:text-xl text-muted-foreground">
                        Craving something delicious? We deliver straight to your door!
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center py-2 md:py-4">
                    <div className="relative h-40 sm:h-56 md:h-[500px] w-full">
                        <Image
                            src="/images/deliciosa-coffee/preload-foodpanda.png"
                            alt="Foodpanda Delivery"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>
                <DialogFooter className="sm:justify-center w-full">
                    <Button
                        onClick={handleOrderClick}
                        className="w-full bg-[#D70F64] hover:bg-[#b00c52] text-white font-bold py-3 md:py-8 text-base md:text-2xl shadow-lg transition-transform hover:scale-105"
                    >
                        Order Now on Foodpanda!
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
