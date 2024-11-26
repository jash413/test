// app/dashboard/project_details/[id]/schedule/daily_logs/page.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DailyLogsPage = () => {
  const dailyLogs = [
    {
      date: '2023-07-01',
      weather: 'Sunny',
      temperature: 75,
      workSummary: 'Foundation work completed',
      crewSize: 8
    },
    {
      date: '2023-07-02',
      weather: 'Cloudy',
      temperature: 68,
      workSummary: 'Started framing first floor',
      crewSize: 10
    },
    {
      date: '2023-07-03',
      weather: 'Rainy',
      temperature: 62,
      workSummary: 'Indoor electrical work',
      crewSize: 6
    }
    // Add more log entries as needed
  ];

  return (
    <div className="space-y-6 bg-gray-100 p-6">
      <h1 className="text-3xl font-bold">Daily Logs</h1>

      <div className="space-y-4">
        {dailyLogs.map((log, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{new Date(log.date).toLocaleDateString()}</span>
                <Badge variant="outline">
                  {log.weather}, {log.temperature}°F
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm">
                <strong>Work Summary:</strong> {log.workSummary}
              </p>
              <p className="text-sm">
                <strong>Crew Size:</strong> {log.crewSize} workers
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DailyLogsPage;
