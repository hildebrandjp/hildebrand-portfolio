import { MODAL_PAGES } from "@/constants/modal";

export type ModalPage  = typeof MODAL_PAGES[keyof typeof MODAL_PAGES];