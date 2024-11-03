import prismadb from "@/lib/prismadb";
import CompanionForm from "./components/CompanionForm";
import { auth } from "@clerk/nextjs/server";
import { RedirectToSignIn } from "@clerk/nextjs";

interface CompanionIdPageProps {
  params: {
    companionId: string;
  };
}

const CompanionIdPage = async ({ params }: CompanionIdPageProps) => {
  const awaitedParams = await params;
  const { userId } = await auth();

  if (!userId) {
    return RedirectToSignIn;
  }

  const companion = await prismadb.companion.findUnique({
    where: {
      id: awaitedParams.companionId,
      userId,
    },
  });

  const categories = await prismadb.category.findMany();

  return (
    <CompanionForm initialData={companion} categories={categories} />
  );
};

export default CompanionIdPage;
