import { getGoal } from "@/actions/goals";
import { notFound } from "next/navigation";
import GoalDetailClient from "./GoalDetailClient";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { data: goal, success } = await getGoal(id);
  
  if (!success || !goal) return { title: "Goal Not Found" };
  return { title: `${goal.name} - Daberha` };
}

export default async function GoalPage({ params }) {
  const { id } = await params;
  const { data: goal, success, error } = await getGoal(id);

  if (!success || !goal) {
    if (error === "Unauthorized to view this goal") {
      return <div className="p-4 text-center mt-10">You don't have access to this goal.</div>;
    }
    notFound();
  }

  return <GoalDetailClient goal={goal} />;
}
