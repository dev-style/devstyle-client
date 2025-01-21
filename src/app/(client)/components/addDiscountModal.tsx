"use client";
import { createDiscount } from "@/app/admin/controllers/discount";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

interface AddDiscountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddDiscountModal = ({ isOpen, onClose, onSuccess }: AddDiscountModalProps) => {
    const DiscountForm = z.object({
        code: z.string()
            .min(1, { message: "Le code du coupon est requis." })
            .max(20, { message: "Le code du coupon ne peut pas dépasser 20 caractères." })
            .regex(/^[A-Z0-9]+$/, { message: "Le code doit contenir uniquement des lettres majuscules et des chiffres." }),
        percent: z.number()
            .min(1, { message: "Le pourcentage doit être supérieur à 0." }),
        limit: z.number()
            .int({ message: "La limite doit être un nombre entier." })
            .min(1, { message: "Entrez une limite valide." })
    });
    const router = useRouter()

    type DiscountFormData = z.infer<typeof DiscountForm>;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<DiscountFormData>({
        resolver: zodResolver(DiscountForm),
    });

    const onSubmit = async (data: DiscountFormData) => {
        console.log("data", data);

        try {
            const response = await createDiscount(data);
            if (response.status == 200) {
                onSuccess()
            }

        } catch (error) {

            toast.error("An error occurred while adding the goodie.");


        } finally {
            router.push("/admin/dashboard/discount");

            // onClose()
        }

        // Vous pouvez ajouter la logique pour envoyer les données au backend ici.
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle className="flex justify-between items-center border-b border-[#220f00]/10 pb-4">
                <span className="text-2xl font-bold text-[#220f00]">Create a new Discount</span>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="h-6 w-6 text-gray-500" />
                </button>
            </DialogTitle>
            <DialogContent className="mt-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                            <h3 className="text-lg font-semibold text-orange-700 mb-2">Enter a Discount code</h3>
                            <input
                                {...register("code")}
                                type="text"
                                className="w-full p-3 rounded-xl border border-orange-800"
                            />
                            {errors.code && <span className="text-red-600">{errors.code.message}</span>}
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                            <h3 className="text-lg font-semibold text-orange-700 mb-2">Enter reduction percentage (%)</h3>
                            <input
                                {...register("percent", { valueAsNumber: true })} // Conversion automatique en nombre
                                type="number"
                                min={1}
                                className="w-full p-3 rounded-xl border border-orange-800"
                            />
                            {errors.percent && <span className="text-red-600">{errors.percent.message}</span>}
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h3 className="text-lg font-semibold mb-2">Limit of usage</h3>
                            <input
                                {...register("limit", { valueAsNumber: true })} // Conversion automatique en nombre
                                type="number"
                                min={1}
                                className="w-full p-3 rounded-xl border border-black/10"
                            />
                            {errors.limit && <span className="text-red-600">{errors.limit.message}</span>}
                        </div>
                        <button type="submit" className="p-3 text-white bg-orange-700 rounded-xl">Create Discount</button>
                    </form>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
};

export default AddDiscountModal;
