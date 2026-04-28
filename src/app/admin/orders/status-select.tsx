"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED", "FAILED"];

export function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setUpdating(true);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Update failed");
      router.refresh();
    } catch (err) {
      console.error(err);
      setStatus(currentStatus); // revert on error
    } finally {
      setUpdating(false);
    }
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={updating}
      className={`text-xs eyebrow px-3 py-1.5 rounded-sm outline-none border transition-colors ${
        updating ? "opacity-50" : "opacity-100"
      } ${
        status === "PAID" ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/5" :
        status === "SHIPPED" ? "border-blue-500/30 text-blue-600 bg-blue-500/5" :
        status === "DELIVERED" ? "border-green-500/30 text-green-600 bg-green-500/5" :
        status === "CANCELLED" || status === "FAILED" ? "border-red-500/30 text-red-600 bg-red-500/5" :
        "border-amber-500/30 text-amber-600 bg-amber-500/5"
      }`}
    >
      {STATUSES.map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
