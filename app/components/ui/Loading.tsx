type LoadingProps = {
    text?: string;
    fullScreen?: boolean;
    size?: "sm" | "md" | "lg";
};

export default function Loading({
    text = "Loading...",
    fullScreen = false,
    size = "md",
}: LoadingProps) {

    
    const sizeClasses = {
        sm: "w-5 h-5 border-2",
        md: "w-8 h-8 border-2",
        lg: "w-12 h-12 border-3",
    };

    return (
        <div
            className={
                fullScreen
                    ? "min-h-screen flex items-center justify-center bg-gray-50"
                    : "flex items-center justify-center"
            }
        >
            <div className="flex flex-col items-center gap-3">
                <div
                    className={`
            rounded-full border-indigo-500 border-t-transparent animate-spin
            ${sizeClasses[size]}
          `}
                />

                {text && (
                    <p className="text-sm text-gray-500 tracking-wide">{text}</p>
                )}
            </div>
        </div>
    );
}