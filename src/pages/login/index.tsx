import useSetTitle from "@/hooks/useSetTitle";
import { LoginForm } from "./components/login-form";

const LoginPage = () => {
  useSetTitle("Login");
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 bg-gradient-to-b from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
