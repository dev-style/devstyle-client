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
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-[#220f00]">
                        🧾 C’est quoi le prépaiement ?
                        </h3>
                        <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <p className="text-gray-700">
                            Le prépaiement, c’est le fait de payer une avance ou la totalité du montant de votre commande. 
                            <br/>
                            <p className="font-bold">Toutes les commandes ne le nécessitent pas, et si c’est le cas, notre service client vous indique 
                            clairement le montant à verser lors de la confirmation. </p>
                        </p>
                        </div>

                        <h3 className="text-xl font-semibold text-[#220f00]">
                        🤝 Pourquoi on vous le demande ?
                        </h3>
                        <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <p className="text-gray-700">
                            Le prépaiement permet d’installer une relation de confiance entre vous et nous, 
                            et de limiter les coûts logistiques en cas d’annulation ou de désistement.
                        </p>
                        </div>

                        <h3 className="text-xl font-semibold text-[#220f00]">
                        📍 Dans quels cas est-il demandé ?
                        </h3>
                        <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>Lorsque le montant de votre commande est important.</li>
                            <li>Lorsque vous êtes situé en dehors de la ville de Douala.</li>
                        </ul>
                        </div>

                        <h3 className="text-xl font-semibold text-[#220f00]">
                        💳 Comment ça marche concrètement ?
                        </h3>
                        <div className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-blue-50/10 border-blue-300">
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>
                            <span className="font-medium">Prépaiement partiel :</span> vous payez 20 % ou 50 % du montant 
                            de votre commande si elle est importante et que vous êtes à Douala.
                            </li>
                            <li>
                            <span className="font-medium">Prépaiement total :</span> vous payez la totalité du montant 
                            si vous êtes en dehors de Douala.
                            </li>
                        </ul>
                        </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <h3 className="text-lg font-semibold mb-2">📞 Contact</h3>
                        <p className="text-gray-700">
                        Pour toute question concernant notre politique de prépaiement, 
                        n&apos;hésitez pas à nous contacter via{" "}
                        <a
                            href={`https://api.whatsapp.com/send/?phone=237654017521&text=${encodeURIComponent(`*#À propos Prépaiement*📌

                            Hello _DevStyle

                            `)}`}
                            className="text-[#220f00] underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            WhatsApp
                        </a>{" "}
                        ou par{" "}
                        <a
                            href="mailto:contact.devstyle@gmail.com"
                            className="text-[#220f00] underline font-medium"
                        >
                            email
                        </a>
                        .
                        </p>
                    </div>
                    </div>
                </motion.div>
                </DialogContent>

        </Dialog>
    )
}

export default PrepaymentPolicyModal 