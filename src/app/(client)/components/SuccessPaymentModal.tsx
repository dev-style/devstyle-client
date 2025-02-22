"use client"
import { Dialog, DialogContent, DialogTitle } from "@mui/material"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import Link from "next/link"

interface SuccessPaymentModalProps {
    isOpen: boolean

}

const SuccessPaymentModal = ({ isOpen }: SuccessPaymentModalProps) => {
    return (
        <Dialog
            open={isOpen}
            maxWidth="xs"
            fullWidth
        >

            <DialogContent className="mt-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="space-y-6">



                        <div className="w-full flex justify-center">
                            <Check className="w-[40px] h-[40px] p-2 rounded-full bg-[#220f00] text-white" />
                        </div>

                        <div className="mt-3 text-center sm:mt-5 w-full">
                            <h2 className="text-xl font-semibold">Paiement réussi</h2>
                            <p className="text-sm mt-2 tracking-tighter">
                                Félicitations pour votre paiement. Votre commande a ete effectue.
                            </p>
                        </div>

                        <button className="w-full mt-4 bg-[#220f00]  border border-[#220f00] hover:bg-[#220f00e3] transition-all duration-75  p-2 rounded-md ">

                            <Link href="/" className="text-white">

                                Retour a la page d&apos;accueil

                            </Link>

                        </button>





                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}

export default SuccessPaymentModal 