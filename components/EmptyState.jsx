import { Plus } from "lucide-react";
import Link from "next/link";

/**
 * Reusable Empty State component based on Dabbarha Design System
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Lucide icon component
 * @param {string} props.title - Primary text
 * @param {string} props.description - Secondary explanatory text
 * @param {string} [props.actionLabel] - Label for the CTA button
 * @param {string} [props.actionHref] - Link for the CTA button
 * @param {function} [props.onAction] - onClick handler for the CTA button
 */
export function EmptyState({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  actionHref,
  onAction 
}) {
  return (
    <div className="bg-white border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center font-arabic my-4">
      <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center text-muted-foreground mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-[240px] mb-6 leading-relaxed">
        {description}
      </p>
      
      {(actionLabel && (actionHref || onAction)) && (
        actionHref ? (
          <Link 
            href={actionHref}
            className="px-6 py-2.5 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {actionLabel}
          </Link>
        ) : (
          <button 
            onClick={onAction}
            className="px-6 py-2.5 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
}
