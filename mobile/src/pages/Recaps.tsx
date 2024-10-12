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
          labels: recaps.map(recap => format(recap.date, 'dd/MM')),
          datasets: [
            {
              label: 'Status',
              data: recaps.map(recap => recap.general_score),

              segment: {
                borderColor: meanGeneralScore(recaps) > 0.5 ? 'red' : '#22E39E'
              },
              backgroundColor:
                meanGeneralScore(recaps) > 0.5 ? 'red' : '#22E39E',
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
          <Typography level='h4'>{recaps[0].description}</Typography>
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

          <Typography level='h4'>
            {format(new Date(recaps[0].date), 'dd/MM/yyyy')}
          </Typography>

          <Typography level='h4'>
            General Score: {recaps[0].general_score}
          </Typography>
        </Card>
      )}
      {recaps.map((recap, index) => (
        <Card key={format(recap.date, 'dd/MM/yyyy')}>
          <Stack direction='row' justifyContent='space-between'>
            <Avatar src={recap.image} />
            <Stack direction='row' spacing={2} alignItems='center'>
              <Typography
                level='h4'
                sx={{
                  color: '#22E39E'
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
