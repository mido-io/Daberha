import { getLeaderboard } from "@/actions/gamification";
import { ChevronRight, Award, Flame } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function LeaderboardPage() {
  const { topUsers, currentUserRank } = await getLeaderboard();

  // Ensure topUsers exist
  const first = topUsers?.[0];
  const second = topUsers?.[1];
  const third = topUsers?.[2];
  const remaining = topUsers?.slice(3) || [];

  return (
    <div className="min-h-screen bg-[#F0F4F8] font-arabic relative pb-28">
      {/* Header */}
      <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-border sticky top-0 z-10">
        <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-foreground hover:bg-muted transition-colors">
          <Link href="/dashboard">
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
        <h1 className="text-xl font-bold text-foreground">قائمة المتصدرين</h1>
        <div className="w-10"></div>
      </div>

      <div className="max-w-md mx-auto px-5 pt-8">
        
        {/* Podium Area */}
        <div className="flex items-end justify-center gap-2 mb-10 mt-8 h-48">
          
          {/* Second Place */}
          {second && (
            <div className="flex flex-col items-center w-1/3">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-full border-4 border-[#F0F4F8] bg-white overflow-hidden flex items-center justify-center text-lg font-bold text-muted-foreground shadow-md">
                  {second.image_url ? (
                    <Image src={second.image_url} alt={second.displayName} width={64} height={64} className="object-cover w-full h-full" />
                  ) : second.displayName.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-white font-bold text-sm shadow-sm">2</div>
              </div>
              <div className="h-24 w-full bg-white rounded-t-xl border border-border shadow-sm flex flex-col items-center pt-3">
                <span className="font-bold text-sm truncate w-full text-center px-1">{second.displayName}</span>
                <span className="text-xs text-primary font-bold mt-1 font-en">{second.xp_points} XP</span>
              </div>
            </div>
          )}

          {/* First Place */}
          {first && (
            <div className="flex flex-col items-center w-1/3 z-10">
              <div className="relative mb-3">
                <div className="w-20 h-20 rounded-full border-4 border-[#FFC107] bg-white overflow-hidden flex items-center justify-center text-2xl font-bold text-muted-foreground shadow-lg">
                  {first.image_url ? (
                    <Image src={first.image_url} alt={first.displayName} width={80} height={80} className="object-cover w-full h-full" />
                  ) : first.displayName.charAt(0)}
                </div>
                <div className="absolute -top-4 right-1/2 translate-x-1/2 text-[#FFC107]">
                  <Award className="w-8 h-8 fill-current" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-[#FFC107] border-2 border-white flex items-center justify-center text-white font-bold text-sm shadow-sm">1</div>
              </div>
              <div className="h-32 w-full bg-gradient-to-b from-primary/10 to-white rounded-t-2xl border border-primary/20 shadow-md flex flex-col items-center pt-4">
                <span className="font-bold text-sm truncate w-full text-center px-1">{first.displayName}</span>
                <span className="text-xs text-primary font-bold mt-1 font-en">{first.xp_points} XP</span>
              </div>
            </div>
          )}

          {/* Third Place */}
          {third && (
            <div className="flex flex-col items-center w-1/3">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-full border-4 border-[#F0F4F8] bg-white overflow-hidden flex items-center justify-center text-lg font-bold text-muted-foreground shadow-md">
                  {third.image_url ? (
                    <Image src={third.image_url} alt={third.displayName} width={64} height={64} className="object-cover w-full h-full" />
                  ) : third.displayName.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-amber-600 border-2 border-white flex items-center justify-center text-white font-bold text-sm shadow-sm">3</div>
              </div>
              <div className="h-20 w-full bg-white rounded-t-xl border border-border shadow-sm flex flex-col items-center pt-2">
                <span className="font-bold text-sm truncate w-full text-center px-1">{third.displayName}</span>
                <span className="text-xs text-primary font-bold mt-1 font-en">{third.xp_points} XP</span>
              </div>
            </div>
          )}
        </div>

        {/* Rest of the Leaderboard */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
          {remaining.map((user) => (
            <div 
              key={user.id} 
              className={`flex items-center p-4 border-b border-border last:border-b-0 ${user.isCurrentUser ? 'bg-primary/5' : ''}`}
            >
              <div className="w-8 font-bold text-muted-foreground text-center font-en">{user.rank}</div>
              
              <div className="w-10 h-10 rounded-full bg-surface border border-border overflow-hidden mx-3 flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                {user.image_url ? (
                  <Image src={user.image_url} alt={user.displayName} width={40} height={40} className="object-cover w-full h-full" />
                ) : user.displayName.charAt(0)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate text-foreground flex items-center gap-2">
                  {user.displayName}
                  {user.isCurrentUser && <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">أنت</span>}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#FF6B35]" /> {user.streak_days} أيام
                </div>
              </div>
              
              <div className="font-bold text-sm text-primary font-en shrink-0">
                {user.xp_points} XP
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Current User Bar */}
      {currentUserRank && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent z-20 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <div className="bg-ink text-white rounded-2xl p-4 flex items-center shadow-xl border border-white/10">
              <div className="w-8 font-bold text-white/70 text-center font-en text-lg">{currentUserRank.rank}</div>
              
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 overflow-hidden mx-3 flex items-center justify-center text-sm font-bold text-white shrink-0">
                {currentUserRank.image_url ? (
                  <Image src={currentUserRank.image_url} alt={currentUserRank.displayName} width={40} height={40} className="object-cover w-full h-full" />
                ) : currentUserRank.displayName.charAt(0)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate text-white">ترتيبك الحالي</div>
                <div className="text-xs text-white/70 mt-0.5 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#FF6B35]" /> {currentUserRank.streak_days} أيام
                </div>
              </div>
              
              <div className="font-bold text-sm text-[#FFC107] font-en shrink-0">
                {currentUserRank.xp_points} XP
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
