import { Avatar, Card, IconButton, Stack, Typography } from '@mui/joy';
import { Recap } from '../hooks/useRecaps';
import { format } from 'date-fns';
import { Line } from 'react-chartjs-2';
import CloseIcon from '@mui/icons-material/Close';

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

function meanGeneralScore(recaps: Recap[]) {
  return (
    recaps.reduce((acc, recap) => acc + recap.general_score, 0) / recaps.length
  );
}

export const Recaps = ({
  recaps,
  deleteRecap
}: {
  recaps: Recap[];
  deleteRecap: (index: number) => void;
}) => {
  const reversedRecaps = recaps.slice().reverse();

  return (
    <Stack spacing={2}>
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
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }}
        data={{
          labels: reversedRecaps.map(recap => format(recap.date, 'dd/MM')),
          datasets: [
            {
              label: 'Status',
              data: reversedRecaps.map(recap => recap.general_score),

              segment: {
                borderColor:
                  meanGeneralScore(reversedRecaps) > 0.5 ? 'red' : '#5b59f3'
              },
              backgroundColor:
                meanGeneralScore(reversedRecaps) > 0.5 ? 'red' : '#5b59f3',
              fill: true
            }
          ]
        }}
      />
      {recaps.length > 0 && (
        <Card>
          <Stack direction='row' justifyContent='space-between'>
            <Avatar src={recaps[0].image} />
            <IconButton onClick={() => deleteRecap(0)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Typography level='h4'>
            {recaps[0].sentiment} {recaps[0].general_score * 100}%
          </Typography>
          {recaps[0].general_score < 0.3 ? (
            <Typography level='h3' color='success'>
              Good
            </Typography>
          ) : recaps[0].general_score < 0.7 ? (
            <Typography level='h3' color='warning'>
              Average
            </Typography>
          ) : (
            <Typography level='h3' color='danger'>
              Bad
            </Typography>
          )}

          <Typography level='h4'>{recaps[0].date}</Typography>
        </Card>
      )}
      {recaps.slice(1).map((recap, index) => (
        <Card key={format(recap.date, 'dd/MM/yyyy')}>
          <Stack direction='row' justifyContent='space-between'>
            <Avatar src={recap.image} />
            <Stack direction='row' spacing={2} alignItems='center'>
              <Typography
                level='h4'
                sx={{
                  color: '#5b59f3'
                }}
              >
                {format(recap.date, 'dd/MM/yyyy')}
              </Typography>
              <IconButton onClick={() => deleteRecap(index)}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </Stack>
          {recap.general_score < 0.3 ? (
            <Typography level='h3' color='success'>
              Good
            </Typography>
          ) : recap.general_score < 0.7 ? (
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
