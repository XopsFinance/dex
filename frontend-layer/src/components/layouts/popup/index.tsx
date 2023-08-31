import { AiOutlineClose } from 'react-icons/ai'

import usePopupStore from '@/store/popup'

export function Popup() {
  const { open, setOpen, content, setContent } = usePopupStore()
  const handleClosePopup = () => {
    setOpen(false)
    setContent(null)
  }
  return (
    <div
      className={`fixed top-0 left-0 z-[900] h-full w-full ${
        open ? 'block' : 'hidden'
      }`}
    >
      <div
        style={{
          marginTop: 'min(20%, 175px)',
        }}
        className="z-[901] relative mx-auto w-full max-w-md  rounded-2xl bg-dark-blue overflow-x-hidden overflow-y-auto text-ellipsis"
      >
        <button
          className="absolute z-10 text-xl text-white cursor-pointer top-4 right-4"
          onClick={handleClosePopup}
        >
          <AiOutlineClose />
        </button>
        {content}
      </div>
      <div
        className="absolute top-0 left-0 w-full h-full bg-black opacity-70"
        onClick={() => setOpen(false)}
      />
    </div>
  )
}
