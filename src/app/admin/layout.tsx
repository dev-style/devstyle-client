import "./ui/globals.css";
export const metadata = {
  title: "Admin | Devstyle",
  description: "Admin Dashboard for Devstyle",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div>{children}</div>
  );
}
