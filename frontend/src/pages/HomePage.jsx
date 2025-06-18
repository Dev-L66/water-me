import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router";

const HomePage = () => {
  const queryClient = useQueryClient();
  const {
    data: allPlants,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["allPlants"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/plant/all-plants", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["allPlants"], (oldData) => {
        if (!oldData) return { plants: [data.newPlant] };
        return {
          ...oldData,
          plants: [data.newPlant, ...oldData.plants],
        };
      });
    },
  });
  const {mutate:waterPlant, isError: mutationIsError, error: mutationError, isPending} = useMutation({
    mutationFn: async (plantId)=>{
      try{
        const res = await fetch(`/api/plant/water/${plantId}`,{
          method: "GET",
          credentials:'include'
        });
console.log(res);
        const data =  await res.json();
        console.log(data);
        if(!res.ok){
          throw new Error(data.error || "Something went wrong!");
        }
        return data;

      }catch(error){
        console.error(error);
        throw error;
      }
    },
    onSuccess:()=>{
      toast.success("Plant watered");
    
    }
  })

  const handleWater = (plantId)=>{
    console.log(plantId);
    console.log("waterPlant");
    waterPlant(plantId);
  }

  const [countDown, setCountDown] = useState({});
  useEffect(() => {
    const now = new Date();
    const updatedCountdowns = {};
    const interval = setInterval(() => {
      allPlants?.plants?.map((plant) => {
        const futureDate = new Date(plant?.nextWateringDate);
        const diff = Math.floor(Math.max(0, futureDate - now) / 1000);

        const days = Math.floor(diff / 86400);
        const hours = Math.floor((diff % 86400) / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const secs = diff % 60;

        updatedCountdowns[
          plant._id
        ] = `${days}d ${hours}h ${minutes}m ${secs}s`;
      });
      setCountDown(updatedCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [allPlants?.plants.map((plant) => plant?.nextWateringDate)]);
  return (
    <div className="flex flex-col items-center justify-center ">
      {!isLoading && (
        <motion.h1
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.25, ease: "easeInOut" }}
          className="flex justify-center items-center font-caveat-brush  text-7xl p-5"
        >
          My Plants
        </motion.h1>
      )}
      {isLoading ? "Loading" : ""}
      {isError ? <p>{error.message}</p> : ""}
      {!allPlants || allPlants.length === 0 ? (
        <p>No plants found</p>
      ) : (
        <div className="flex justify-center  items-center font-roboto text-md flex-wrap container mx-auto gap-5">
          {allPlants.plants?.map((plant) => (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.25, ease: "easeInOut" }}
              className="flex shadow-lg shadow-green-900 bg-green-300 justiyfy-center items-center gap-2 rounded-2xl"
              key={plant._id}
            >
              <div className="flex flex-col justify-center items-center gap-2 w-80 p-3 overflow-hidden ">
                <img
                  src={plant?.image}
                  alt={plant?.name}
                  className="w-40 h-40 object-cover rounded-2xl "
                />
                <p className=" text-3xl font-caveat-brush ">
                  {plant?.name.toUpperCase()}
                </p>
                <p>
                  Last Watered At:{" "}
                  <span className="font-bold">
                    {new Date(plant?.lastWateredAt).toLocaleDateString()}
                  </span>
                </p>
                <div className="flex flex-col justify-center items-center">
                  <p>
                    Next Watering Date: <span className="font-bold">
                       {plant?.nextWateringDate
                        ? new Date(plant.nextWateringDate).toLocaleDateString()
                        : "Not Set"}
                    </span>
                  </p>
                  <p>Time for next watering: </p>
                  <span className="font-bold text-2xl">
                    {plant?.nextWateringDate ? countDown[plant._id] : "Not Set"}
                  </span>
                </div>
                <p>
                  Water Frequency:{" "}
                  <span className="font-bold">
                    {plant?.waterFrequency ? plant?.waterFrequency : "Not Set"}
                  </span>
                </p>
                <p>Water Status: <span className="font-bold">{plant?.watered === false && plant?.nextWateringDate <= new Date() ? "Due" : "Watered"}</span></p>
              <button onClick={()=> handleWater(plant._id)} className="bg-green-900 rounded-2xl p-2 cursor-pointer text-green-200">
                  Water Now
                </button>
              </div>
            </motion.div>
          ))}
          {mutationIsError ? <p>{mutationError.message}</p> : ""}
        </div>
      )}
    </div>
  );
};

export default HomePage;
