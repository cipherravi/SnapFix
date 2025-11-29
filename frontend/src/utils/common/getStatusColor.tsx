const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "initiated":
      return "text-orange-500";
    case "pending":
      return "text-amber-500";
    case "assigned":
      return "text-amber-600";
    case "started":
      return "text-sky-500";
    case "completed":
      return "text-emerald-500";
    case "success":
      return "text-emerald-600";
    case "approved":
      return "text-blue-600";
    case "cancelled":
      return "text-rose-500";
    case "failed":
      return "text-rose-600";
    case "refunded":
      return "text-purple-500";
    default:
      return "text-blue-400";
  }
};
export default getStatusColor;
