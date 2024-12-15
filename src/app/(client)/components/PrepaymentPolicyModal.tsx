"use client"
import { Dialog, DialogContent, DialogTitle } from "@mui/material"
import { motion } from "framer-motion"
import { X } from "lucide-react"

interface PrepaymentPolicyModalProps {
    isOpen: boolean
    onClose: () => void
}

const PrepaymentPolicyModal = ({ isOpen, onClose }: PrepaymentPolicyModalProps) => {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle className="flex justify-between items-center border-b border-[#220f00]/10 pb-4">
                <span className="text-2xl font-bold text-[#220f00]">Politique de Prépaiement</span>
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
                    <div className="space-y-6">
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                            <h3 className="text-lg font-semibold text-orange-700 mb-2">
                                🔒 Sécurité des Paiements
                            </h3>
                            <p className="text-orange-600">
                                Tous nos paiements sont sécurisés et nous garantissons la protection de vos informations personnelles.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-[#220f00]">
                                Modalités de Paiement
                            </h3>
                            <div className="grid gap-4">
                                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                    <h4 className="font-medium mb-2">✅ Paiement à la Livraison</h4>
                                    <p className="text-gray-600">
                                        Payez directement au livreur lors de la réception de votre commande.
                                    </p>
                                </div>

                                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                    <h4 className="font-medium mb-2">⚠️ Conditions</h4>
                                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                                        <li>La commande doit être vérifiée avant le paiement</li>
                                        <li>Le paiement doit être effectué en totalité à la livraison</li>
                                        <li>Les frais de livraison sont à la charge du client</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h3 className="text-lg font-semibold mb-2">📞 Contact</h3>
                            <p className="text-gray-600">
                                Pour toute question concernant notre politique de paiement, 
                                n&apos;hésitez pas à nous contacter via WhatsApp ou email.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}

export default PrepaymentPolicyModal 