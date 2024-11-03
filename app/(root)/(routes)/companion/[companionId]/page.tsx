import prismadb from "@/lib/prismadb";
import CompanionForm from "./components/CompanionForm";
import { auth } from "@clerk/nextjs/server";
import { RedirectToSignIn } from "@clerk/nextjs";

type Params = Promise<{ id: string }>

const CompanionIdPage = async (props: { params: Params }) => {
  const params = await props.params;
  const companionId = params.id;
  const { userId } = await auth();

  if (!userId) {
    return RedirectToSignIn;
  }

  const companion = await prismadb.companion.findUnique({
    where: {
      id: companionId,
      userId,
    },
  });

  const categories = await prismadb.category.findMany();

  return (
    <CompanionForm initialData={companion} categories={categories} />
  );
};

export default CompanionIdPage;
