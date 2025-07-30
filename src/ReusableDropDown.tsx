import DropdownProps from "./DropDownProps";
import { DropDownProvider } from "./DropDownContext";
import DropDownLayout from "./components/DropDownLayout";
import InputContainer from "./components/InputContainer";
import Input from "./components/Input";

const ReusableDropdown: React.FC<DropdownProps> = ({
  initialItems = [],
  placeholder = "Add item...",
}) => {
  return (
    <DropDownProvider initialItems={initialItems}>
      <DropDownLayout>
        <InputContainer>
          <Input placeholder={placeholder} />
        </InputContainer>
      </DropDownLayout>
    </DropDownProvider>
  );
};

export default ReusableDropdown;
