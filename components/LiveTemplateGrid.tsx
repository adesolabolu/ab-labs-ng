'use client';

import React, { useEffect, useState } from 'react';
import type { Template } from '@/data/templates';
import TemplateCard from '@/components/TemplateCard';

interface LiveTemplateGridProps {
  initialTemplates: Template[];
  limit?: number;
  ctaText?: string;
}

/**
 * Renders pre-rendered template cards immediately from static HTML,
 * then syncs live pricing/details from /api/templates so /admin edits
 * always reflect without forcing SSR on every page view.
 */
export default function LiveTemplateGrid({
  initialTemplates,
  limit = 6,
  ctaText = 'Explore Design',
}: LiveTemplateGridProps) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);

  useEffect(() => {
    let active = true;
    fetch('/api/templates', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.success && Array.isArray(data.templates) && data.templates.length > 0) {
          setTemplates(data.templates.slice(0, limit));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [limit]);

  return (
    <div className="shop-catalog-grid" style={{ marginTop: '32px' }}>
      {templates.slice(0, limit).map((template) => (
        <TemplateCard key={template.id} template={template} ctaText={ctaText} />
      ))}
    </div>
  );
}
