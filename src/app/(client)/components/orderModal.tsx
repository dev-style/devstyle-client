/* eslint-disable react/no-unescaped-entities */
import * as React from "react";
import {
  Box,
  Typography,
  Modal,
  Button,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { toast } from "react-toastify";

import Spinner from "./spinner";

import myAxios from "@/app/(client)/lib/axios.config";

import "./orderModal.scss";
import { IOrderData } from "@/app/lib/interfaces";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 410,
  bgcolor: "#220f00",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "15px",
  p: 4,
};

const OrderModal = ({
  goodie,
  open,
  handleClose,
  message,
}: // orderData,
{
  goodie: any;
  open: boolean;
  handleClose: () => void;
  message: () => string;
  // orderData: IOrderData | undefined;
}) => {
  const [number, setNumber] = React.useState(0);
  const [isSending, setIsSending] = React.useState(false);
  const [isSendOrder, setIsSendOrder] = React.useState(false);

  const match500 = useMediaQuery("(max-width:500px)");

  // // console.log("L'order data dans orderModal", orderData);

  const contact = () => {
    const msg = message ? message() : "";
    window
      .open(
        `https://api.whatsapp.com/send/?phone=237658732446&text=%0A%60%60%60%3C%20MA%20COMMANDE%20%2F%3E%60%60%60%F0%9F%9B%92%0A${msg}%5B%20%C3%A0%20ne%20pas%20supprimer%F0%9F%91%86%F0%9F%8F%BD%20%5D`,
        "_blank"
      )!
      .focus();
  };

  React.useEffect(() => {
    let localNumber = window.localStorage.getItem("_devStyle-order-number");
    if (localNumber) {
      setNumber(
        Number(
          String(localNumber)
            .split("")
            .reduce(
              (acc, val, i) =>
                (acc += String.fromCharCode(val.charCodeAt(0) - 3)),
              ""
            )
        )
      );
    }
  }, []);

  const orderFormSchema = z.object({
    name: z.string().min(2),
    email: z.string().email().min(5),
  });

  type IOrderFormSchema = z.infer<typeof orderFormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IOrderFormSchema>({ resolver: zodResolver(orderFormSchema) });

  const onSubmit: SubmitHandler<IOrderFormSchema> = (data) => {
    setIsSending(true);
    // console.log("message description", message && message());
    
    const orderData: IOrderData | null = {
      goodies: goodie,
      status: "initiate",
      number: number,
      ...data,
    };

    myAxios
      .post("/order/create", orderData)
      .then((response: any) => {
        if (response.status === 200) {
          window.localStorage.setItem(
            "_devStyle-order-number",
            String(number)
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

          // // console.log(response.data.message);
        } else {
          toast.error(
            <div style={{ color: "#fff" }}>Une erreur est survenu</div>,
            {
              style: { textAlign: "center" },
            }
          );
          // console.log(response.data.message);
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
        // console.log(error);
      })
      .finally(() => {
        setIsSending(false);
        handleClose();
      });

    // // console.log("Voici les donnees de la commande ", orderData);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="order-modal-container">
          <Typography
            className="order-modal-title"
            variant="h6"
            component="h2"
            style={{ fontWeight: "400" }}
          >
            {"< Commander Maintenant🛒 />"}
          </Typography>

          <Box className="order-form-container" paddingY={"15px"}>
            <form
              className="order-form"
              style={{}}
              onSubmit={handleSubmit(onSubmit)}
            >
              <div
                className="orer-form-item"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  padding: "10px",
                  // backgroundColor: "blue",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    gap: "5px",
                    width: "100%",
                  }}
                >
                  <label
                    htmlFor=""
                    style={{
                      fontSize: "12px",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    Enter your name
                  </label>
                  <input
                    id="input-value"
                    type="text"
                    placeholder="Your name"
                    className="input-item"
                    {...register("name", { required: "This is required" })}
                  />

                  <ErrorMessage errors={errors} name="name" />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    gap: "15px",
                    marginTop: "10px",
                    width: "100%",
                  }}
                >
                  <label
                    htmlFor=""
                    style={{
                      fontSize: "12px",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    Enter your Email
                  </label>
                  <input
                    id="input-value"
                    type="email"
                    placeholder="Your email"
                    className="input-item"
                    {...register("email", { required: "This is required" })}
                  />
                  <ErrorMessage errors={errors} name="email" />
                </div>
              </div>
              <Box>
                <p
                  style={{
                    fontSize: "12px",
                    textAlign: "center",
                    width: "100%",
                    paddingBottom: "10px",
                  }}
                >
                  Laisse ton numéro, on te contact juste après
                </p>
                <input
                  id="whatsapp-number"
                  placeholder="Numéro whatsapp valide"
                  type={"number"}
                  value={number}
                  onChange={(e) => setNumber(Number(e.target.value))}
                />
                <Button
                  type="submit"
                  className="button"
                  // onClick={() => send()}
                  disabled={isSending}
                >
                  {isSending ? (
                    <Spinner size={25} thickness={3} color={"white"} />
                  ) : (
                    "Contactez moi sur whatsapp"
                  )}
                </Button>
                <p style={{ textAlign: "center", paddingTop: "25px" }}>
                  Dans tous les cas, retrouvons nous de l'autre côté😜
                </p>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default OrderModal;
