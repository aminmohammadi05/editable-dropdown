const EmptyEmojiList: React.FC<any> = () => {
  return (
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
  );
};

export default EmptyEmojiList;
