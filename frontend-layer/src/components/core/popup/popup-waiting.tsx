export function PopupWaiting() {
  return (
    <div className="px-20 py-9">
      <svg className="circular-loader" viewBox="25 25 50 50">
        <circle
          className="loader-path"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke="#11D9B9"
          strokeWidth="2"
        />
      </svg>
      <p className="mt-6 font-extrabold text-center">
        Waiting For Confirmation
      </p>
    </div>
  )
}
