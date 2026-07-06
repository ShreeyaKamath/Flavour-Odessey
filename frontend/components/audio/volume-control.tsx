"use client";

type VolumeControlProps = {
  disabled?: boolean;
  label: string;
  onChange: (value: number) => void;
  value: number;
};

/** Renders an accessible percentage slider for one audio mixer channel. */
export function VolumeControl({ disabled = false, label, onChange, value }: VolumeControlProps) {
  const percentage = Math.round(value * 100);

  return (
    <label className="block">
      <span className="flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <output className="text-muted-foreground">{percentage}%</output>
      </span>
      <input
        aria-label={`${label} volume`}
        className="mt-2 h-2 w-full cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        max="1"
        min="0"
        onChange={(event) => onChange(Number(event.target.value))}
        step="0.05"
        type="range"
        value={value}
      />
    </label>
  );
}
