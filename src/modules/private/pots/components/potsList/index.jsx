import { getAllPots } from "@/api/pot";
import { Pot } from "..";
import { useQuery } from "@tanstack/react-query";

export const PotsList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["pots"],
    queryFn: getAllPots,
  });

  const pots = data?.data?.content || [];
  console.log("Fetched pots:", pots);
  return (
    <div className="flex flex-col gap-6 lg:grid grid-cols-2">
      {pots?.map((pot) => (
        <Pot key={pot.id} pot={pot} />
      ))}
    </div>
  );
};
