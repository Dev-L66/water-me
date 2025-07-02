import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { createPlantValidation } from "../../../backend/utils/lib/inputValidation/inputValidation";
import { z } from "zod/v4";
const EditPlant = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { plantId } = useParams();
  const { data: allPlants } = useQuery({
    queryKey: ["allPlants"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/plant/all-plants", {
          method: "GET",
          credentials: "include",
        });
        const response = await res.json();
        if (!res.ok) {
          throw new Error(response.error || "Something went wrong!");
        }
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: (response) => {
      queryClient.setQueryData(["allPlants"], (oldData) => {
        if (!oldData) return { plants: [response.newPlant] };
        return {
          ...oldData,
          plants: [response.newPlant, ...oldData.plants],
        };
      });
    },
    retry: false,
  });
  const plant = allPlants?.plants?.find((plant) => plant._id === plantId);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [lastWateredAt, setLastWateredAt] = useState("");
  const [waterFrequency, setWaterFrequency] = useState(3);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [nextWateringDate, setNextWateringDate] = useState("");
  const [errors, setErrors] = useState({});
 
  useEffect(() => {
    if (plant) {
      setName(plant.name || "");
      setImage(plant.image || "");
      setLastWateredAt(plant.lastWateredAt?.slice(0, 10) || "" || "");
      setWaterFrequency(plant.waterFrequency || 3);
      setReminderEnabled(plant.reminderEnabled || true);
      setNextWateringDate(plant.nextWateringDate?.slice(0, 10) || "");
    }
  }, [plant]);

  const handleInputNameChange = (e) => setName(e.target.value);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLastWateredAtChange = (e) => setLastWateredAt(e.target.value);

  const handleWaterFrequencyChange = (e) => setWaterFrequency(e.target.value);

  const handleReminderEnabledChange = (e) =>
    setReminderEnabled(e.target.checked);


  const handleNextWateringDateChange = (e) =>
    setNextWateringDate(e.target.value);

  const {
    mutate: editPlant,
    isPending: isEditing,
    isError: isEditingError,
    error: editError,
  } = useMutation({
    mutationFn: async ({ plantId, data }) => {
      try {
        const res = await fetch(`/api/plant/edit/${plantId}`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const response = await res.json();
        if (!res.ok) {
          throw new Error(response.error || "Something went wrong!");
        }
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: (plantId) => {
      queryClient.invalidateQueries({ queryKey: ["allPlants"] });
      queryClient.setQueryData(["allPlants"], (oldData) => {
        return {
          ...oldData,
          plants: oldData.plants.map((plant) => {
            if (plant._id === plantId) {
              return {
                ...plant,
                name,
                image,
                lastWateredAt,
                waterFrequency,
                reminderEnabled,
                nextWateringDate,
              };
            }
            return plant;
          }),
        };
      });
      toast.success("Plant edited successfully!");
      navigate("/");
    },
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    try {
      const data = {
        name,
        image,
        lastWateredAt,
        waterFrequency,
        reminderEnabled,
        nextWateringDate,
      };
      const result = createPlantValidation.safeParse(data);
      if (!result.success) {
        const tree = z.treeifyError(result.error);
        console.log(tree);
        setErrors(tree);
        return;
      }
      editPlant({ plantId, data });
      setErrors({});
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form
        onSubmit={handleFormSubmit}
        className="p-5 max-w-3xl mx-auto flex flex-col gap-5"
      >
        <div className="flex flex-col justify-center items-center p-5">
          <h1 className="text-5xl font-caveat-brush ">Add your Plant</h1>
          {isEditingError && (
            <p className="text-red-500">{editError.message}</p>
          )}
          <div className="w-full flex flex-col">
            <label htmlFor="name">Name: </label>
            <input
              className="rounded-md h-10 focus:outline-none bg-green-300 p-2"
              type="text"
              placeholder="Enter the name of your plant"
              id="name"
              name="name"
              value={name}
              onChange={handleInputNameChange}
              minLength={3}
              maxLength={30}
            />
            {errors.properties?.name?.errors?.length > 0 && (
              <p className="text-red-500 text-xs font-roboto">
                {errors.properties.name.errors[0]}
              </p>
            )}
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="image">Image: </label>
            <input
              type="file"
              className="rounded-md h-10 focus:outline-none bg-green-300 p-2"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {errors.properties?.image?.errors?.length > 0 && (
              <p className="text-red-500 text-xs font-roboto">
                {errors.properties.image.errors[0]}
              </p>
            )}
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="lastWateredAt">Last Watered At: </label>
            <input
              type="date"
              className="rounded-md h-10 focus:outline-none bg-green-300 p-2"
              placeholder="Enter the name of your plant"
              id="lastWateredAt"
              name="lastWateredAt"
              value={lastWateredAt}
              onChange={handleLastWateredAtChange}
            />
            {errors.properties?.lastWateredAt?.errors?.length > 0 && (
              <p className="text-red-500 text-xs font-roboto">
                {errors.properties.lastWateredAt.errors[0]}
              </p>
            )}
          </div>
          <div className="flex flex-col w-full">
            <label className="w-full" htmlFor="waterFrequency">
              Water Frequency in days:{" "}
            </label>
            <input
              type="number"
              className="rounded-md h-10 focus:outline-none bg-green-300 p-2"
              placeholder="Enter water frequency in days"
              id="waterFrequency"
              name="waterFrequency"
              value={waterFrequency}
              onChange={handleWaterFrequencyChange}
            />
            {errors.properties?.waterFrequency?.errors?.length > 0 && (
              <p className="text-red-500 text-xs font-roboto">
                {errors.properties.waterFrequency.errors[0]}
              </p>
            )}
          </div>

          

          <div className="w-full flex gap-2 p-1">
            <label htmlFor="reminderEnabled">
              Reminder Enabled:
               </label>
              <input
                type="checkbox"
                className="rounded-full hidden focus:outline-none p-2"
                placeholder="Enter "
                id="reminderEnabled"
                name="reminderEnabled"
                checked={reminderEnabled}
                onChange={handleReminderEnabledChange}
              />
              <div
            className={`${
              reminderEnabled ? "bg-green-900" : "bg-red-900"
            } h-5 w-10  rounded-full`}
            onClick={() => setReminderEnabled(!reminderEnabled)}
          >
            <div
              className={`${
                reminderEnabled
                  ? "bg-green-900 transition-transform delay-100 translate-x-5"
                  : "transition-transform delay-100 translate-x-0 bg-red-900"
              } rounded-full h-5 w-5 border-2  bg-white`}
            ></div>
          </div>
           
          </div>

          <div className="flex flex-col w-full">
            <label className="w-full" htmlFor="nextWateringDate">
              Next Watering Date:{" "}
            </label>
            <input
              type="date"
              className="rounded-md h-10 focus:outline-none bg-green-300 p-2"
              placeholder="Enter next watering date"
              id="nextWateringDate"
              name="nextWateringDate"
              value={nextWateringDate}
              onChange={handleNextWateringDateChange}
            />
            {errors.properties?.nextWateringDate?.errors?.length > 0 && (
              <p className="text-red-500 text-xs font-roboto">
                {errors.properties.nextWateringDate.errors[0]}
              </p>
            )}
          </div>

          <button disabled={isEditing}>
            {isEditing ? "Editing..." : "Edit Plant"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPlant;
