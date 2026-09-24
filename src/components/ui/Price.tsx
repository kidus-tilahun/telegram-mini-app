interface PriceProps {
  value: number;
  className?: string;
}

/** Consistent ETB price presentation across the storefront. */
export default function Price({ value, className = "" }: PriceProps) {
  return <span className={className}>ETB {value.toLocaleString()}</span>;
}
