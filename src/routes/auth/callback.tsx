import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { completeAuth } from "../../store/slices/authSlice";

export default function AuthCallback() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(completeAuth());
    navigate("/");
  }, [dispatch, navigate]);

  return null;
}
