"use client";
import { createDiscount } from "@/app/admin/controllers/discount";
import { getGoodiesWithoutDiscount } from "@/app/admin/controllers/goodie";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { IGoodie } from "@/app/admin/lib/interfaces";
import Spinner from "./spinner";

interface AddDiscountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onFailure: () => void;

}


const GoodieCard = ({ goodie, isSelected, onSelect }: { goodie: IGoodie, isSelected: boolean, onSelect: (id: string) => void }) => (
    <div
        className={`border rounded-lg p-4 cursor-pointer transition-all ${isSelected ? 'border-teal-500 bg-teal-100' : 'border-gray-300 hover:border-teal-300'
            }`}
        onClick={() => onSelect(goodie._id)}
    >
        <img src={goodie.mainImage.url} alt={goodie.name} className="w-full h-32 object-cover rounded-md mb-2" />
        <h3 className="text-sm font-semibold text-center">{goodie.name}</h3>
    </div>
);

const AddDiscountModal = ({ isOpen, onClose, onSuccess, onFailure }: AddDiscountModalProps) => {

    const [goodies, setGoodies] = useState<IGoodie[] | null>(null);

    const [selectedGoodies, setSelectedGoodies] = useState<string[]>([]);


    const DiscountForm = z.object({
        code: z.string()
            .min(1, { message: "Le code du coupon est requis." })
            .max(20, { message: "Le code du coupon ne peut pas dépasser 20 caractères." })
            .regex(/^[A-Z0-9]+$/, { message: "Le code doit contenir uniquement des lettres majuscules et des chiffres." }),
        percent: z.number()
            .min(1, { message: "Le pourcentage doit être supérieur à 0." }),
        limit: z.number()
            .int({ message: "La limite doit être un nombre entier." })
            .min(1, { message: "Entrez une limite valide." }),
        goodies: z.array(
            z.string()
        )
    });
    const router = useRouter()

    type DiscountFormData = z.infer<typeof DiscountForm>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<DiscountFormData>({
        resolver: zodResolver(DiscountForm),
    });

    const onSubmit = async (data: DiscountFormData) => {
        console.log("data", data);

        if (selectedGoodies.length >= 1) {

            try {
                const response = await createDiscount(data);
                if (response.status == 200) {
                    onSuccess()
                }

            } catch (error) {

                onFailure()

                toast.error("An error occurred while adding the goodie. , Please Check if a discount is already associated with one of the selected goodies");


            } finally {
                router.push("/admin/dashboard/discount");

                // onClose()
            }

            // Vous pouvez ajouter la logique pour envoyer les données au backend ici.

        } else {
            console.log('Please select at least one ')
            toast.error("Please select at least one goodie.");

        }


    };

    useEffect(() => {

        const fetchData = async () => {

            const { goodies } = await getGoodiesWithoutDiscount();
            console.log("Fetched goodies", goodies);
            setGoodies(goodies);
        }

        fetchData()


    }, [])



    const handleGoodieSelection = (goodieId: string) => {
        setSelectedGoodies(prev => {
            const newSelection = prev.includes(goodieId)
                ? prev.filter(id => id !== goodieId)
                : [...prev, goodieId];
            setValue("goodies", newSelection)
            return newSelection;
        });
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
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h3 className="text-lg font-semibold mb-2">Select the goodie</h3>
                            {/* <input
                                {...register("limit", { valueAsNumber: true })} // Conversion automatique en nombre
                                type="number"
                                min={1}
                                className="w-full p-3 rounded-xl border border-black/10"
                            />
                            {errors.limit && <span className="text-red-600">{errors.limit.message}</span>} */}

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {goodies ? (<>

                                    {goodies.map((goodie) => (
                                        <GoodieCard
                                            key={goodie._id}
                                            goodie={goodie}
                                            isSelected={selectedGoodies.includes(goodie._id)}
                                            onSelect={handleGoodieSelection}
                                        />
                                    ))}

                                </>) : (

                                    <div>
                                        <Spinner size={100} thickness={10} color={"#220f0055"} />
                                    </div>

                                )}

                            </div>

                            {errors.goodies && <span className="text-red-600">Select at least one goodie</span>}


                        </div>
                        <button type="submit" className="p-3 text-white bg-orange-700 rounded-xl">Create Discount</button>
                    </form>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
};

export default AddDiscountModal;
