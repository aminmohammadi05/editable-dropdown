import styles from "./EmptyEmojiList.module.scss";
const EmptyEmojiList: React.FC<any> = () => {
  return <div className={styles["empty-emoji-list"]}>No emojis found</div>;
};

export default EmptyEmojiList;
