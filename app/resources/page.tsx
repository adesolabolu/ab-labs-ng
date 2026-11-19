import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CallToAction from '@/components/CallToAction';
import ResourcesGrid from '@/components/ResourcesGrid';
import { RESOURCES } from '@/data/resources';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Resources & Live Tools',
  description:
    'Explore live tools, utilities, and resources built by aB Labs for creators and growing businesses.',
  path: '/resources',
});

export default function ResourcesPage() {
  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="main-wrapper">
        <section className="section-breadcrumb">
          <div className="site-blockcontainer container-large site-container">
            <div className="page-heading-block align-center">
              <div className="page-title-block">
                <h1 className="heading-style-h1">Resources &amp; Live Tools</h1>
              </div>
              <div className="hero-summary-wrapper max-width-460px">
                <p className="hero-summary">
                  Explore live tools, utilities, and helpful resources from aB Labs. Launch any tool interactively right here or open it in a new tab.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '48px 0 80px', backgroundColor: '#faf8f5' }}>
          <div className="site-blockcontainer container-large site-container">
            <ResourcesGrid items={RESOURCES} />
          </div>
        </section>

        <CallToAction />
      </div>

      <Footer />
    </div>
  );
}
