import prismadb from "@/lib/prismadb";
import CompanionForm from "./components/CompanionForm";

interface CompanionIdPageProps {
  params: {
    companionId: string;
  };
}

const CompanionIdPage = async ({ params }: CompanionIdPageProps) => {
  const awaitedParams = await params;
  const companion = await prismadb.companion.findUnique({
    where: {
      id: awaitedParams.companionId,
    },
  });

  const categories = await prismadb.category.findMany();

  return (
    <CompanionForm initialData={companion} categories={categories} />
  );
};

export default CompanionIdPage;
