import { Box, Button, Typography, colors } from "@mui/material";
import { Link } from "react-router-dom";

function InitialMenu() {
  const uuid = crypto.randomUUID();

  return (
    <Box
      display="flex"
      width={1}
      height={1}
      alignItems="center"
      justifyContent="center"
      bgcolor={colors.blueGrey[100]}
    >
      <Box
        display="flex"
        flexDirection="column"
        padding={6}
        borderRadius={2}
        boxShadow={10}
        bgcolor={colors.blueGrey[50]}
      >
        <Typography variant="h3">Chessy Mate</Typography>
        <Link to={"local"}>
          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 4,
            }}
          >
            LOCAL GAME
          </Button>
        </Link>
        <Link to={"online/" + uuid}>
          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
            }}
          >
            ONLINE GAME
          </Button>
        </Link>
      </Box>
    </Box>
  );
}

export default InitialMenu;
