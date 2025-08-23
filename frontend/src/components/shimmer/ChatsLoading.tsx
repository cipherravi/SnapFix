const ChatsLoading = () => {
  return (
    <div className="w-full h-18 rounded-2xl bg-[#dadada] shimmer flex ">
      <div className="shrink-0 w-20 flex justify-center items-center ">
        <div className="w-12 h-12 rounded-full bg-[#ababab] "></div>
      </div>
      <div className="shrink w-full flex flex-col gap-4 justify-center">
        <div className="w-1/3 h-3 bg-[#ababab]"></div>
        <div className="w-1/2 h-3 bg-[#ababab]"></div>
      </div>
    </div>
  );
};

export default ChatsLoading;
