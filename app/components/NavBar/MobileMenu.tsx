import Link from "next/link";

const navItems = [
  { href: "/toys", label: "All Toys" },
  { href: "/new-arrival", label: "New Arrival" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact", label: "Contact" },
] as const;

export default function MobileMenu() {
  return (
    <div className="dropdown lg:hidden">
      
      <button tabIndex={0} className="btn btn-ghost">
        ☰
      </button>

      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 mt-3 w-52 p-2 shadow rounded-box"
      >
        {navItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}