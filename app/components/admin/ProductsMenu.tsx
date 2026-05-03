import Link from "next/link";

const ProductsMenu = () => {
    return (
        <li>
            <Link
                href="/admin/products" className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Products"
            >
                {/* icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    fill="none"
                    stroke="currentColor"
                    className="my-1.5 inline-block size-4"
                >
                    <path d="M3 7l9 5l9-5"></path>
                    <path d="M3 7l9-5l9 5v10l-9 5l-9-5V7z"></path>
                    <path d="M12 12v10"></path>
                </svg>

                <span className="is-drawer-close:hidden">Products</span>
            </Link>
        </li>
    );
};

export default ProductsMenu;
