import ClientProfilePage from "./ClientProfilePage";

export default function ServerProfilePage({ params }: { params: { userId: string } }) {
  return <ClientProfilePage userId={params.userId} />;
}
