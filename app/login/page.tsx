import LoginForm from "./_components/LoginForm.client";

export default function LoginPage() {
  return (
    <main className="bg-slate-50 px-4 pb-4 pt-3 sm:py-12">
      <section className="mx-auto max-w-md">
        <LoginForm />
      </section>
    </main>
  );
}