import { Avatar, Card, Stack, Typography } from '@mui/joy';
import { Recap } from '../hooks/useRecaps';
import { format } from 'date-fns';

import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const Recaps = ({ recaps }: { recaps: Recap[] }) => {
  return (
    <Stack>
      <Line
        options={{
          plugins: {
            legend: {
              display: false // This removes the legend box
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              suggestedMax: 1,
              suggestedMin: 0,
              grid: {
                display: false
              },
              ticks: {
                color: 'transparent' // Makes the ticks (numbers) invisible
              },
              border: {
                color: 'transparent' // Removes the grey axis line
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: 'transparent' // Makes the ticks (numbers) invisible
              },
              border: {
                color: 'transparent' // Removes the grey axis line
              }
            }
          }
        }}
        data={{
          labels: recaps.map(recap => format(recap.date, 'dd/MM/yyyy')),
          datasets: [
            {
              label: 'Status',
              data: recaps.map(recap => recap.status),
              borderColor: '#22E39E',
              fill: true
            }
          ]
        }}
      />
      {recaps.map(recap => (
        <Card key={format(recap.date, 'dd/MM/yyyy')}>
          <Stack direction='row' justifyContent='space-between'>
            <Avatar src={recap.photo} />
            <Typography
              level='h4'
              sx={{
                color: '#22E39E'
              }}
            >
              {format(recap.date, 'dd/MM/yyyy')}
            </Typography>
          </Stack>
          {recap.status < 0.3 ? (
            <Typography level='h3' color='success'>
              Good
            </Typography>
          ) : recap.status < 0.7 ? (
            <Typography level='h3' color='warning'>
              Average
            </Typography>
          ) : (
            <Typography level='h3' color='danger'>
              Bad
            </Typography>
          )}
        </Card>
      ))}
    </Stack>
  );
};
