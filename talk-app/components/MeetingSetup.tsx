"use client";

import { useUser } from "@clerk/nextjs";
import {
  DeviceSettings,
  useCall,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import Alert from "./Alert";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const { user } = useUser();
  if (!user) return;

  const call = useCall();
  if (!call) {
    throw new Error(
      "useStreamCall doit être utilisé dans un composant StreamCall."
    );
  }

  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const callTimeNotArrived =
    callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;
  const [isMicCamToggled, setIsMicCamToggled] = useState(false);

  useEffect(() => {
    if (isMicCamToggled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [isMicCamToggled, call.camera, call.microphone]);

  if (callTimeNotArrived)
    return (
      <Alert
        title={`Votre réunion n'a pas encore commencé. Elle est prévue pour ${callStartsAt.toLocaleString()}`}
      />
    );

  if (callHasEnded)
    return (
      <Alert
        title="L'appel a été terminé par l'hôte"
        iconUrl="/assets/call-ended.svg"
      />
    );

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-black">
      <h1 className="text-center text-2xl font-bold">Configuration de la réunion</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggled}
            onChange={(e) => setIsMicCamToggled(e.target.checked)}
          />
          Rejoignez-nous avec le micro et la caméra éteints
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="rounded-3xl bg-blue-500 p-6 hover:bg-blue-800 hover:scale-125 transition ease-in-out delay-150 duration-300"
        onClick={() => {
          call.join();
          call.updateCallMembers({
            update_members: [{ user_id: user.id }],
          });

          setIsSetupComplete(true);
        }}
      >
        Rejoindre la réunion
      </Button>
    </div>
  );
};

export default MeetingSetup;
