import { AuthPasswordForm } from "@/components/auth-password-form";

export default function ResetPasswordPage() {
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
