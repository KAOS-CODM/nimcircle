interface DiagnosticRowProps {
  label: string
  value: string
  success?: boolean
}

export default function DiagnosticRow({
  label,
  value,
  success = false,
}: DiagnosticRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-black/5 py-3 last:border-b-0">
      <span className="text-sm text-[#607060]">
        {label}
      </span>

      <span
        className={`text-right text-sm font-semibold ${
          success ? 'text-[#3f6b20]' : 'text-[#162018]'
        }`}
      >
        {value}
      </span>
    </div>
  )
}