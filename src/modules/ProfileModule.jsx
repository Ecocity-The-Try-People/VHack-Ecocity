import { Card, CardContent } from "@/components/Card";

export default function ProfileModule() {
  return (
    <div className="relative min-h-screen">
      {/* Background Layer */}
      <div className="fixed inset-0 bg-[hsla(180,0%,10%,0.8)] -z-10 ml-20" /> {/* Add `ml-20` to avoid covering the sidebar */}

      {/* Content */}
      <div className="p-4 ml-20"> {/* Adjust `ml-20` to match the sidebar width */}
        <Card className="bg-[hsla(180,0%,10%,0.8)] text-white">
          <CardContent>User Profile & e-KYC Management</CardContent>
        </Card>
      </div>
    </div>
  );
}