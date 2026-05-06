"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createGoal } from "@/actions/goals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const EMOJIS = ["💰", "✈️", "🚗", "🏠", "💻", "🎉", "🎓", "💍", "🏥", "🎯"];

const goalSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  targetAmount: z.preprocess((val) => Number(val), z.number().positive("Amount must be greater than 0")),
  deadline: z.string().min(1, "Deadline is required"),
});

export default function CreateGoalPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("💰");
  const [isShared, setIsShared] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      targetAmount: "",
      deadline: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const result = await createGoal({
      ...data,
      emoji: selectedEmoji,
      isShared,
    });

    setIsSubmitting(false);

    if (result.success) {
      toast.success("Goal created successfully!");
      router.push(`/goals/${result.data.id}`);
    } else {
      toast.error(result.error || "Failed to create goal");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6 pb-24">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold font-en text-slate-900">Create New Goal</h1>
        <p className="text-slate-500 text-sm">Set your target and start saving</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Goal Emoji</label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-12 h-12 text-2xl rounded-xl transition-all ${
                      selectedEmoji === emoji 
                        ? 'bg-primary/10 border-2 border-primary scale-110' 
                        : 'bg-slate-100 border-2 border-transparent hover:bg-slate-200'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-700">Goal Name</label>
              <Input id="name" placeholder="e.g. Dream Vacation" {...register("name")} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2 font-en">
              <label htmlFor="targetAmount" className="text-sm font-medium text-slate-700">Target Amount (EGP)</label>
              <Input id="targetAmount" type="number" placeholder="50000" {...register("targetAmount")} />
              {errors.targetAmount && <p className="text-xs text-red-500">{errors.targetAmount.message}</p>}
            </div>

            <div className="space-y-2 font-en">
              <label htmlFor="deadline" className="text-sm font-medium text-slate-700">Target Date</label>
              <Input id="deadline" type="date" {...register("deadline")} />
              {errors.deadline && <p className="text-xs text-red-500">{errors.deadline.message}</p>}
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border">
              <div>
                <p className="font-medium text-slate-900">Shared Goal</p>
                <p className="text-xs text-slate-500">Enable to invite friends and save together</p>
              </div>
              <Switch checked={isShared} onCheckedChange={setIsShared} />
            </div>

            <Button type="submit" className="w-full h-12 text-base rounded-xl mt-4" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Goal
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
