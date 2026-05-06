"use client";

import { useState } from "react";
import { format } from "date-fns";
import { updateGoalProgress, inviteUserToGoal } from "@/actions/goals";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Users, Loader2, Plus, Share2 } from "lucide-react";
import { toast } from "sonner";

export default function GoalDetailClient({ goal }) {
  const [isAddingFunds, setIsAddingFunds] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [isFundDrawerOpen, setIsFundDrawerOpen] = useState(false);

  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("VIEWER");
  const [isInviteDrawerOpen, setIsInviteDrawerOpen] = useState(false);

  const canEdit = goal.userRole === "OWNER" || goal.userRole === "EDITOR";
  const isOwner = goal.userRole === "OWNER";

  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const isCompleted = progress >= 100;

  const handleAddFunds = async (e) => {
    e.preventDefault();
    if (!fundAmount || isNaN(fundAmount) || Number(fundAmount) <= 0) return;

    setIsAddingFunds(true);
    const result = await updateGoalProgress(goal.id, Number(fundAmount));
    setIsAddingFunds(false);

    if (result.success) {
      toast.success("Funds added successfully!");
      setFundAmount("");
      setIsFundDrawerOpen(false);
    } else {
      toast.error(result.error || "Failed to add funds");
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setIsInviting(true);
    const result = await inviteUserToGoal(goal.id, inviteEmail, inviteRole);
    setIsInviting(false);

    if (result.success) {
      toast.success("Invitation sent successfully!");
      setInviteEmail("");
      setIsInviteDrawerOpen(false);
    } else {
      toast.error(result.error || "Failed to send invitation");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6 pb-24">
      {/* Header Info */}
      <div className="flex flex-col items-center text-center space-y-3 mt-6">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-4xl shadow-sm border-4 border-white">
          {goal.emoji || "🎯"}
        </div>
        <div>
          <h1 className="text-2xl font-bold font-en text-slate-900">{goal.name}</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="secondary" className="font-en">
              {goal.type === "SHARED" ? "Shared Goal" : "Personal Goal"}
            </Badge>
            <Badge variant="outline" className="font-en">
              {goal.userRole}
            </Badge>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <Card className="border-none shadow-md overflow-hidden relative">
        <div className={`absolute top-0 left-0 w-full h-1 ${isCompleted ? 'bg-green-500' : 'bg-primary'}`} />
        <CardContent className="p-6 space-y-6">
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-slate-500 font-en uppercase tracking-wider">Current Balance</p>
            <p className="text-4xl font-bold font-en text-slate-900 tracking-tight">
              {goal.currentAmount.toLocaleString()} <span className="text-xl text-slate-500">EGP</span>
            </p>
            <p className="text-sm text-slate-500 font-en">
              of {goal.targetAmount.toLocaleString()} EGP target
            </p>
          </div>

          <div className="space-y-2">
            <Progress 
              value={progress} 
              className="h-3" 
              indicatorClassName={isCompleted ? "bg-green-500" : "bg-primary"}
            />
            <div className="flex justify-between text-xs font-semibold text-slate-500 font-en">
              <span>{progress.toFixed(1)}%</span>
              {goal.deadline && (
                <span>Due: {format(new Date(goal.deadline), "MMM d, yyyy")}</span>
              )}
            </div>
          </div>

          {canEdit && !isCompleted && (
            <Drawer open={isFundDrawerOpen} onOpenChange={setIsFundDrawerOpen}>
              <DrawerTrigger asChild>
                <Button className="w-full h-12 rounded-xl text-base shadow-sm gap-2">
                  <Plus className="w-5 h-5" />
                  Add Funds
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Add Funds</DrawerTitle>
                  </DrawerHeader>
                  <form onSubmit={handleAddFunds} className="p-4 space-y-4">
                    <div className="space-y-2 font-en">
                      <label className="text-sm font-medium">Amount to Add (EGP)</label>
                      <Input 
                        type="number" 
                        placeholder="e.g. 500" 
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <DrawerFooter className="px-0">
                      <Button type="submit" disabled={isAddingFunds || !fundAmount}>
                        {isAddingFunds && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Confirm
                      </Button>
                      <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </form>
                </div>
              </DrawerContent>
            </Drawer>
          )}

          {isCompleted && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-center text-sm font-semibold flex items-center justify-center gap-2">
              <Target className="w-5 h-5" />
              Goal Completed! 🎉
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shared Members Section */}
      {(goal.type === "SHARED" || isOwner) && (
        <div className="space-y-4 mt-8">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Members
            </h3>
            {isOwner && (
              <Drawer open={isInviteDrawerOpen} onOpenChange={setIsInviteDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 rounded-full h-8">
                    <Share2 className="w-3 h-3" />
                    Invite
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                      <DrawerTitle>Invite a Friend</DrawerTitle>
                    </DrawerHeader>
                    <form onSubmit={handleInvite} className="p-4 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Friend's Email</label>
                        <Input 
                          type="email" 
                          placeholder="friend@example.com" 
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          className="font-en"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Access Level</label>
                        <Select value={inviteRole} onValueChange={setInviteRole}>
                          <SelectTrigger className="font-en">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent className="font-en">
                            <SelectItem value="VIEWER">Viewer (Track only)</SelectItem>
                            <SelectItem value="EDITOR">Editor (Can add funds)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <DrawerFooter className="px-0">
                        <Button type="submit" disabled={isInviting || !inviteEmail}>
                          {isInviting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          Send Invitation
                        </Button>
                        <DrawerClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </form>
                  </div>
                </DrawerContent>
              </Drawer>
            )}
          </div>

          <div className="space-y-3">
            {/* Owner Item */}
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold font-en text-slate-500">
                  You
                </div>
                <div>
                  <p className="text-sm font-semibold font-en text-slate-900">You (Owner)</p>
                </div>
              </div>
            </div>

            {/* Other Members */}
            {goal.members?.map((member) => (
              member.user_id !== goal.owner_id && (
                <div key={member.user_id} className="flex items-center justify-between bg-white p-3 rounded-xl border shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border">
                      {member.users.image_url ? (
                        <img src={member.users.image_url} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold font-en text-slate-900">
                        {member.users.name || member.users.email.split('@')[0]}
                      </p>
                      <p className="text-xs text-slate-500 font-en">{member.users.email}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-en text-[10px]">
                    {member.role === 'VIEWER' ? 'Viewer' : 'Editor'}
                  </Badge>
                </div>
              )
            ))}

            {goal.type === "PERSONAL" && !isOwner && (
              <p className="text-sm text-slate-500 italic">This is a personal goal.</p>
            )}
            
            {goal.type === "SHARED" && goal.members?.length === 0 && (
              <p className="text-sm text-slate-500 italic text-center py-4 bg-slate-50 rounded-xl">
                No members invited yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}