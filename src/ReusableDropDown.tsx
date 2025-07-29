import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import DropdownProps from "./DropDownProps";
import styles from "./ReusableDropdown.module.scss";

const emojiList = [
  "🔥",
  "⭐",
  "🍀",
  "🎉",
  "❤️",
  "😊",
  "🚀",
  "💡",
  "😂",
  "😎",
  "🤖",
  "🌟",
];

const emojiName = (emoji: string) => {
  switch (emoji) {
    case "🔥":
      return "fire";
    case "⭐":
      return "star";
    case "🍀":
      return "clover";
    case "🎉":
      return "party";
    case "❤️":
      return "heart";
    case "😊":
      return "smile";
    case "🚀":
      return "rocket";
    case "💡":
      return "idea";
    case "😂":
      return "joy";
    case "😎":
      return "cool";
    case "🤖":
      return "robot";
    case "🌟":
      return "sparkle";
    default:
      return "";
  }
};

const ReusableDropdown: React.FC<DropdownProps> = ({
  initialItems = [],
  placeholder = "Add item...",
}) => {
  const [items, setItems] = useState<string[]>(initialItems);
  const [inputValue, setInputValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Emoji picker state
  const [emojiDropdownOpen, setEmojiDropdownOpen] = useState(false);
  const [filteredEmojis, setFilteredEmojis] = useState<string[]>(emojiList);
  const [emojiFilterText, setEmojiFilterText] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setEmojiDropdownOpen(false);
        setEmojiFilterText("");
        setFilteredEmojis(emojiList);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close emoji dropdown on Escape key
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && emojiDropdownOpen) {
        setEmojiDropdownOpen(false);
        setEmojiFilterText("");
        setFilteredEmojis(emojiList);
        if (inputRef.current) inputRef.current.focus();
      }
    }
  }, [emojiDropdownOpen]);

  // Insert emoji at cursor helper
  function insertAtCursor(input: HTMLInputElement, textToInsert: string) {
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const value = input.value;
    const newValue =
      value.substring(0, start) + textToInsert + value.substring(end);
    setTimeout(() => {
      input.selectionStart = input.selectionEnd = start + textToInsert.length;
    }, 0);
    return newValue;
  }

  // Handle input change (also filter emojis if emoji picker open)
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setIsOpen(true);

    // If emoji picker is open and user types, filter emojis by text after last ':'
    if (emojiDropdownOpen) {
      const colonIndex = val.lastIndexOf(":");
      if (colonIndex !== -1 && val.length > colonIndex + 1) {
        const query = val.substring(colonIndex + 1).toLowerCase();
        setEmojiFilterText(query);
        const filtered = emojiList.filter((emoji) =>
          emojiName(emoji).includes(query)
        );
        setFilteredEmojis(filtered.length > 0 ? filtered : emojiList);
      } else {
        setEmojiFilterText("");
        setFilteredEmojis(emojiList);
      }
    }
  };

  // Handle keydown for adding items, backspace, and emoji picker shortcut
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (emojiDropdownOpen) {
      // If emoji picker open, handle navigation or selection (optional)
      if (e.key === "Enter") {
        // For simplicity, select first emoji in filtered list on Enter
        if (filteredEmojis.length > 0 && inputRef.current) {
          e.preventDefault();
          const emoji = filteredEmojis[0];
          const input = inputRef.current;
          const newVal = insertAtCursor(input, emoji);
          setInputValue(newVal);
          setEmojiDropdownOpen(false);
          setEmojiFilterText("");
          setFilteredEmojis(emojiList);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setEmojiDropdownOpen(false);
        setEmojiFilterText("");
        setFilteredEmojis(emojiList);
        return;
      }
    }

    // Open emoji picker on Ctrl+E or ':' key
    if ((e.ctrlKey && e.key.toLowerCase() === "e") || e.key === ":") {
      e.preventDefault();
      setEmojiDropdownOpen(true);
      setIsOpen(true);
      setEmojiFilterText("");
      setFilteredEmojis(emojiList);
      return;
    }

    // Normal enter key to add item
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

  // Toggle selection on dropdown item click
  const toggleSelection = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
    setIsOpen(true);
    if (inputRef.current) inputRef.current.focus();
  };

  // Remove badge button handler
  const removeBadge = (item: string) => {
    setSelectedItems(selectedItems.filter((i) => i !== item));
    if (inputRef.current) inputRef.current.focus();
  };

  // Emoji selection handler from picker dropdown
  const onEmojiSelect = (emoji: string) => {
    if (!inputRef.current) return;
    const input = inputRef.current;
    const newVal = insertAtCursor(input, emoji);
    setInputValue(newVal);
    setEmojiDropdownOpen(false);
    setEmojiFilterText("");
    setFilteredEmojis(emojiList);
    input.focus();
  };

  return (
    <div
      ref={containerRef}
      className={styles["dropdown-container"]}
      style={{ position: "relative" }}
    >
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
          autoComplete="off"
          spellCheck="false"
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

      {/* Emoji picker dropdown */}
      {emojiDropdownOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: 4,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: 8,
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            zIndex: 1000,
            maxHeight: 160,
            overflowY: "auto",
            width: 200,
            padding: 8,
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
          role="listbox"
          aria-label="Emoji picker"
        >
          {filteredEmojis.length === 0 && (
            <div
              style={{
                color: "#999",
                fontSize: 14,
                userSelect: "none",
                padding: "4px 8px",
              }}
            >
              No emojis found
            </div>
          )}
          {filteredEmojis.map((emoji) => (
            <span
              key={emoji}
              style={{
                cursor: "pointer",
                fontSize: 20,
                userSelect: "none",
                borderRadius: 6,
                padding: 4,
                transition: "background-color 0.2s ease",
              }}
              onMouseDown={(e) => {
                e.preventDefault(); // prevent input blur
                onEmojiSelect(emoji);
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onEmojiSelect(emoji);
                }
              }}
              aria-label={`Insert emoji ${emoji}`}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#6c63ff";
                e.currentTarget.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "inherit";
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReusableDropdown;
