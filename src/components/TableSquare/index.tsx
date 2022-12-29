const getPieceImage = (piece?: string | null): any => {
  if (!piece) return null;
  // itentify if the piece is white or black
  const isWhite = piece === piece.toUpperCase();
  // get the piece image name
  const imageName = `${piece.toUpperCase()}_${isWhite ? "W" : "B"}`;
  const pieceImage = require(`../../assets/images/pieces/${imageName}.svg`);
  return pieceImage;
};

interface TableSquareProps {
  color?: "white" | "black";
  piece: string | null;
}

const TableSquare = ({ color = "white", piece = "p" }: TableSquareProps) => {
  const colors: { [key: string]: string } = {
    white: "white",
    black: "brown",
  };

  const pieceImage = getPieceImage(piece);

  return (
    <div
      style={{
        width: 50,
        height: 50,
        backgroundColor: colors[color],
      }}
    >
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
