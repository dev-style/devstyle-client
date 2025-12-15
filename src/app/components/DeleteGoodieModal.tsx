// create the modal
import { Box, Modal, Typography } from "@mui/material";
import { color } from "framer-motion";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteGoodie } from "../admin/controllers/goodie";

// import { deleteGoodie } from "../lib/api";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#ffff",
  border: "2px solid #ffff",
  color: "black",
  boxShadow: 24,
  p: 4,
};

type DeleteGoodieModalProps = {
  goodieId: string;
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DeleteGoodieModal = ({
  modal,
  setModal,
  goodieId,
}: DeleteGoodieModalProps) => {
  //   const [open, setOpen] = useState(modal);

  const handleClose = () => setModal(false);

  // const { mutate } = useMutation(deleteGoodie, {
  //     onSuccess: () => {
  //         toast.success("Goodie deleted successfully");
  //         navigate("/admin/dashboard/goodies");
  //     },
  //     onError: () => {
  //         toast.error("An error occurred while deleting the goodie.");
  //     },
  // });

  const handleDelete = async() => {
    // mutate(goodieId);
    // console.log("test");

    try{
        await deleteGoodie(goodieId)

    }catch(error){
        toast.error("An error occurred while deleting the goodie.")
    }finally{
        setModal(false);
    }
  };

  return (
    <>
      {/* <button onClick={handleClose}>Delete</button> */}
      <Modal
        open={modal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to delete this goodie?
          </Typography>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleDelete}
              className="px-6 py-3 rounded-md bg-red-700 text-white"
            >
              Delete
            </button>
            <button
              onClick={handleClose}
              className="px-6 py-3  rounded-md bg-gray-700 text-white"
            >
              Cancel
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default DeleteGoodieModal;
