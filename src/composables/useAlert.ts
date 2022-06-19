export default function useAlert() {
  return {
    danger(message: string) {
      alert(message);
    },
  };
}
