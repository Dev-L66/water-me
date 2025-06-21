import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
const CreatePlant = () => {
  const queryClient = useQueryClient();
const navigate = useNavigate();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [lastWateredAt, setLastWateredAt] = useState("");
  const [waterFrequency, setWaterFrequency] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState("");
  const [nextWateringDate, setNextWateringDate] = useState("");

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
    mutate: createPlant,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({
      name,
      image,
      lastWateredAt,
      // waterFrequency,
      reminderEnabled,
      reminderTime,
      // nextWateringDate,
    }) => {
      try {
        const res = await fetch("/api/plant/create-plant", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            image,
            lastWateredAt,
            // waterFrequency,
            reminderEnabled,
            reminderTime,
            // nextWateringDate,
          }),
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
      toast.success("Plant created successfully.");
      setName("");
      setImage("");
      setReminderEnabled(true);
      setReminderTime("");
      setLastWateredAt("");
      navigate("/");
      queryClient.setQueryData(["allPlants"], (oldData) => {
        if (!oldData) return { plants: [data.newPlant] };
        return {
           ...oldData,
          plants: [data.newPlant, ...oldData.plants ],
         
        };
      });
    },
    onError: () => {
      toast.error("Plant creation failed.");
    },
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    try{
 const payload =({
      name,
      image,
      lastWateredAt,
      // waterFrequency,
      reminderEnabled,
      reminderTime,
    });

    if(waterFrequency){
      payload.waterFrequency = waterFrequency;
    }

    if(nextWateringDate){
      payload.nextWateringDate = nextWateringDate;
    }

    createPlant(payload);
    }catch(error){
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
          {isError && <p className="text-red-500">{error.message}</p>}
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
              value={reminderEnabled}
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

          <button type="submit" disabled={isPending}>{isPending ? "Adding Plant..." : "Add Plant"}</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePlant;
