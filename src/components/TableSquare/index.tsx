import boardColors from "../../styles/board/boardColors";

const getPieceImage = (piece?: string | null): any => {
  if (!piece) return null;
  // itentify if the piece is white or black
  const isWhite = piece === piece.toUpperCase();
  // get the piece image name
  const imageName = `${piece.toUpperCase()}_${isWhite ? "W" : "B"}`;
  const pieceImage = require(`../../assets/images/pieces/${imageName}.svg`);
  return pieceImage;
};

type StateType = "default" | "selected" | "possible";
interface TableSquareProps {
  color: BoardColor;
  piece: string | null;
  state?: StateType;
  name: string;
  onClick?: () => void;
}

type BoardColor = "white" | "black";

const TableSquare = ({
  color = "white",
  piece = "p",
  state = "default",
  onClick,
  name,
}: TableSquareProps) => {
  const pieceImage = getPieceImage(piece);

  return (
    <div
      style={{
        width: 50,
        height: 50,
        backgroundColor: boardColors[color][state],
      }}
      onClick={onClick}
    >
      {name}
      {piece && (
        <img
          src={pieceImage}
          alt="piece"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      )}
    </div>
  );
};

export default TableSquare;
