const getStatusColor = (status: string) => {
  switch (status) {
    case "assigned":
      return "text-amber-500";
    case "started":
      return "text-sky-500";
    case "completed":
      return "text-emerald-500";
    case "approved":
      return "text-[#24b9ff]";
    case "cancelled":
      return "text-rose-500";
    default:
      return "text-blue-400";
  }
};
export default getStatusColor;
