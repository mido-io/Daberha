import { getUserGoals } from "@/actions/goals";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, Users, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { EmptyState } from "@/components/EmptyState";

export const metadata = {
  title: "Goals - Daberha",
};

export default async function GoalsPage() {
  const { data, success, error } = await getUserGoals();

  if (!success) {
    return (
      <div className="p-4 text-red-500">
        Error loading goals: {error}
      </div>
    );
  }

  const { owned, shared } = data;
  const hasGoals = owned.length > 0 || shared.length > 0;

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-en text-slate-900 flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Savings Goals
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track your personal and shared financial milestones
          </p>
        </div>
        <Link href="/goals/create">
          <Button size="sm" className="gap-2 rounded-full px-4">
            <Plus className="w-4 h-4" />
            New Goal
          </Button>
        </Link>
      </div>

      {!hasGoals && (
        <EmptyState 
          icon={<Target className="w-8 h-8" />}
          title="لا توجد أهداف حالياً"
          description="ابدأ بتحديد أهدافك المالية، سواء كانت للسفر، جهاز جديد، أو لتكوين مدخرات للطوارئ. يمكنك أيضاً مشاركة الأهداف مع العائلة!"
          actionLabel="إنشاء أول هدف"
          actionHref="/goals/create"
        />
      )}

      {owned.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg flex items-center gap-2 text-slate-800">
            My Goals
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {owned.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      )}

      {shared.length > 0 && (
        <div className="space-y-4 pt-4 border-t">
          <h2 className="font-semibold text-lg flex items-center gap-2 text-slate-800">
            <Users className="w-5 h-5 text-blue-500" />
            Shared With Me
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {shared.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GoalCard({ goal }) {
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const isCompleted = progress >= 100;

  return (
    <Link href={`/goals/${goal.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group">
        <div className={`absolute top-0 left-0 w-1 h-full ${isCompleted ? 'bg-green-500' : 'bg-primary'}`} />
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl shadow-sm">
                {goal.emoji || "🎯"}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{goal.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {goal.type === "SHARED" && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Shared</Badge>
                  )}
                  {goal.memberRole && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-slate-500">
                      {goal.memberRole === 'VIEWER' ? 'View Only' : goal.memberRole}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-en">
              <span className="font-semibold text-slate-900">
                {goal.currentAmount.toLocaleString()} EGP
              </span>
              <span className="text-slate-500">
                / {goal.targetAmount.toLocaleString()} EGP
              </span>
            </div>
            <Progress 
              value={progress} 
              className="h-2" 
              indicatorClassName={isCompleted ? "bg-green-500" : "bg-primary"}
            />
            {goal.deadline && (
              <p className="text-xs text-slate-500 font-en text-right">
                Target: {format(new Date(goal.deadline), "MMM d, yyyy")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
