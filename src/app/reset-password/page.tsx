import { redirect } from "next/navigation";
import { AuthPasswordForm } from "@/components/auth-password-form";

type ResetPasswordPageProps = {
  searchParams?: Promise<{
    error_code?: string;
    error_description?: string;
  }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  if (resolvedSearchParams?.error_code === "otp_expired") {
    redirect("/?auth_view=forgot-password&reset=expired");
  }

  return (
    <AuthPasswordForm
      title="Reset Password"
      description="Choose a new password for your Excelora account."
      successMessage="Password updated. Redirecting to sign in..."
      redirectPath="/"
      signOutAfterSuccess
    />
  );
}
