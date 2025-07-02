import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { createPlantValidation } from "../../../backend/utils/lib/inputValidation/inputValidation";
import { z } from "zod/v4";
const CreatePlant = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [lastWateredAt, setLastWateredAt] = useState("");
  const [waterFrequency, setWaterFrequency] = useState(3);
  const [reminderEnabled, setReminderEnabled] = useState(true);

  const [errors, setErrors] = useState({});
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

  const handleWaterFrequencyChange = (e) =>
    setWaterFrequency(Number(e.target.value));

  const handleReminderEnabledChange = (e) =>
    setReminderEnabled(e.target.checked);

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
      reminderEnabled,
      waterFrequency,
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
            reminderEnabled,
            waterFrequency,
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
      setLastWateredAt("");
      navigate("/");
      queryClient.setQueryData(["allPlants"], (oldData) => {
        if (!oldData) return { plants: [data.newPlant] };
        return {
          ...oldData,
          plants: [data.newPlant, ...oldData.plants],
        };
      });
    },
    onError: () => {
      toast.error("Plant creation failed.");
    },
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        image,
        lastWateredAt,
        reminderEnabled,
      };

      if (waterFrequency) {
        console.log(waterFrequency);
        payload.waterFrequency = waterFrequency;
      }

      const result = createPlantValidation.safeParse(payload);
      if (!result.success) {
        const tree = z.treeifyError(result.error);
        setErrors(tree);
        return;
      }
      createPlant(payload);
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
              required
              maxLength={30}
              minLength={3}
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
              required
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
                {errors.lastWateredAt.name.errors[0]}
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
            <label htmlFor="reminderEnabled">Reminder Enabled:</label>
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
            {errors.properties?.reminderEnabled?.errors?.length > 0 && (
              <p className="text-red-500 text-xs font-roboto">
                {errors.properties.reminderEnabled.errors[0]}
              </p>
            )}
          </div>

          <button type="submit" disabled={isPending}>
            {isPending ? "Adding Plant..." : "Add Plant"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePlant;
