import { useState, useEffect } from "react";
import type { PlanStatus } from "../../../types";

export function useAddPlanForm(open: boolean) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<PlanStatus>("planned");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [productId, setProductId] = useState("");

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      const nowUTC = new Date().toISOString().split("T")[0];
      const year = Number.parseInt(nowUTC.split("-")[0] ?? "2024", 10);
      setName("");
      setDescription("");
      setStatus("planned");
      setStartDate(`${year}-01-01`);
      setEndDate(`${year}-12-31`);
      setProductId("");
    }
  }, [open]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setStatus("planned");
    setStartDate("");
    setEndDate("");
    setProductId("");
  };

  return {
    name,
    setName,
    description,
    setDescription,
    status,
    setStatus,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    productId,
    setProductId,
    resetForm,
  };
}

