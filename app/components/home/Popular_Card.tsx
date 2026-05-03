export type Category = {
  name: string;
  description: string;
  icon: string;
  slug: string;
};

type Props = {
  category: Category;
};

export default function PopularCard({ category }: Props) {
  return (
    <div className="card bg-base-100 shadow-sm ring-1 ring-emerald-900/10">
      <div className="card-body items-center text-center">
        <div className="text-4xl leading-none">{category.icon}</div>
        <h3 className="mt-2 text-lg font-semibold text-emerald-950">
          {category.name}
        </h3>
        <p className="text-sm text-emerald-900/70">{category.description}</p>
      </div>
    </div>
  );
}
