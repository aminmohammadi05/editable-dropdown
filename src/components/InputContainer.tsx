import styles from "../ReusableDropdown.module.scss";
import { useDropDown } from "../DropDownContext";

const InputContainer: React.FC<any> = ({ children }) => {
  const context = useDropDown();
  return (
    <div
      className={styles["input-container"]}
      onClick={() => {
        if (context?.inputRef.current) context?.inputRef.current.focus();
        context?.setIsOpen(true);
      }}
    >
      {children}
    </div>
  );
};

export default InputContainer;
