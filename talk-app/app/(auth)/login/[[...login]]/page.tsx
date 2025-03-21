import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const LoginPage = () => {
  return (
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
          appearance={{
            baseTheme: dark,
          }}
        />
      </div>
    </main>
  );
};

export default LoginPage;
