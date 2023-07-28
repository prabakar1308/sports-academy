import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import * as genericActions from "../../../store/actions/dashboard";
import ConfirmationDialog from "../../../components/confirmation-dialog/ConfirmationDialog";

export default function LogoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [pin, setPin] = React.useState("");
  // const [disableBtn, setDisableBtn] = React.useState(false);
  // const {
  //   loginStatus: { success, fail },
  //   roles: { isSuperAdmin },
  // } = useSelector((state) => state.dashboard);

  // React.useEffect(() => {
  //   if (success) {
  //     isSuperAdmin ? navigate("/") : navigate("/cricket");
  //   }
  // }, [success]);

  // React.useEffect(() => {
  //   if (fail) {
  //     setDisableBtn(true);
  //   }
  // }, [fail]);

  // React.useEffect(() => {
  //   const userDetails = sessionStorage.getItem("userDetails");
  //   if (userDetails) {
  //     dispatch(genericActions.logoutAction());
  //     navigate("/login");
  //   } else {
  //     navigate(-1)
  //   }
  // }, []);

  const handleSignout = (action) => {
    if (action) {
      dispatch(genericActions.logoutAction());
      sessionStorage.removeItem("userDetails");
      sessionStorage.removeItem("client");
      sessionStorage.removeItem("previousPath");
      navigate("/login");
    } else {
      const previousPath = sessionStorage.getItem("previousPath");
      previousPath ? navigate(previousPath) : navigate("/");
    }
  };

  return (
    <>
      <ConfirmationDialog
        title={"Sign Out"}
        actionBtnText={"Sign Out"}
        handleClose={handleSignout}
        confirmationText={"Do you really want to sign off?"}
      />
    </>
  );
}
