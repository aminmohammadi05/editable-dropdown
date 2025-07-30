import styles from "../ReusableDropdown.module.scss";
import { useDropDown } from "../DropDownContext";
import EmptyEmojiList from "./EmptyEmojiList";
import EmojiItem from "./EmojiItem";

const EmojiDropDown: React.FC<any> = ({ children }) => {
  const context = useDropDown();
  return (
    <div
      className={`${styles["emoji-dropdown"]}`}
      role="listbox"
      aria-label="Emoji picker"
    >
      {context?.filteredEmojis.length === 0 && <EmptyEmojiList />}
      {context?.filteredEmojis.map((emoji: string) => (
        <EmojiItem emoji={emoji} />
      ))}
    </div>
  );
};

export default EmojiDropDown;
