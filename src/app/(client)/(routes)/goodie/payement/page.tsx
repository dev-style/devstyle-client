"use client";
import { localservices } from "googleapis/build/src/apis/localservices";
import { useContext, useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Money } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  useMediaQuery,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-toastify";
import myAxios from "@/app/(client)/lib/axios.config";
import Spinner from "@/app/(client)/components/spinner";
import { AnimatePresence, motion } from "framer-motion";
import PrepaymentPolicyModal from "@/app/(client)/components/PrepaymentPolicyModal";
import { cityList } from "@/app/(client)/lib/cityList";
import { useRouter } from "next/navigation";
import SuccessPaymentModal from "@/app/(client)/components/SuccessPaymentModal";
import Image from "next/image";
import CartContext from "@/app/(client)/contexts/cart/cartContext";

interface payementProps {}
const Page = ({}: payementProps) => {
  const [goodies, setGoodies] = useState<
    {
      name: string;
      image: { url: string };
      price: number;
      quantity: number;
      total: number;
      _id: string;
      sizeName?: string;
      size?: string;
      color?: string;
    }[]
  >([]);
  const [message, setMessage] = useState<string>("");
  const [infoChecked, setInfoChecked] = useState<boolean>(false);
  const [locationChecked, setLocationChecked] = useState<boolean>(false);
  const [openSuccessModal, setOpenSuccessModal] = useState<boolean>(false);
  const { cartDispatch, cartContent } = useContext(CartContext);

  const [isSending, setIsSending] = useState(false);

  const schema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    phone: z.string().refine((value) => !isNaN(Number(value)), {
      message: "Invalid phone number",
    }),
    email: z.string().email({ message: "Invalid email address" }),
    city: z.string().min(1, { message: "Add your city" }),
    expeditionAdresse: z.string().optional(),
    district: z.string().optional(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  // const match1000 = useMediaQuery()

  const contact = () => {
    const msg = message ? message : "";
    window
      .open(
        `https://api.whatsapp.com/send/?phone=237658732446&text=%0A%60%60%60%3C%20MA%20COMMANDE%20%2F%3E%60%60%60%F0%9F%9B%92%0A${msg}%5B%20%C3%A0%20ne%20pas%20supprimer%F0%9F%91%86%F0%9F%8F%BD%20%5D`,
        "_blank",
      )!
      .focus();
  };

  useEffect(() => {
    let localNumber = window.localStorage.getItem("_devStyle-order-number");
    let localName = window.localStorage.getItem("_devStyle-order-name");
    let localEmail = window.localStorage.getItem("_devStyle-order-email");
    let localCity = window.localStorage.getItem("_devStyle-order-city");
    let localDistrict = window.localStorage.getItem("_devStyle-order-district");
    let localExpeditionAdresse = window.localStorage.getItem(
      "_devStyle-order-expeditionAdresse",
    );
    if (localNumber) {
      setValue("phone", localNumber);
    }
    if (localName) {
      setValue("name", localName);
    }
    if (localEmail) {
      setValue("email", localEmail);
    }
    if (localCity) {
      setValue("city", localCity);
    }
    if (localDistrict) {
      setValue("district", localDistrict);
    }
    if (localExpeditionAdresse) {
      setValue("expeditionAdresse", localExpeditionAdresse);
    }
  }, []);

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = (data) => {
    setIsSending(true);

    // console.log(data)
    const orderData: any = {
      goodies: goodies,
      status: "initiate",
      number: Number(data.phone),
      name: data.name,
      email: data.email,
      city: data.city,
      district: data.district,
      expeditionAdresse: data.expeditionAdresse,
      paymentMethod: payementMethod,
    };
    console.log("here is the order data", orderData);

    myAxios
      .post("/order/create", orderData)
      .then((response: any) => {
        if (response.status === 200) {
          if (infoChecked) {
            window.localStorage.removeItem("_devStyle-order-number");
            window.localStorage.removeItem("_devStyle-order-name");
            window.localStorage.removeItem("_devStyle-order-email");
          }

          if (locationChecked) {
            window.localStorage.removeItem("_devStyle-order-city");
            window.localStorage.removeItem("_devStyle-order-district");
            window.localStorage.removeItem("_devStyle-order-expeditionAdresse");
          }

          setOpenSuccessModal(true);

          toast.success(
            <div style={{ color: "#fff" }}>Commande bien reçu</div>,
            {
              style: { textAlign: "center" },
              icon: "🎉",
            },
          );
          cartDispatch({ type: "CLEAR_CART", payload: null });
          // contact()

          // console.log(response.data.message);
        } else {
          toast.error(
            <div style={{ color: "#fff" }}>Une erreur est survenu</div>,
            {
              style: { textAlign: "center" },
            },
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
          },
        );
        console.log(error);
      })
      .finally(() => {
        setIsSending(false);
        // handleClose();
      });
  };

  const match700 = useMediaQuery("max-width:700px");

  useEffect(() => {
    const storedGoodies = localStorage.getItem("goodiesData")
      ? JSON.parse(localStorage.getItem("goodiesData")!!)
      : null;
    const storedMessage = localStorage.getItem("messageData");

    const goodieWithDiscount = localStorage.getItem("goodieWithDiscount")
      ? JSON.parse(localStorage.getItem("goodieWithDiscount")!!)
      : null;

    console.log("storedGoodie", storedGoodies);
    console.log("goodieWithDiscount", goodieWithDiscount);
    if (storedGoodies && goodieWithDiscount) {
      const updatedGoodies = storedGoodies.map((goodie: any) => {
        if (goodie._id == goodieWithDiscount._id) {
          console.log("test", goodieWithDiscount.price);

          return { ...goodie, price: goodieWithDiscount.price };
        }
        return goodie;
      });
      console.log("here is the goodie", updatedGoodies);
      setGoodies(updatedGoodies);
    } else {
      setGoodies(storedGoodies);
    }
    if (storedMessage) {
      setMessage(JSON.parse(storedMessage));
    }

    // localStorage.removeItem("goodiesData")
    // localStorage.removeItem("messageData")
  }, []);

  type Step = 0 | 1 | 2;
  const [step, setStep] = useState<Step>(0);
  const [openLocationSection, setOpenLocationSection] =
    useState<boolean>(false);
  const [openInfoSection, setOpenInfoSection] = useState<boolean>(true);
  const [openPayementSection, setOpenPayementSection] =
    useState<boolean>(false);

  const [payementMethod, setPayementMethod] = useState("delivery");

  const ChangeStep = (step: number) => {
    if (step == 1) {
      setOpenLocationSection((prevStep) => {
        return true;
      });
    } else if (step == 2) {
      setOpenPayementSection((prevStep) => {
        return true;
      });
    }
  };

  const handleChangePayementMethod = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPayementMethod((event.target as HTMLInputElement).value);
  };

  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  const selectedCity = watch("city") || cityList[0].name;

  const selectedCityData = cityList.find((c) => c.name === selectedCity);

  const districts = selectedCityData ? selectedCityData.district : [];

  const selectedDistrict =
    watch("district") || (districts.length > 0 ? districts[0].name : "");

  return (
    <Box
      paddingX={match700 ? 3 : 12}
      paddingY={5}
      style={{ width: "100%", height: "100%" }}
    >
      <div className="w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className=" w-full mx-auto ">
            <span className=" text-center text-xl font-semibold">
              Checkout{" "}
            </span>
          </div>
          <div className="  mx-auto flex flex-col md:flex-row flex-wrap sm:flex-nowrap gap-4  mt-4  h-full w-full">
            <div className=" flex-auto flex-col  flex gap-4  w-full md:w-[70%] relative">
              <div className="border rounded-[5px] w-full border-[#220f00]/3 h-fit  pt-4 pb-3 ">
                <div className="font-bold text-lg flex items-center gap-x-2  border-b-2 border-[#220f00]/3 pb-4  px-4 ">
                  <div className="   rounded-full text-sm bg-[#220f00] text-white flex justify-center  h-3 w-3 p-4 items-center ">
                    1
                  </div>{" "}
                  Vos informations
                </div>

                <AnimatePresence>
                  <motion.div className="px-4 overflow-hidden">
                    <div>
                      <div className="w-full gap-3 flex mt-4 flex-col">
                        <label htmlFor="tset">Entrez votre nom</label>
                        <input
                          {...register("name")}
                          type="text"
                          placeholder="Entrez votre nom"
                          className="border rounded-lg border-[#220f007e] text-lg pl-3 pt-2 pb-2 pr-3 focus:outline-none focus:border-[#220f00]      "
                        />
                        {errors.name && (
                          <p className="text-base text-red-500 tracking-tight font-medium ">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col md:flex-row gap-x-2  flex-wrap lg:flex-nowrap">
                        <div className="w-full gap-3 flex mt-4 flex-col">
                          <label htmlFor="tset">Numero Whatsapp</label>
                          <input
                            {...register("phone")}
                            type="number"
                            placeholder="Entrez votre numero"
                            className="border rounded-lg border-[#220f007e] text-lg pl-3 pt-2 pb-2 pr-3 focus:outline-none focus:border-[#220f00]      "
                          />
                          {errors.phone && (
                            <p className="text-base text-red-500 tracking-tight font-medium ">
                              {errors.phone.message}
                            </p>
                          )}
                        </div>
                        <div className="w-full gap-3 flex mt-4 flex-col">
                          <label htmlFor="email">Entrez votre email</label>
                          <input
                            {...register("email")}
                            type="email"
                            placeholder="Email"
                            className="border rounded-lg border-[#220f007e] text-lg pl-3 pt-2 pb-2 pr-3 focus:outline-none focus:border-[#220f00]      "
                          />
                          {errors.email && (
                            <p className="text-base text-red-500 tracking-tight font-medium ">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                      <div>
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={() => setInfoChecked(!infoChecked)}
                            />
                          }
                          label="Memoriser ces informations pour les prochaines fois"
                        />
                      </div>
                      <div>
                        <button
                          className={`rounded-lg py-3 px-6 text-white ${
                            !openLocationSection
                              ? "bg-[#220f00]"
                              : "bg-gray-500 cursor-not-allowed"
                          }`}
                          onClick={() => ChangeStep(1)}
                          disabled={openLocationSection}
                        >
                          Poursuire
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="border rounded-[5px] w-full border-[#220f00]/3 h-fit  pt-4 pb-3 ">
                <div className="font-bold text-lg flex items-center gap-x-2  border-b-2 border-[#220f00]/3 pb-4  px-4 ">
                  <div className="   rounded-full text-sm bg-[#220f00] text-white flex justify-center  h-3 w-3 p-4 items-center ">
                    2
                  </div>{" "}
                  Lieux de livraison
                </div>

                {openLocationSection && (
                  <motion.div
                    className="px-4 overflow-hidden"
                    initial={{
                      height: 0,
                    }}
                    animate={{
                      height: "auto",
                    }}
                    exit={{
                      height: 0,
                    }}
                  >
                    <div className="flex flex-col md:flex-row gap-x-2  flex-wrap lg:flex-nowrap">
                      <div className="w-full  gap-3 flex mt-4 flex-col">
                        <label htmlFor="tset">Ville</label>
                        <FormControl fullWidth>
                          {/* <InputLabel id="ville">Ville</InputLabel> */}
                          <Select
                            labelId="city"
                            id="city"
                            value={selectedCity}
                            {...register("city")}
                            onChange={(e) => setValue("city", e.target.value)}
                          >
                            {cityList.map((city) => {
                              return (
                                <MenuItem key={city.code} value={city.name}>
                                  {city.name}
                                </MenuItem>
                              );
                            })}
                          </Select>{" "}
                          {/* <input {...register("city")} type="text" placeholder="Entrez votre localisation" className="border rounded-lg border-[#220f007e] text-lg pl-3 pt-2 pb-2 pr-3 focus:outline-none focus:border-[#220f00]      " /> */}
                          {errors.city && (
                            <p className="text-base text-red-500 tracking-tight font-medium ">
                              {errors.city.message}
                            </p>
                          )}
                        </FormControl>
                      </div>

                      <>
                        {selectedCity == "Expedition" ? (
                          <div className="w-full gap-3 flex mt-4 flex-col">
                            <label htmlFor="tset">
                              Entrez votre adresse d&apos;expedition
                            </label>
                            <input
                              {...register("expeditionAdresse")}
                              type="text"
                              placeholder="Entrez votre adresse d'expedition"
                              className="border rounded-lg border-[#220f007e] text-lg pl-3 pt-2 pb-2 pr-3 focus:outline-none focus:border-[#220f00]      "
                            />
                            {errors.expeditionAdresse && (
                              <p className="text-base text-red-500 tracking-tight font-medium ">
                                {errors.expeditionAdresse.message}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="w-full gap-3 flex mt-4 flex-col">
                            <label htmlFor="tset">Quartier</label>

                            <FormControl fullWidth>
                              {/* <InputLabel id="ville">Ville</InputLabel> */}
                              <Select
                                labelId="district"
                                id="district"
                                value={selectedDistrict}
                                {...register("district")}
                                onChange={(e) =>
                                  setValue("district", e.target.value)
                                }
                              >
                                {districts.length > 0 ? (
                                  districts.map((city) => {
                                    return (
                                      <MenuItem
                                        key={city.code}
                                        value={city.name}
                                      >
                                        {city.name}
                                      </MenuItem>
                                    );
                                  })
                                ) : (
                                  <MenuItem disabled>
                                    Aucun quartier disponible
                                  </MenuItem>
                                )}
                              </Select>{" "}
                              {/* <input {...register("city")} type="text" placeholder="Entrez votre localisation" className="border rounded-lg border-[#220f007e] text-lg pl-3 pt-2 pb-2 pr-3 focus:outline-none focus:border-[#220f00]      " /> */}
                              {errors.district && (
                                <p className="text-base text-red-500 tracking-tight font-medium ">
                                  {errors.district.message}
                                </p>
                              )}
                            </FormControl>
                          </div>
                        )}
                      </>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                      <div>
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={() =>
                                setLocationChecked(!locationChecked)
                              }
                            />
                          }
                          label="Memoriser ces informations pour les prochaines fois"
                        />
                      </div>
                      <div>
                        <button
                          className={`rounded-lg py-3 px-6 text-white ${
                            !openPayementSection
                              ? "bg-[#220f00]"
                              : "bg-gray-500 cursor-not-allowed"
                          }`}
                          onClick={() => ChangeStep(2)}
                          disabled={openPayementSection}
                        >
                          Poursuire
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              <div className="border rounded-[5px] w-full border-[#220f00]/3 h-fit  pt-4 pb-3 ">
                <div className="font-bold text-lg flex items-center gap-x-2  border-b-2 border-[#220f00]/3 pb-4  px-4 ">
                  <div className="   rounded-full text-sm bg-[#220f00] text-white flex justify-center  h-3 w-3 p-4 items-center ">
                    3
                  </div>{" "}
                  Mode de payement
                </div>
                {openPayementSection && (
                  <motion.div
                    initial={{
                      height: 0,
                    }}
                    animate={{
                      height: "auto",
                    }}
                    exit={{
                      height: 0,
                    }}
                    className="w-full mt-4 px-4 overflow-hidden"
                  >
                    <div>
                      <FormControl>
                        <RadioGroup
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={payementMethod}
                          onChange={handleChangePayementMethod}
                        >
                          <div className="flex justify-center items-start ">
                            <FormControlLabel
                              value="delivery"
                              control={
                                <Radio
                                  sx={{
                                    fontSize: 28,
                                    "&.Mui-checked": {
                                      color: "#E6600B",
                                    },
                                  }}
                                  className=""
                                />
                              }
                              label=" "
                              className=""
                            />
                            <div>
                              <h1 className="text-2xl font-semibold  text-[#E6600B]">
                                {" "}
                                Paiement a la livraison
                              </h1>
                              <span className="text-base font-normal ">
                                Paiement uniquement a la livraison de votre
                                commande ( non valable dans certaines villes )
                              </span>
                            </div>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </div>

                    <div>
                      <button
                        disabled={isSending}
                        className=" flex items-center justify-center  mt-3 group relative transition-all duration-200 ease-in-out  text-white bg-[#220f00] rounded-lg p-4 w-full"
                      >
                        {isSending ? (
                          <span className="flex items-center justify-center z-10 gap-2 text-base ">
                            <Spinner size={25} thickness={3} color={"white"} />
                          </span>
                        ) : (
                          <span className="flex items-center justify-center z-10 gap-2 text-base ">
                            Commander maintenant
                            {/* <Money className="inline-block size-[20px] group-hover:translate-x-3 transition-all duration-200 ease-in-out  " /> */}
                            <div className="absolute -left-[75px] -top-[60px]  bg-white opacity-20 w-4 h-[130px] rotate-[35deg] duration-200 transition-all group-hover:left-[110%] " />
                          </span>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="  w-full   md:w-[30%] border rounded-lg  border-[#220f00]/3 h-full  ">
              <div className="border-b-2 border-[#220f00]/3    pl-4 pr-4 pt-4 pb-3 overflow-hidden">
                <button
                  disabled={isSending}
                  className=" flex items-center justify-center  mt-3 group relative transition-all duration-200 ease-in-out  text-white bg-[#220f00] rounded-lg p-4 w-full"
                >
                  {isSending ? (
                    <span className="flex items-center justify-center z-10 gap-2 text-base ">
                      <Spinner size={25} thickness={3} color={"white"} />
                    </span>
                  ) : (
                    <span className="flex items-center justify-center z-10 gap-2 text-base ">
                      Commander maintenant
                      {/* <Money className="inline-block size-[20px] group-hover:translate-x-3 transition-all duration-200 ease-in-out  " /> */}
                      <div className="absolute -left-[75px] -top-[60px]  bg-white opacity-20 w-4 h-[130px] rotate-[35deg] duration-200 transition-all group-hover:left-[110%] " />
                    </span>
                  )}
                </button>
              </div>

              <div className=" pl-4 pr-4 pt-4 pb-3 grid grid-cols-1 gap-y-2 text-lg">
                <div className="flex flex-row justify-between">
                  <h1>Sous total</h1>
                  <p>
                    {goodies.reduce((total, goodie) => total + goodie.total, 0)} Fcfa
                  </p>
                </div>
                <div className="flex flex-row justify-between">
                  <h1 className="text-left">Livraison (Expédition):</h1>
                  <p>Au frais du client</p>
                </div>
                <div className="flex flex-row justify-between">
                  <h1>Total : </h1>
                  <p className="font-bold text-lg ">
                    {goodies.reduce((total, goodie) => total + goodie.total, 0)} Fcfa
                  </p>
                </div>
              </div>
              <div
                className={`p-4 border-t-2  border-[#220f00]/3   ${
                  match700
                    ? " flex justify-center items-center flex-col"
                    : "flex justify-start flex-row flex-wrap"
                } gap-x-3 gap-y-1 flex-wrap:wrap  `}
              >
                {goodies.map((goodie, key) => {
                  return (
                    <div
                      key={key}
                      className="border flex flex-col w-[200px] gap-y-1 border-px border-[#220f00]/3 rounded-sm p-2 relative  "
                    >
                      <div className="rounded-sm w-full ">
                        <img
                          src={
                            goodie.image.url ? goodie.image.url : goodie.image
                          }
                          alt="goodie image"
                          className="w-full h-[50] rounded-sm"
                        />
                      </div>
                      <div className="border-b-px px-2 border-[#220f00] bg-[#220f00]">
                        <h1 className="text-white">
                          {goodie.name}
                        </h1>
                      </div>

                      <p>
                        <span>Prix :</span> {goodie.price} Fcfa
                      </p>
                      <p>
                        <span>Quantité : </span>
                        {goodie.quantity}
                      </p>
                      {goodie.sizeName && (
                      <p>
                          <span>Taille :</span> {goodie.sizeName}
                      </p>
                      )}
                      {goodie.color && (
                      <p style={{ display: "flex", alignItems: "center", gap: "4px"}}>
                          <span>Couleur :</span>
                          <Box
                            style={{
                              backgroundColor: goodie.color,
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              border:"2px solid #06C27033"
                            }}
                          />
                      </p>
                      )}
                      <p>
                        <span>Total :</span> {goodie.total} Fcfa
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className=" p-4 flex justify-center items-center  text-base border-t-2 border-[#220f00]/3">
                <button
                  type="button"
                  onClick={() => setIsPolicyModalOpen(true)}
                  className="text-[#FF8800] hover:text-[#E67A00] underline transition-colors"
                >
                  Politique de prépaiement
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <PrepaymentPolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
      />
      <SuccessPaymentModal isOpen={openSuccessModal} />
    </Box>
  );
};

export default Page;
