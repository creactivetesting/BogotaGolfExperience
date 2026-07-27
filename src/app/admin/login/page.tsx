import LoginForm from '@/components/admin/LoginForm';

export const metadata = {
  title: 'Admin Login | Bogotá Golf Experience',
  description: 'Private sign-in for the Bogotá Golf Experience admin dashboard.',
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-16 text-zinc-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-stretch">
        <section className="max-w-xl flex-1 rounded-3xl border border-zinc-800 bg-zinc-900/95 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">
            Private Area
          </p>
          <h1 className="text-4xl font-semibold sm:text-5xl">
            Admin Dashboard Access
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-300">
            Manage experiences, pricing, testimonials, and site content from a secure environment.
          </p>
          <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5 text-sm text-emerald-100">
            <p className="font-medium">Fixed super admin accounts enabled</p>
            <p className="mt-2">Use your registered super admin email and password.</p>
          </div>
        </section>

        <section className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900/95 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
