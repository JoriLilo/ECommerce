import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { login } from "../../services/authService";
import { saveAuth } from "../../utils/auth";
import AuthLayout from "../../components/common/AuthLayout";
import FormField from "../../components/common/FormField";
import ErrorMessage from "../../components/common/ErrorMessage";
import SubmitButton from "../../components/ui/SubmitButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    login({ email, password })
      .then((data) => {
        saveAuth(data);
        if (data.user.role === "ADMIN") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/";
        }
      })
      .catch((err: unknown) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <AuthLayout
      topText="Welcome back"
      title={
        <>
          Login<span className="auth-dot">.</span>
        </>
      }
      subtitle="Enter your credentials to access your account."
      onSubmit={handleSubmit}
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Create account
          </Link>
        </>
      }
    >
      <FormField
        label="Email address"
        type="email"
        value={email}
        placeholder="you@example.com"
        onChange={setEmail}
      />
      <FormField
        label="Password"
        type="password"
        value={password}
        placeholder="Enter your password"
        onChange={setPassword}
      />
      <ErrorMessage message={error} />
      <SubmitButton
        loading={loading}
        text="Sign in"
        loadingText="Logging in..."
      />
    </AuthLayout>
  );
}
