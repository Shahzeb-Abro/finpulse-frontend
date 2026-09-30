import { getPotDetails } from "@/api/pot";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Pot } from "../pots/components";
import { PotTransactions } from "./components";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const PotDetails = () => {
  const potId = useParams().potId;
  const { data } = useQuery({
    queryKey: ["potDetails"],
    queryFn: () => getPotDetails(potId),
  });

  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-3" /> Go Back
        </Button>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row ">
        <div className="flex-1">
          <Pot pot={data?.data?.potResponse} />
        </div>

        <div className="flex-1">
          <PotTransactions potTransactions={data?.data?.potTransactions} />
        </div>
      </div>
    </div>
  );
};
