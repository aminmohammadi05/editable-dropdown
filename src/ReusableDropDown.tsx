import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import DropdownProps from "./DropDownProps";
import styles from "./ReusableDropdown.module.scss";

const ReusableDropdown: React.FC<DropdownProps> = ({
  initialItems = [],
  placeholder = "Add item...",
}) => {
  const [items, setItems] = useState<string[]>(initialItems);
  const [inputValue, setInputValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newItem = inputValue.trim();
      if (!items.includes(newItem)) {
        setItems((prev) => [...prev, newItem]);
      }
      if (!selectedItems.includes(newItem)) {
        setSelectedItems((prev) => [...prev, newItem]);
      }
      setInputValue("");
      setIsOpen(true);
      e.preventDefault();
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      selectedItems.length > 0
    ) {
      // Remove last selected item on Backspace when input empty
      setSelectedItems((prev) => prev.slice(0, prev.length - 1));
    }
  };

  const toggleSelection = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
    setIsOpen(true);
    if (inputRef.current) inputRef.current.focus();
  };

  const removeBadge = (item: string) => {
    setSelectedItems(selectedItems.filter((i) => i !== item));
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div ref={containerRef} className={styles["dropdown-container"]}>
      <div
        className={styles["input-container"]}
        onClick={() => {
          if (inputRef.current) inputRef.current.focus();
          setIsOpen(true);
        }}
      >
        {selectedItems.map((item) => (
          <div key={item} className={styles.badge}>
            {item}
            <button
              type="button"
              className={styles.removeBtn}
              onClick={(e) => {
                e.stopPropagation();
                removeBadge(item);
              }}
              aria-label={`Remove ${item}`}
            >
              ×
            </button>
          </div>
        ))}

        <input
          ref={inputRef}
          type="text"
          className={styles["dropdown-input"]}
          placeholder={selectedItems.length === 0 ? placeholder : ""}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
        />
        <span className={`${styles.arrow} ${isOpen ? styles.open : ""}`} />
      </div>

      {isOpen && items.length > 0 && (
        <ul className={styles["dropdown-list"]}>
          {items.map((item, index) => {
            const isSelected = selectedItems.includes(item);
            return (
              <li
                key={index}
                onClick={() => toggleSelection(item)}
                className={`${styles["dropdown-list-item"]} ${
                  isSelected ? styles.selected : ""
                }`}
                onMouseDown={(e) => e.preventDefault()}
              >
                <span>{item}</span>
                {isSelected && <span className={styles.checkmark}>✓</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ReusableDropdown;
