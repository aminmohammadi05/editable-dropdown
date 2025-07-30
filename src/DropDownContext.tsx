import {
  useContext,
  createContext,
  useState,
  useRef,
  useEffect,
  ChangeEvent,
} from "react";
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
const DropDownContext = createContext<any>(null);

const DropDownProvider: React.FC<any> = ({ children, initialItems }) => {
  const [items, setItems] = useState<string[]>(initialItems);
  const [inputValue, setInputValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const [emojiDropdownOpen, setEmojiDropdownOpen] = useState(false);
  const [filteredEmojis, setFilteredEmojis] = useState<string[]>(emojiList);
  const [emojiFilterText, setEmojiFilterText] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setIsOpen(true);

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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (emojiDropdownOpen) {
      if (e.key === "Enter") {
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

    if ((e.ctrlKey && e.key.toLowerCase() === "e") || e.key === ":") {
      e.preventDefault();
      setEmojiDropdownOpen(true);
      setIsOpen(true);
      setEmojiFilterText("");
      setFilteredEmojis(emojiList);
      return;
    }

    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newItem = inputValue.trim();
      if (items && !items.includes(newItem)) {
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
    <DropDownContext.Provider
      value={{
        containerRef,
        inputRef,
        setIsOpen,
        removeBadge,
        selectedItems,
        items,
        toggleSelection,
        filteredEmojis,
        inputValue,
        handleInputChange,
        handleKeyDown,
        emojiDropdownOpen,
        isOpen,
        onEmojiSelect,
      }}
    >
      {children}
    </DropDownContext.Provider>
  );
};

function useDropDown() {
  const context = useContext(DropDownContext);
  if (context === undefined)
    throw new Error("DropDownContext was used outside of the DropDownProvider");
  return context;
}

export { DropDownProvider, useDropDown };
