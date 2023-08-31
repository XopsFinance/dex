import { PopupType } from '@/types/state'
import { useEffect, useMemo } from 'react'
import { create } from 'zustand'

export const usePopupStore = create<PopupType>((set, getState) => {
  return {
    open: false,
    setOpen: (state: boolean) => set(() => ({ open: state })),
    content: '',
    setContent: (state: any) => set(() => ({ content: state })),
  }
})

export default usePopupStore
