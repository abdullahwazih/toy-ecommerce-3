import EditProductForm from "@/app/components/admin/EditProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-6">
      <EditProductForm productId={id} />
    </div>
  );
}
