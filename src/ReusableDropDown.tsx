import DropdownProps from "./DropDownProps";
import { DropDownProvider } from "./DropDownContext";
import DropDownLayout from "./components/DropDownContainer/DropDownLayout";
import InputContainer from "./components/InputContainer/InputContainer";
import Input from "./components/DropDownInput/Input";

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
