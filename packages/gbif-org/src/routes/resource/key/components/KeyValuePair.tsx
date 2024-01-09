type Props = {
  // Can't be named key because it's a reserved by react
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
};

export function KeyValuePair({ label, value, className }: Props) {
  return (
    <div className={className}>
      <span className="font-semibold">{label}: </span>
      <span>{value}</span>
    </div>
  );
}