import PopularCard, { type Category } from "./Popular_Card";

const popularCategories: Category[] = [
  {
    name: "Educational Toys",
    icon: "🧠",
    description: "Boost learning with STEM, logic, and skill-building play.",
    slug: "educational-toys",
  },
  {
    name: "Soft Toys",
    icon: "🧸",
    description: "Cuddly companions for comfort, bedtime, and everyday hugs.",
    slug: "soft-toys",
  },
  {
    name: "Building Blocks",
    icon: "🧱",
    description: "Stack, click, and create — perfect for little builders.",
    slug: "building-blocks",
  },
  {
    name: "Vehicles",
    icon: "🚗",
    description: "From tiny cars to big trucks — zoom into imaginative play.",
    slug: "vehicles",
  },
  {
    name: "Role Play",
    icon: "🎭",
    description: "Costumes and pretend sets that spark storytelling fun.",
    slug: "role-play",
  },
  {
    name: "Puzzles",
    icon: "🧩",
    description: "Brain-boosting puzzles for focus, patience, and problem-solving.",
    slug: "puzzles",
  },
];

export default function PopularCategories() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-emerald-950">
            Popular Categories
          </h2>
          <p className="mt-2 max-w-2xl text-emerald-900/70">
            Explore favorites by category — find the perfect toy faster.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {popularCategories.map((category) => (
          <PopularCard key={category.slug} category={category} />
        ))}
      </div>
    </section>
  );
}
