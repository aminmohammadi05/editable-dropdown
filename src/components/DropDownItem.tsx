import styles from "../ReusableDropdown.module.scss";
import { useDropDown } from "../DropDownContext";

const DropDownItem: React.FC<any> = ({ item, index, isSelected }) => {
  const context = useDropDown();
  return (
    <li
      key={index}
      onClick={() => context?.toggleSelection(item)}
      className={`${styles["dropdown-list-item"]} ${
        isSelected ? styles.selected : ""
      }`}
      onMouseDown={(e) => e.preventDefault()}
    >
      <span>{item}</span>
      {isSelected && <span className={styles.checkmark}>✓</span>}
    </li>
  );
};

export default DropDownItem;
