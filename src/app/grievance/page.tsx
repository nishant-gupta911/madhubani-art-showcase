import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Grievance Officer [DRAFT] — Vernika Enterprises',
  description: 'Designated Grievance Officer details under the Consumer Protection (E-Commerce) Rules, 2020.',
};

export default function GrievanceOfficerPage() {
  const g = siteConfig.contact.grievanceOfficer;

  return (
    <LegalPageLayout title="Grievance Officer Details">
      <p>
        In accordance with the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong> framed under the Consumer Protection Act, 2019, the details of the designated Grievance Officer for {siteConfig.name} are provided below:
      </p>

      <div className="bg-amber-50/60 p-6 rounded-lg border border-amber-200 my-6 not-prose space-y-2 text-sm text-ink">
        <div>
          <span className="text-xs uppercase font-semibold text-ink-muted">Officer Name:</span>
          <p className="font-bold text-base text-ink">{g.name}</p>
        </div>
        <div>
          <span className="text-xs uppercase font-semibold text-ink-muted">Designation:</span>
          <p className="font-medium text-ink">{g.designation}</p>
        </div>
        <div>
          <span className="text-xs uppercase font-semibold text-ink-muted">Contact Email:</span>
          <p>
            <a href={`mailto:${g.email}`} className="text-vermilion underline font-mono">
              {g.email}
            </a>
          </p>
        </div>
        <div>
          <span className="text-xs uppercase font-semibold text-ink-muted">Contact Phone:</span>
          <p className="font-mono">{g.phone}</p>
        </div>
        <div>
          <span className="text-xs uppercase font-semibold text-ink-muted">Registered Address:</span>
          <p>{g.address}</p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">Redressal Mechanism</h2>
        <p>
          The Grievance Officer shall acknowledge receipt of any consumer complaint within <strong>48 hours</strong> and redressed within <strong>one month</strong> from the date of receipt of the complaint, pursuant to statutory guidelines.
        </p>
      </section>
    </LegalPageLayout>
  );
}
