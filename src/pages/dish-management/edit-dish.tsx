import useFetchData from "@/hooks/useFetchData";
import { useParams } from "react-router-dom";
import DishForm from "../dishes-form";
import { AmberLoading } from "@/components/shared/amber-loading";

const EditDish = () => {
  const { id } = useParams<string>();

  const { data, isError, isLoading } = useFetchData(
    `/food/${id}`,
    "",
    "normal"
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <AmberLoading text="Loading dish..." size="md" />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading dish.</div>;
  }

  return (
    <DishForm
      initialData={{ ...data, categoryId: data.category.id }}
      isEdit={true}
      id={id}
    />
  );
};

export default EditDish;
