"use client"
import { localservices } from "googleapis/build/src/apis/localservices"
import { useEffect, useState } from "react"


import { zodResolver } from "@hookform/resolvers/zod"
import { Money } from "@mui/icons-material"
import { Box, useMediaQuery } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "react-toastify"
import myAxios from "@/app/(client)/lib/axios.config"
import Spinner from "@/app/(client)/components/spinner"


interface payementProps {

}
const Page = ({ }: payementProps) => {

    const [goodies, setGoodies] = useState<{ name: string, price: number, quantity: number, total: number }[]>([])
    const [message, setMessage] = useState<string>("")


    const [isSending, setIsSending] = useState(false);


    const schema = z.object({
        name: z.string().min(1, { message: "Name is required" }),
        phone: z.string().refine(value => !isNaN(Number(value)), { message: "Invalid phone number" }),
        email: z.string().email({ message: "Invalid email address" }),
        location: z.string().min(1, { message: "Add your location" })

    })

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema)
    })


    const contact = () => {
        const msg = message ? message : "";
        window
            .open(
                `https://api.whatsapp.com/send/?phone=237658732446&text=%0A%60%60%60%3C%20MA%20COMMANDE%20%2F%3E%60%60%60%F0%9F%9B%92%0A${msg}%5B%20%C3%A0%20ne%20pas%20supprimer%F0%9F%91%86%F0%9F%8F%BD%20%5D`,
                "_blank"
            )!
            .focus();
    };

    const onSubmit: SubmitHandler<z.infer<typeof schema>> = (data) => {
        setIsSending(true);

        // console.log(data)
        const orderData: any = {
            goodies: goodies,
            status: "initiate",
            number: Number(data.phone),
            name: data.name,
            email: data.email,
            location: data.location,

        }
        console.log("here is the order data", orderData)

        myAxios
            .post("/order/create", orderData)
            .then((response: any) => {
                if (response.status === 200) {
                    window.localStorage.setItem(
                        "_devStyle-order-number",
                        String(orderData.phone)
                            .split("")
                            .reduce(
                                (acc, val, i) =>
                                    (acc += String.fromCharCode(val.charCodeAt(0) + 3)),
                                ""
                            )
                    );
                    toast.success(
                        <div style={{ color: "#fff" }}>Commande bien reçu</div>,
                        {
                            style: { textAlign: "center" },
                            icon: "🎉",
                        }
                    );
                    contact()

                    // console.log(response.data.message);
                } else {
                    toast.error(
                        <div style={{ color: "#fff" }}>Une erreur est survenu</div>,
                        {
                            style: { textAlign: "center" },
                        }
                    );
                    console.log(response.data.message);
                }
            })
            .catch((error: any) => {
                toast.error(
                    <div style={{ color: "#fff" }}>
                        Une erreur est survenu, réessayer
                    </div>,
                    {
                        style: { textAlign: "center" },
                        icon: "😕",
                    }
                );
                console.log(error);
            })
            .finally(() => {
                setIsSending(false);
                // handleClose();
            });

    }


    const match700 = useMediaQuery("max-width:700px")


    useEffect(() => {

        const storedGoodies = localStorage.getItem("goodiesData")
        const storedMessage = localStorage.getItem("messageData")

        if (storedGoodies) {
            setGoodies(JSON.parse(storedGoodies))
        }
        if (storedMessage) {
            setMessage(JSON.parse(storedMessage))
        }


        localStorage.removeItem("goodiesData")
        localStorage.removeItem("messageData")


    }, [])

    return (
        <Box paddingX={match700 ? 3 : 12} paddingY={5} style={{ width: "100%", height: "100%" }}>
            <form onSubmit={handleSubmit(onSubmit)} >

                <div className=" container max-w-screen-2xl mx-auto ">

                    <span className=" text-center text-xl font-semibold">Checkout </span>
                </div>
                <div className=" container max-w-screen-2xl mx-auto flex flex-row flex-wrap sm:flex-nowrap gap-4  mt-4  h-full w-full">
                    <div className=" flex-auto flex-col  flex gap-4 w-[70%] ">

                        <div className="border rounded-[5px] w-full border-[#220f00]/3 h-fit pl-4 pt-4 pb-3 pr-4">

                            <span className="font-bold text-lg ">
                                Vos informations
                            </span>

                            <div className="w-full gap-3 flex mt-4 flex-col">
                                <label htmlFor="tset">Entrez votre nom</label>
                                <input {...register("name")} type="text" placeholder="Entrez votre nom" className="border rounded-lg border-[#220f007e] text-lg pl-3 pt-2 pb-2 pr-3 focus:outline-none focus:border-[#220f00]      " />
                                {errors.name && <p className="text-base text-red-500 tracking-tight font-medium ">{errors.name.message}</p>}

                            </div>
                            <div className="w-full gap-3 flex mt-4 flex-col">
                                <label htmlFor="tset">Entrez votre numero de telephone</label>
                                <input {...register("phone")} type="number" placeholder="Entrez votre numero" className="border rounded-lg border-[#220f007e] text-lg pl-3 pt-2 pb-2 pr-3 focus:outline-none focus:border-[#220f00]      " />
                                {errors.phone && <p className="text-base text-red-500 tracking-tight font-medium ">{errors.phone.message}</p>}

                            </div>
                            <div className="w-full gap-3 flex mt-4 flex-col">
                                <label htmlFor="email">Entrez votre email</label>
                                <input {...register("email")} type="email" placeholder="Email" className="border rounded-lg border-[#220f007e] text-lg pl-3 pt-2 pb-2 pr-3 focus:outline-none focus:border-[#220f00]      " />
                                {errors.email && <p className="text-base text-red-500 tracking-tight font-medium ">{errors.email.message}</p>}

                            </div>
                            <div>

                            </div>


                        </div>
                        <div className="border rounded-[5px] w-full border-[#220f00]/3 h-fit pl-4 pt-4 pb-3 pr-4">

                            <span className="font-bold text-lg ">
                                Lieu de livraison
                            </span>

                            <div className="w-full gap-3 flex mt-4 flex-col">
                                <label htmlFor="tset">Entrez votre localisation</label>
                                <input {...register("location")} type="text" placeholder="Entrez votre localisation" className="border rounded-lg border-[#220f007e] text-lg pl-3 pt-2 pb-2 pr-3 focus:outline-none focus:border-[#220f00]      " />
                                {errors.location && <p className="text-base text-red-500 tracking-tight font-medium ">{errors.location.message}</p>}
                            </div>




                        </div>
                        <div className="border rounded-[5px] w-full border-[#220f00]/3 h-fit pl-4 pt-4 pb-3 pr-4">

                            <span className="font-bold text-lg ">
                                Mode de payement
                            </span>

                            <div className="w-full mt-4">
                                <p className="text-lg text-left">
                                    Pour un début, les payements se feront à la livraison.
                                </p>
                            </div>

                        </div>

                        <div className=" max-w-[300px]   w-[30%] border rounded-lg  border-[#220f00]/3 h-full pl-4 pr-4 pt-4 pb-3  ">
                            <button disabled={isSending} className="group relative transition-all duration-200 ease-in-out  text-white bg-[#220f00] rounded-lg p-5 w-full">

                                {isSending ? (
                                    <Spinner size={25} thickness={3} color={"white"} />
                                ) : (

                                    <span className="flex items-center z-10 gap-2 text-base">
                                        Commander
                                        <Money className="inline-block size-[20px] group-hover:translate-x-3 transition-all duration-200 ease-in-out  " />
                                        <div className="absolute -left-[75px] -top-[60px]  bg-white opacity-20 w-7 h-[180px] rotate-[35deg] duration-200 transition-all group-hover:left-[120%] " />
                                    </span>


                                )}


                            </button>
                        </div>

                    </div>


                </div>
            </form>

        </Box>
    )

}

export default Page