import { useDropDown } from "../DropDownContext";
import styles from "../ReusableDropdown.module.scss";

const EmojiItem: React.FC<any> = ({ emoji }) => {
  const context = useDropDown();
  console.log(emoji);
  return (
    <span
      key={emoji}
      className={`${styles["emoji-item"]}`}
      onMouseDown={(e) => {
        e.preventDefault();
        context?.onEmojiSelect(emoji);
      }}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          context?.onEmojiSelect(emoji);
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
  );
};

export default EmojiItem;
