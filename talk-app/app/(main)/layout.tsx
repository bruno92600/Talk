import StreamProvider from "@/providers/StreamProviders";
import { SignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { dark } from "@clerk/themes";
import React from "react";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {

    const user = await currentUser();
    if (!user) return (
        <main className="flex flex-col items-center p-5 gap-10 animate-fade-in">
          <section className="flex flex-col items-center">
            <h1 className="text-lg font-extrabold lg:text-4xl text-purple-300">
              TallK,
            </h1>
            <h1 className="text-lg font-extrabold lg:text-3xl text-purple-500">
              Connectez-vous, communiquez en temps réel.
            </h1>
          </section>
    
          <div className="mt-3">
            <SignIn
            routing="hash"
              appearance={{
                baseTheme: dark,
              }}
            />
          </div>
        </main>
      );

  return (
    <main className="animate-fade-in">
        <StreamProvider>
        {children}
        </StreamProvider>
    </main>
  );
};

export default MainLayout;
