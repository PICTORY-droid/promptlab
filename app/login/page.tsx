import LoginForm from "./_components/LoginForm.client";

export default function LoginPage() {
  return (
    <main className="bg-slate-50 px-6 pb-28 pt-6 sm:py-12">
      <section className="mx-auto max-w-md">
        <LoginForm />
      </section>
    </main>
  );
}