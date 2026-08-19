import { useToastStore } from "../stores/useToastStore";

/** `const toast = useToast(); toast("Approved")` */
export const useToast = () => useToastStore((s) => s.push);
