type Props = {
  value: string
  handleChange: any
}

export function PercentageInput({ handleChange, value }: Props) {
  return (
    <div className="flex items-end gap-2 text-2xs">
      <label htmlFor="custom">Custom</label>
      <div className="flex rounded-sm bg-navy py-0.5 px-2 items-center">
        <input
          type="number"
          className="w-6 bg-transparent outline-none"
          onChange={handleChange}
          value={value}
        />
        %
      </div>
    </div>
  )
}
