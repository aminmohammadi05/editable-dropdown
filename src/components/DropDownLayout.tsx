import styles from "../ReusableDropdown.module.scss";
import { useDropDown } from "../DropDownContext";
import DropDownItemsList from "./DropDownItemsList";
import EmojiDropDown from "./EmojiDropDown";

const DropDownLayout: React.FC<any> = ({ children }) => {
  const context = useDropDown();
  return (
    <div
      ref={context?.containerRef}
      className={styles["dropdown-container"]}
      style={{ position: "relative" }}
    >
      {children}
      {context?.isOpen && context?.items.length > 0 && <DropDownItemsList />}
      {context?.emojiDropdownOpen && <EmojiDropDown />}
    </div>
  );
};

export default DropDownLayout;
