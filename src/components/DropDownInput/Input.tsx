import styles from "./Input.module.scss";
import { useDropDown } from "../../DropDownContext";

const Input: React.FC<any> = ({ children, placeholder }) => {
  const context = useDropDown();
  return (
    <>
      {context?.selectedItems.map((item: string) => (
        <div key={item} className={styles.badge}>
          {item}
          <button
            type="button"
            className={styles.removeBtn}
            onClick={(e) => {
              e.stopPropagation();
              context?.removeBadge(item);
            }}
            aria-label={`Remove ${item}`}
          >
            ×
          </button>
        </div>
      ))}

      <input
        ref={context?.inputRef}
        type="text"
        className={styles["dropdown-input"]}
        placeholder={context?.selectedItems.length === 0 ? placeholder : ""}
        value={context?.inputValue}
        onChange={context?.handleInputChange}
        onKeyDown={context?.handleKeyDown}
        onFocus={() => context?.setIsOpen(true)}
        autoComplete="off"
        spellCheck="false"
      />
      <span
        className={`${styles.arrow} ${context?.isOpen ? styles.open : ""}`}
      />
    </>
  );
};

export default Input;
