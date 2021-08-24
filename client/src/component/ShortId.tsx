import React from "react";

const ShortId = ({id}: { id: string }) => {
  let showId = id;
  if (id.length > 15) {
    const start = id.slice(0, 10);
    const end = id.slice(-5);
    showId = `${start}...${end}`;
  }
  return (
    <>
      {showId}
    </>
  )
}

export default ShortId;