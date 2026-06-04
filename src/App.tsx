import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import XRayHouse from './components/XRayHouse';
import DeJargonizer from './components/DeJargonizer';
import ProductAnalyzer from './components/ProductAnalyzer';
import Articles from './components/Articles';
import PodcastHub from './components/PodcastHub';
import CitizenMap from './components/CitizenMap';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [initialSearchId, setInitialSearchId] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    fetchPendingCount();
    // Poll occasionally to simulate real updates in a community project
    const interval = setInterval(fetchPendingCount, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchPendingCount = async () => {
    try {
      const response = await fetch('/api/metrics/pending');
      if (!response.ok) throw new Error('Failed to load pending metrics');
      const data = await response.json();
      setPendingCount(data.length);
    } catch (err) {
      console.error(err);
      // Fallback fallback count
      setPendingCount(2); // Simulated count (NYC outlier & Dallas outlier)
    }
  };

  const handleSearchCompound = (uuid: string) => {
    setInitialSearchId(uuid);
    setActiveTab('de-jargonizer');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'explore':
        return <XRayHouse onSearchCompound={handleSearchCompound} />;
      case 'de-jargonizer':
        return (
          <DeJargonizer 
            initialSearchId={initialSearchId} 
            clearInitialSearch={() => setInitialSearchId(null)} 
          />
        );
      case 'products':
        return <ProductAnalyzer onSearchCompound={handleSearchCompound} />;
      case 'articles':
        return <Articles onSearchCompound={handleSearchCompound} />;
      case 'podcast':
        return <PodcastHub onSearchCompound={handleSearchCompound} />;
      case 'map':
        return <CitizenMap onSubmissionSuccess={fetchPendingCount} />;
      case 'admin':
        return (
          <AdminDashboard 
            onVerificationUpdate={fetchPendingCount} 
            pendingCount={pendingCount} 
          />
        );
      default:
        return <XRayHouse onSearchCompound={handleSearchCompound} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} pendingCount={pendingCount}>
      {renderContent()}
    </Layout>
  );
}
