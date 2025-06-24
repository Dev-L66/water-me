import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();
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
    retry: false,
  });
  const {
    mutate: waterPlant,
    isPending: isWatering,
  } = useMutation({
    mutationFn: async (plantId) => {
      try {
        const res = await fetch(`/api/plant/water/${plantId}`, {
          method: "GET",
          credentials: "include",
        });
        console.log(res);
        const data = await res.json();
        console.log(data);
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: (plantId) => {
      toast.success("Plant watered");
      queryClient.setQueryData(["allPlants"], (oldData)=>{
        if(!oldData) return { plants: [] };
        return {...oldData, 
         plants: oldData.plants.filter((plant)=> plant._id === plantId)
        }
      });
       queryClient.invalidateQueries({ queryKey: ["allPlants"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    mutate: deletePlant,
    isPending: isDeleting,
    error: deleteError,
    isError: isDeletingError,
  } = useMutation({
    mutationFn: async (plantId) => {
      try {
        const res = await fetch(`api/plant/delete/${plantId}`, {
          method: "DELETE",
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
      toast.success("Plant deleted");
      queryClient.setQueryData(["allPlants"], (oldData) => {
        if (!oldData) return { plants: [] };
        return {
          ...oldData,
          plants: oldData.plants.filter(
            (plant) => plant._id !== data.deletedPlant._id
          ),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["allPlants"] });
    },
  });

  const handleDelete = (plantId) => {
    deletePlant(plantId);
  };
  const handleWater = (plantId) => {
    
    waterPlant(plantId);
    
  };

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
      {isError ? (
        <p className="text-5xl flex justify-center items-center">
          {error.message}
        </p>
      ) : (
        ""
      )}
      {!allPlants ||
        allPlants?.plants?.length === 0 ||
        (!isLoading && (
          <div className="flex justify-center  items-center font-caveat-brush text-md flex-wrap container mx-auto gap-5">
            {allPlants.plants?.map((plant) => (
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.25, ease: "easeInOut" }}
                className="flex shadow-lg shadow-green-900 bg-green-300 font-roboto justiyfy-center items-center gap-2 rounded-2xl"
                key={plant._id}
              >
                <div className="flex flex-col justify-center items-center gap-2 w-80 p-2 overflow-hidden ">
                  <img
                    src={plant?.image}
                    alt={plant?.name}
                    className="w-full h-40 object-cover rounded-2xl "
                  />
                  <p className=" text-3xl font-bold ">
                    {plant?.name.toUpperCase()}
                  </p>
                  <p>
                    Last Watered At:{" "}
                    <span className="font-bold">
                      {plant?.lastWateredAt
                        ? new Date(plant?.lastWateredAt).toLocaleDateString()
                        : new Date().toLocaleString().split(",")[0]}
                    </span>
                  </p>
                  <div className="flex flex-col justify-center items-center">
                    <p>
                      Next Watering Date:{" "}
                      <span className="font-bold">
                        {plant?.nextWateringDate
                          ? new Date(
                              plant.nextWateringDate
                            ).toLocaleDateString()
                          : "Not set"}
                        {/* {plant?.nextWateringDate &&
  new Date(plant.nextWateringDate).getTime() < Date.now()
    ? "Date should be in the future"
    : ""} */}
                      </span>
                    </p>
                    <p>Time for next watering: </p>
                    <span className="font-bold text-2xl">
                      {plant?.nextWateringDate
                        ? countDown[plant._id]
                        : "Not Set"}
                    </span>
                  </div>
                  <p>
                    Water Frequency:{" "}
                    <span className="font-bold">
                      {plant?.waterFrequency
                        ? plant?.waterFrequency
                        : "Not Set"}
                    </span>
                  </p>
                  <p>
                    Water Status:{" "}
                    <span className="font-bold">
                      {plant?.watered === false &&
                      plant?.nextWateringDate <= new Date()
                        ? "Due"
                        : "Watered"}
                    </span>
                  </p>
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => handleWater(plant._id)}
                      className={`bg-green-900 rounded-2xl p-2 cursor-pointer text-green-200 `}
                      disabled={isWatering === plant._id}
                    >
                      {isWatering === plant._id ? "Watering..." : "Water Plant"}
                    </button>
                    <button
                      className="bg-green-900 rounded-2xl p-2 cursor-pointer text-green-200"
                      onClick={() => navigate(`/edit-plant/${plant._id}`)}
                    >
                      Edit Plant
                    </button>
                    <button
                      onClick={() => handleDelete(plant._id)}
                      className="bg-green-900 rounded-2xl p-2 cursor-pointer text-green-200"
                      disabled={isDeleting === plant._id}
                    >
                      {isDeleting === plant._id ? "Deleting..." : "Delete Plant"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            
          </div>
        ))}
    </div>
  );
};

export default HomePage;
