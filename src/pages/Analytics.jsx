import React from 'react';
import { Header, RoleGuard } from '../components';
import Stacked from '../components/Charts/Stacked';
import Pie from '../components/Charts/Pie';
import LineChart from '../components/Charts/LineChart';
import SparkLine from '../components/Charts/SparkLine';
import { useStateContext } from '../contexts/ContextProvider';
import ChartJS from '../components/Charts/ChartJS';

const Analytics = () => {
  const { currentColor } = useStateContext();
  React.useEffect(() => {
    // lazy log; don't block rendering
    try { window.requestIdleCallback?.(() => window.dispatchEvent(new Event('analytics-visit'))); } catch (_) {}
  }, []);

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-2xl shadow-sm">
      <Header category="Insights" title="Analytics" />
      <RoleGuard allow={['admin','manager']} fallback={<p className="text-red-500">You can&apos;t access Analytics.</p>}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white dark:bg-main-dark-bg rounded-2xl p-6 shadow">
          <p className="font-semibold text-lg mb-2">Revenue Trend</p>
          <LineChart />
        </div>
        <div className="bg-white dark:bg-main-dark-bg rounded-2xl p-6 shadow">
          <p className="font-semibold text-lg mb-2">Channel Split</p>
          <Pie />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white dark:bg-main-dark-bg rounded-2xl p-6 shadow">
          <p className="font-semibold text-lg mb-2">Stacked Performance</p>
          <Stacked />
        </div>
        <div className="bg-white dark:bg-main-dark-bg rounded-2xl p-6 shadow">
          <p className="font-semibold text-lg mb-2">Sparkline (KPI)</p>
          <SparkLine
            currentColor={currentColor}
            id="spark-kpi"
            type="Line"
            height="80px"
            width="250px"
            data={[
              { x: 1, yval: 4 },
              { x: 2, yval: 6 },
              { x: 3, yval: 5 },
              { x: 4, yval: 8 },
              { x: 5, yval: 7 },
            ]}
            color={currentColor}
          />
        </div>
      </div>
      <div className="mt-6 bg-white dark:bg-main-dark-bg rounded-2xl p-6 shadow">
        <p className="font-semibold text-lg mb-2">Chart.js Sample</p>
        <ChartJS
          type="bar"
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{ label: 'Visitors', data: [12, 19, 3, 5, 2, 3, 9], backgroundColor: 'rgba(59,130,246,0.5)' }],
          }}
          options={{ responsive: true, plugins: { legend: { display: true } } }}
        />
      </div>
      </RoleGuard>
    </div>
  );
};

export default Analytics;
