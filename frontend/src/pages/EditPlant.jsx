import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
const EditPlant = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { plantId } = useParams();
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
  const plant = allPlants?.plants?.find((plant) => plant._id === plantId);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [lastWateredAt, setLastWateredAt] = useState("");
  const [waterFrequency, setWaterFrequency] = useState(3);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("");
  const [nextWateringDate, setNextWateringDate] = useState("");

  useEffect(() => {
    if (plant) {
      setName(plant.name || "");
      setImage(plant.image || "");
      setLastWateredAt(plant.lastWateredAt?.slice(0, 10) || "" || "");
      setWaterFrequency(plant.waterFrequency || 3);
      setReminderEnabled(plant.reminderEnabled || true);
      setReminderTime(plant.reminderTime?.slice(0, 10) || "");
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

  const handleReminderTimeChange = (e) => setReminderTime(e.target.value);

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
      queryClient.setQueryData(["allPlants"],(oldData)=>{
       return {
        ...oldData,
        plants: oldData.plants.map((plant)=>{
          if(plant._id === plantId){
            return{
              ...plant,
              name,
              image,
              lastWateredAt,
              waterFrequency,
              reminderEnabled,
              reminderTime,
              nextWateringDate
            }
          }
          return plant;
        })
       }
      });
      toast.success("Plant edited successfully!");
      navigate("/");
    },
  });

  const handleEdit = (plantId, data ) => {
    editPlant({plantId, data});
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    try {
      const data = {
        name,
        image,
        lastWateredAt,
        waterFrequency,
        reminderEnabled,
        reminderTime,
        nextWateringDate,
      };
      handleEdit(plantId, data);
      
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
            />
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
          </div>

          <div className="flex w-full">
            <label htmlFor="reminderEnabled">Reminder Enabled:</label>
            <input
              type="checkbox"
              className="rounded-md h-10 focus:outline-none bg-green-300 p-2"
              placeholder="Enter "
              id="reminderEnabled"
              name="reminderEnabled"
              checked={reminderEnabled}
              onChange={handleReminderEnabledChange}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="reminderTime">Reminder Date: </label>
            <input
              type="date"
              className="rounded-md h-10 focus:outline-none bg-green-300 p-2"
              placeholder="Enter "
              id="reminderTime"
              name="reminderTime"
              value={reminderTime}
              onChange={handleReminderTimeChange}
            />
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
