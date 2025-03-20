import { Button } from "@/components/Button";

export default function NavButton({ icon, onClick }) {
  return (
    <Button variant="ghost" size="icon" className="my-2 cursor-pointer hover:bg-gray-100" onClick={onClick}>
      {icon}
    </Button>
  );
}
