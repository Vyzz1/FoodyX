import { Switch } from "@/components/ui/switch";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import React from "react";
import { toast } from "sonner";

interface ChangeActiveProps {
  id: string;
  isActive: boolean;
}

const ChangeActive: React.FC<ChangeActiveProps> = ({ isActive, id }) => {
  const [active, setActive] = React.useState(isActive);
  const axios = useAxiosPrivate({ type: "normal" });
  const [loading, setloading] = React.useState(false);

  const handleChange = async (checked: boolean) => {
    const toastId = toast.loading("Changing status...");
    
    try {
      setloading(true);
      setActive(checked);

      const response = await axios.patch(`/food/change-status/${id}`, {
        isActive: checked,
      });

      toast.dismiss(toastId);
      
      if (response.status === 200) {
        toast.success("Status changed successfully");
      } else {
        toast.error("Error while changing active state");
      }
    } catch (error) {
      console.error("Error changing active state:", error);
      
      toast.dismiss(toastId);
      
      toast.error("Error while changing active state");
      setActive(isActive);
    } finally {
      setloading(false);
    }
  };

  return (
    <Switch
      disabled={loading}
      checked={active}
      onCheckedChange={handleChange}
      id={id}
    />
  );
};

export default ChangeActive;