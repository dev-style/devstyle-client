"use client"

import AddDiscountModal from '@/app/(client)/components/addDiscountModal';
import { fetchDiscounts } from '@/app/admin/controllers/discount';
import Pagination from '@/app/admin/ui/dashboard/pagination/page'
import React, { useEffect, useState } from 'react'

type Props = {}

const DiscountPage = ({ searchParams }: any) => {

    const [discouts, setDiscounts] = useState(null);
    const [openModal, setOpenModal] = useState(false)
    const [countDiscount, setCountDiscount] = useState<number>(null)

    const q = searchParams?.q || "";
    const page = searchParams?.page || 1;

    useEffect(() => {

        const fetchData = async () => {

            const { count, discounts } = await fetchDiscounts(q, page)
            console.log("discounts", discounts);
            setDiscounts(discounts);
            setCountDiscount(count);

        }
        fetchData()

    }, [])


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
                            </tr>
                        </thead>
                        <tbody>
                            {
                                discouts && discouts.map((discount) => (
                                    <tr key={discount.id}>

                                        <td className="p-2.5 pl-0">{discount.code}</td>
                                        <td className="p-2.5 pl-0">{discount.percent}</td>
                                        <td className="p-2.5 pl-0">{discount.limit}</td>
                                        <td className="p-2.5 pl-0">{discount.uses}</td>
                                        <td className="p-2.5 pl-0">{discount.isActive}</td>

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
            />
        </div>



    )
}

export default DiscountPage