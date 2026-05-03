import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-white to-emerald-50">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-emerald-700">
            Safe • joyful • thoughtful
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-emerald-950 md:text-5xl">
            Toys that help little minds grow
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-emerald-900/70">
            Discover hand-picked toys for every age — from first shapes to big
            imagination builders.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/toys" className="btn btn-primary">
              Shop All Toys
            </Link>
            <Link href="/new-arrival" className="btn btn-ghost">
              New Arrival
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-3xl bg-emerald-200/40 blur-2xl" />
          <div className="overflow-hidden rounded-3xl border border-emerald-900/10 bg-white shadow-sm">
            <Image
              src="/hero_section.png"
              alt="Colorful toys illustration"
              width={900}
              height={700}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
