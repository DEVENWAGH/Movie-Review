import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { completeAuth } from "../../store/slices/authSlice";

export default function Callback() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // If completeAuth requires a string parameter, pass an appropriate value
    dispatch(completeAuth("success"));
  }, [dispatch]);

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return null;
}
