import ClientProfilePage from "./ClientProfilePage";

type Props = {
  params: { userId: string }; 
};

export default function ProfilePage({ params }: Props) {
  return <ClientProfilePage userId={params.userId} />;
}
