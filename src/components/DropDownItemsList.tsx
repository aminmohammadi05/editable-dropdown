import styles from "../ReusableDropdown.module.scss";
import { useDropDown } from "../DropDownContext";
import DropDownItem from "./DropDownItem";

const DropDownItemsList: React.FC<any> = () => {
  const context = useDropDown();
  return (
    <ul className={styles["dropdown-list"]}>
      {context?.items.map((item: string, index: number) => {
        const isSelected = context?.selectedItems.includes(item);
        return (
          <DropDownItem index={index} item={item} isSelected={isSelected} />
        );
      })}
    </ul>
  );
};

export default DropDownItemsList;
