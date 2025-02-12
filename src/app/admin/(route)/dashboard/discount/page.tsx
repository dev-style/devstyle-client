"use client"

import AddDiscountModal from '@/app/(client)/components/addDiscountModal';
import { fetchDiscounts } from '@/app/admin/controllers/discount';
import Pagination from '@/app/admin/ui/dashboard/pagination/page'
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react'

type Props = {}



interface IDiscount {
    _id: string
    code: string;
    percent: number;
    isActive: boolean;
    limit: number;
    uses: number;
    goodies: any
}

const DiscountPage = ({ searchParams }: any) => {

    const [discouts, setDiscounts] = useState<IDiscount[] | null>(null);
    const [openModal, setOpenModal] = useState(false)
    const [countDiscount, setCountDiscount] = useState<number>(1)

    const q = searchParams?.q || "";
    const page = searchParams?.page || 1;

    // useEffect(() => {

    //     const fetchData = async () => {

    //         const { count, discounts } = await fetchDiscounts(q, page)
    //         console.log("discounts", discounts);
    //         setDiscounts(discounts);
    //         setCountDiscount(count);

    //     }
    //     fetchData()

    // }, [])
    const fetchDiscountData = useCallback(async () => {
        const { count, discounts } = await fetchDiscounts(q, page)
        console.log("discounts", discounts);
        setDiscounts(discounts);
        setCountDiscount(count);
    }, [q, page])

    useEffect(() => {
        fetchDiscountData()
    }, [fetchDiscountData])


    const handleDiscountSuccess = async () => {
        setOpenModal(false)
        await fetchDiscountData()

    }

    const handleDiscountFailure = async () => {
        setOpenModal(false)
        toast.error("An error occurred while adding the goodie. , Please Check if a discount is already associated with one of the selected goodies");

    }

    return (

        // Create discount 
        <div className='p-5 mt-5'>
            <div>

                <div className='mb-3 flex flex-row justify-between'>

                    <span className='font-bold text-lg'>Your discount code</span>

                    <button onClick={() => setOpenModal(true)} className="p-2.5 bg-[#5d57c9] text-white border-none rounded cursor-pointer" >
                        Add discount
                    </button>
                </div>
                <div className='overflow-x-auto mt-3'>

                    <table className='w-full min-w-[1000px]'>
                        <thead>
                            <tr>
                                <td>Code</td>
                                <td>Percent</td>
                                <td>limit</td>
                                <td>uses</td>
                                <td>isActive</td>
                                <td>Goodie</td>
                            </tr>
                        </thead>
                        <tbody className='gap-y-4'>
                            {
                                discouts && discouts.map((discount) => (
                                    <tr key={discount._id}>

                                        <td className="p-2.5 pl-0">{discount.code}</td>
                                        <td className="p-2.5 pl-0">{discount.percent}</td>
                                        <td className="p-2.5 pl-0">{discount.limit}</td>
                                        <td className="p-2.5 pl-0">{discount.uses}</td>
                                        <td className="p-2.5 pl-0">{discount.isActive ? "true" : "false"}</td>
                                        <td className="p-2.5 pl-0">{discount.goodies && discount.goodies.map((goodie: any) => (

                                            <div key={goodie._id}>
                                                <div>
                                                    <Image src={goodie.mainImage.url} alt="goodie" width={40} height={40} />
                                                </div>
                                                {goodie.name} - {goodie.price} $
                                            </div>

                                        ))}</td>

                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                    <Pagination count={countDiscount} />




                </div>
            </div>
            <AddDiscountModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                onSuccess={handleDiscountSuccess}
                onFailure={handleDiscountFailure}
            />
        </div>



    )
}

export default DiscountPage