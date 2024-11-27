import { Box, Button } from '@mui/material';
import Typography from '@mui/material/Typography';

export default function Custom500(): JSX.Element {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
    >
      <Typography sx={{ color: 'white' }} variant="h4">
        500 - Server-side error occurred
      </Typography>
      <Button variant="contained">Return to home page</Button>
    </Box>
  );
}
