'use client';
import Link from 'next/link';

export default function EmptyState({ title, desc, linkText, linkHref }: any) {
  return (
    <div className="empty-state-profile">
      <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor" opacity="0.3">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
      </svg>
      <p>{desc}</p>
      {linkText && linkHref && (
        <Link href={linkHref} className="profile-goto-store" style={{ display: 'inline-block', marginTop: '15px' }}>
          {linkText}
        </Link>
      )}
    </div>
  );
}
