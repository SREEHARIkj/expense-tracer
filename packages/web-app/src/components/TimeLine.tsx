import { ExpenseType, IncomeType } from "@/lib/types";

type Props = {
  listData: { [key: string]: Array<IncomeType | ExpenseType> } | undefined;
};

const TimeLine = ({ listData }: Props) => {
  // Todo : need to return component on no data
  if (!listData) return <div>No Data</div>;

  return (
    <>
      {Object.entries(listData).map(([key, value]) => (
        <div className="grid grid-cols-4 gap-4 px-3 py-2 relative">
          <div className="absolute -z-10 top-2 bottom-0 left-[19%] w-1 bg-black" />
          <div className="col-span-1 flex items-start justify-center">
            <div className="z-10 border-black border-2 p-2 bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0,0.8)]">
              {key}
            </div>
          </div>
          <div className="row-start-2  col-start-2 col-span-3 flex flex-col gap-2">
            {value?.map((transaction, index) => (
              <div className={`flex flex-col gap-2 border-black border-2 p-5 `}>
                <div
                  className={`${transaction.type === "credit" ? "text-red-500" : "text-green-500"}`}
                >
                  {transaction.type.toUpperCase()}
                </div>
                <div
                  key={`${transaction.date}-${index}`}
                  className="font-manrope font-semibold "
                >
                  $ {transaction.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default TimeLine;
