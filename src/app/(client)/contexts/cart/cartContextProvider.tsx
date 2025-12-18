"use client";

import { useReducer, useContext, useEffect } from "react";
import ReactGA from "react-ga4";
import CartContext from "./cartContext";

import {
  Action,
  State,
  CartContextProviderProps,
  CartContent,
} from "./cartInterface";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";

const cartReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_CART": {
      let cart = action.payload;

      localStorage.setItem("devStyle_cart", JSON.stringify(cart));
      return { cartContent: cart, cartDispatch: state.cartDispatch };
    }
    case "ADD_TO_CART": {
      let copyCart = { ...state.cartContent };
      let goodie = action.payload;

      if (copyCart[goodie.cartID]) {
        copyCart[goodie.cartID].quantity += goodie.quantity;
      } else {
        copyCart[goodie.cartID] = goodie;
      }

      localStorage.setItem("devStyle_cart", JSON.stringify(copyCart));
      toast.info(<div style={{ color: "#fff" }}> Dans le panier</div>, {
        icon: "🗑️",
        style: { textAlign: "center" },
      })

      return { cartContent: copyCart, cartDispatch: state.cartDispatch };
    }

    case "UPDATE_QUANTITY": {
      let copyCart = { ...state.cartContent };
      let cartID = action.payload.cartID;
      let quantity = action.payload.quantity;

      if (copyCart[cartID]) {
        copyCart[cartID].quantity += quantity;
        if (copyCart[cartID].quantity === 0) {
          delete copyCart[cartID];
        }
      }

      localStorage.setItem("devStyle_cart", JSON.stringify(copyCart));
      return { cartContent: copyCart, cartDispatch: state.cartDispatch };
    }

    case "DELETE_FROM_CART": {
      let copyCart = { ...state.cartContent };
      let cartID = action.payload;

      delete copyCart[cartID];

      localStorage.setItem("devStyle_cart", JSON.stringify(copyCart));
      return { cartContent: copyCart, cartDispatch: state.cartDispatch };
    }

    case "CLEAR_CART": {
      let copyCart = {};

      localStorage.setItem("devStyle_cart", JSON.stringify(copyCart));
      return { cartContent: copyCart, cartDispatch: state.cartDispatch };
    }

    default:
      return state;
  }
};

function CartContextProvider({
  children,
}: CartContextProviderProps): JSX.Element {
  const initialState: CartContent = {
    cartContent: {},
    cartDispatch: () => null,
  };

  const [cartContentState, cartDispatch] = useReducer(
    cartReducer,
    initialState
  );
  const value = {
    cartContent: cartContentState.cartContent,
    cartDispatch,
  };

  ReactGA.initialize(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string);
  const pathname = usePathname();

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: pathname});
  }, [pathname]);

  useEffect(() => {
    let localStorageContent = {};
    if (window !== undefined) {
      localStorageContent = JSON.parse(
        localStorage.getItem("devStyle_cart") || "{}"
      );
    }
    cartDispatch({ type: "SET_CART", payload: { ...localStorageContent } });
  }, []);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartContextProvider;

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used as a descendant of CartProvider");
  } else return context;
};
