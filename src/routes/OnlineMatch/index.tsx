import { Link } from "@mui/material";
import {
  child,
  get,
  onDisconnect,
  onValue,
  ref,
  set,
  update,
} from "firebase/database";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Table from "../../components/Table";
import { database } from "../../firebase";
import useGameData from "../../hooks/useGameData";
import { Move, TableType } from "../../models/basicTypes";
import { fenToTable, tableToFen } from "../../utils/piecesMoves/general";

function OnlineMatch() {
  const matchId = useParams<{ id: string }>().id;
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [opponentData, setOpponentData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMatchFull, setIsMatchFull] = useState(false);
  const updateMatch = (table: TableType, moves: Move[]) => {
    const currentGameRef = ref(database, `matches/${matchId}/currentGame`);
    update(currentGameRef, {
      fen: tableToFen(table),
      moves,
    });
  };

  const {
    isCheck,
    isMate,
    onClickSquare,
    selectedSquare,
    table,
    turn,
    possibleMovesOfSelected,
    updateLocalData,
  } = useGameData({
    onMove: updateMatch,
    playerColor: playerId === "p1" ? "white" : "black",
  });

  const onInit = async () => {
    const matchRef = ref(database, "matches/" + matchId);
    const playersRef = child(matchRef, "players");
    const playersSnapshot = await get(playersRef);
    const players = playersSnapshot.val();
    if (players) {
      const notConnectedPlayerId = Object.entries(players).find(
        ([, player]: any) => player.status !== "connected"
      )?.[0];
      const opponentId = Object.keys(players).find(
        (id: any) => id !== notConnectedPlayerId
      )!;
      if (notConnectedPlayerId) {
        const notConnectedPlayerRef = child(playersRef, notConnectedPlayerId);
        update(notConnectedPlayerRef, {
          status: "connected",
        });
        setPlayerId(notConnectedPlayerId);
        const opponentRef = child(playersRef, opponentId);
        onValue(opponentRef, (snapshot) => {
          const opponentData = snapshot.val();
          setOpponentData(opponentData);
        });
      } else {
        setIsMatchFull(true);
      }
    } else {
      set(matchRef, {
        players: {
          p1: {
            status: "connected",
            name: "player1",
          },
          p2: {
            status: "waiting",
            name: "player2",
          },
        },
        matchHistory: [],
      });
      setPlayerId("p1");
      const player2Ref = child(playersRef, "p2");
      onValue(player2Ref, (snapshot) => {
        const player2Data = snapshot.val();
        setOpponentData(player2Data);
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (playerId) {
      const thisPlayerRef = ref(
        database,
        `matches/${matchId}/players/${playerId}`
      );
      onDisconnect(thisPlayerRef).update({
        status: "disconnected",
      });
    }
  }, [matchId, playerId]);

  useEffect(() => {
    onInit();
    const currentGameRef = ref(database, "matches/" + matchId + "/currentGame");
    onValue(currentGameRef, (snapshot) => {
      const data = snapshot.val();
      const moves = data.moves || [];
      const fen = data.fen;
      updateLocalData(fenToTable(fen), moves);
    });
  }, []);

  useEffect(() => {
    if (isMate) {
      alert("checkmate");
    }
  }, [isMate]);

  if (loading) {
    return <div>loading...</div>;
  }
  if (isMatchFull) {
    return <div>Match is full</div>;
  }
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p>
        {opponentData?.name} {opponentData?.status}{" "}
      </p>

      <div
        style={{
          width: "30%",
        }}
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
      </div>
      <p>{playerId}</p>
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
    </div>
  );
}
export default OnlineMatch;
