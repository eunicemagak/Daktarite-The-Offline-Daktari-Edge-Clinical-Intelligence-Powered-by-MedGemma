export default function UrgencyBadge({ level }) {
  const colors = {
    low: "green",
    medium: "orange",
    high: "red",
  };

  return (
    <span
      style={{
        backgroundColor: colors[level],
        color: "white",
        padding: "6px 12px",
        borderRadius: "8px",
        fontWeight: "bold",
      }}
    >
      {level.toUpperCase()}
    </span>
  );
}