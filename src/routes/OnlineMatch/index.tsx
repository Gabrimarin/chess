import { Box, Link, Typography, colors } from "@mui/material";
import { NavLink, useParams } from "react-router-dom";
import Table from "../../components/Table";
import { useOnlineMatch } from "./useOnlineMatch";

function OnlineMatch() {
  const matchId = useParams<{ id: string }>().id;

  const {
    loading,
    isMatchFull,
    isCheck,
    onClickSquare,
    opponentData,
    possibleMovesOfSelected,
    selectedSquare,
    table,
    playerId,
    turn,
  } = useOnlineMatch({ matchId: matchId! });

  if (loading) {
    return <div>loading...</div>;
  }
  if (isMatchFull) {
    return (
      <Box
        display="flex"
        width={1}
        height={1}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Typography variant="h2">This game is full</Typography>
        <NavLink to={"/online/" + matchId}>
          <Typography variant="h4">Refresh</Typography>
        </NavLink>
        <NavLink to={"/"}>
          <Typography variant="h4">Back to menu</Typography>
        </NavLink>
      </Box>
    );
  }
  return (
    <Box
      display="flex"
      width={1}
      height={1}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      bgcolor={colors.blueGrey[100]}
    >
      <Typography variant="h5">
        {opponentData?.name} ({opponentData?.status}){" "}
      </Typography>
      <Box
        my={2}
        width={
          window.innerWidth > window.innerHeight
            ? window.innerHeight * 0.6
            : window.innerWidth * 0.6
        }
      >
        <Table
          table={table}
          selected={selectedSquare}
          onClickSquare={onClickSquare}
          possibleMoves={possibleMovesOfSelected}
          isCheck={isCheck}
          turn={turn}
          rotateBoard={playerId === "p2"}
          rotatePiecesOfColor={playerId === "p2" ? "both" : null}
        />
      </Box>

      <Typography variant="h5">{playerId}</Typography>
      {opponentData?.status === "waiting" && (
        <Link
          onClick={() => {
            navigator.share({
              title: "ChessyMate",
              text: "Play chess with me",
              url: window.location.href,
            });
          }}
        >
          Share this game
        </Link>
      )}
    </Box>
  );
}
export default OnlineMatch;
