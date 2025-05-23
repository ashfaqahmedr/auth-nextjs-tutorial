import { SignOut } from "@/components/sign-out";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();
  if (!session) redirect("/sign-in");

  return (
    <>
      <div className="bg-gray-100 rounded-lg p-4 text-center mb-6">
        <p className="text-gray-600">Signed in as:</p>
        <p className="font-medium">{session.user?.name}</p>
        <p className="text-gray-600">Username: {session.user?.username}</p>
        {/* <p className="text-gray-600">User ID: {session.user?.id}</p> */}
        <p className="text-gray-600">Email: {session.user?.email}</p>
        
        <p className="text-gray-600">User Type: {session.user?.userType}</p>
      </div>

      <SignOut />
    </>
  );
};

export default Page;