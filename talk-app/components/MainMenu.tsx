"use client";

import { useRouter } from "next/navigation";
import MenuItemCard from "./MenuItemCard";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import DatePicker from "react-datepicker";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import Loading from "./Loading";
import { toast } from "sonner";

const initialValues = {
  dateTime: new Date(),
  description: "",
  link: "",
};

const MainMenu = () => {
  const { user } = useUser();
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [meetingState, setMeetingState] = useState<
    "Schedule" | "Instant" | undefined
  >(undefined);
  const client = useStreamVideoClient();

  const createMeeting = async () => {
    if (!user) return router.push("/login");
    if (!client) return router.push("/");

    try {
      if (!values.dateTime) {
        toast("Veuillez sélectionner une date et une heure", {
          duration: 3000,
          className: "bg-gray-300 rounded-3xl py-8 px-5 justify-center",
        });
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call("default", id);
      if (!call) throw new Error("Échec de la création de la réunion");
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Aucune description";
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      await call.updateCallMembers({
        update_members: [{ user_id: user.id }],
      });

      if (meetingState === "Instant") {
        router.push(`/meeting/${call.id}`);
        toast("Organiser votre réunion", {
          duration: 3000,
          className: "!bg-gray-300 !rounded-3xl !py-8 !px-5 !justify-center",
        });
      }

      if (meetingState === "Schedule") {
        router.push("/upcoming");
        toast(`Votre réunion est prévue à ${values.dateTime}`, {
          duration: 5000,
          className: "!bg-gray-300 !rounded-3xl !py-8 !px-5 !justify-center",
        });
      }
    } catch (err: any) {
      toast(`Échec de la création de la réunion ${err.message}`, {
        duration: 3000,
        className: "!bg-gray-300 !rounded-3xl !py-8 !px-5 !justify-center",
      });
    }
  };

  useEffect(() => {
    if (meetingState) {
      createMeeting();
    }
  }, [meetingState]);

  if (!client || !user) return <Loading />

  return (
    <section className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
      <Dialog>
        <DialogTrigger>
          <MenuItemCard
            img="/assets/new-meeting.svg"
            title="Nouvelle réunion"
            bgColor="bg-orange-500"
            hoverColor="hover:bg-orange-800"
          />
        </DialogTrigger>
        <DialogContent className=" bg-gray-200 px-16 py-10 text-gray-900 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black leading-relaxed text-center ">
              Démarrer une réunion instantanée 🤝
            </DialogTitle>
            <DialogDescription className="flex flex-col items-center ">
              Ajouter une description de réunion
              <Textarea
                className="inputs p-5"
                rows={4}
                onChange={(e) =>
                  setValues({ ...values, description: e.target.value })
                }
              />
              <Button
                className="mt-5 font-extrabold text-lg text-white rounded-xl bg-blue-700 py-5 px-10 hover:bg-blue-900 hover:scale-110 transition ease-in-out delay-75 duration-700 hover:-translate-y-1 cursor-pointer"
                onClick={() => setMeetingState("Instant")}
              >
                Créer une réunion
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger>
          <MenuItemCard
            img="/assets/join-meeting.svg"
            title="Joindre une réunion"
            bgColor="bg-blue-600"
            hoverColor="hover:bg-blue-800"
          />
        </DialogTrigger>
        <DialogContent className=" bg-gray-200 px-16 py-10 text-gray-900 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black leading-relaxed text-center mb-5 ">
              Tapez le lien de la réunion ici
            </DialogTitle>
            <DialogDescription className="flex flex-col gap-3 items-center">
              <Input
                type="text"
                placeholder="Lien de la réunion"
                onChange={(e) => setValues({ ...values, link: e.target.value })}
                className="inputs"
              />

              <Button
                className="mt-5 font-extrabold text-lg text-white rounded-xl bg-blue-700 py-5 px-10 hover:bg-blue-900 hover:scale-110 transition ease-in-out delay-75 duration-700 hover:-translate-y-1 cursor-pointer"
                onClick={() => router.push(values.link)}
              >
                Rejoindre la réunion
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger>
          <MenuItemCard
            img="/assets/calendar.svg"
            title="Calendrier"
            bgColor="bg-blue-600"
            hoverColor="hover:bg-blue-800"
          />
        </DialogTrigger>
        <DialogContent className=" bg-gray-200 px-16 py-10 text-gray-900 !rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black leading-relaxed text-center mb-5 ">
              Planifier une réunion
            </DialogTitle>
            <DialogDescription className="flex flex-col gap-3">
              Ajouter une description de réunion
              <Textarea
                className="inputs p-5"
                rows={4}
                onChange={(e) =>
                  setValues({ ...values, description: e.target.value })
                }
              />
            </DialogDescription>
            <div className="flex w-full flex-col gap-2.5">
              <label className="text-base font-normal leading-[22.4px] text-sky-2">
                Sélectionnez la date et l'heure
              </label>
              <DatePicker
                preventOpenOnFocus
                selected={values.dateTime}
                onChange={(date) => setValues({ ...values, dateTime: date! })}
                showTimeSelect
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="inputs w-full rounded p-2 focus:outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-200  "
              />
            </div>
            <Button
              className="!mt-5 font-extrabold text-lg text-white rounded-xl bg-blue-700 py-5 px-10 hover:bg-blue-900 hover:scale-110 transition ease-in-out delay-75 duration-700 hover:-translate-y-1 cursor-pointer"
              onClick={() => setMeetingState("Schedule")}
            >
              Valider
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <MenuItemCard
        img="/assets/recordings2.svg"
        title="Enregistrements"
        bgColor="bg-blue-600"
        hoverColor="hover:bg-blue-800"
        handleClick={() => router.push("/recordings")}
      />
    </section>
  );
};

export default MainMenu;
