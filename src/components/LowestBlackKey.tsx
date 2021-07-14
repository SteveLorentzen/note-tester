import * as React from "react";
import {blackKeyWidth, answerStatus} from "../constants";
import {BlackKey} from "../styles";
import {useSession} from "../hooks";
import CheckMark from "./CheckMark";

type LowestBlackKeyProps = {
  selectedNote: string;
  ind: number;
  setSelectedNote: (note: string) => void;
  thisBlackKeyIsSelected: (note: string, ind: number) => boolean;
  note: string;
  sessionId: string;
  isGuestKeyboard: boolean;
};

const LowestBlackKey: React.FC<LowestBlackKeyProps> = ({
  ind,
  setSelectedNote,
  note,
  sessionId,
  children,
  isGuestKeyboard,
  thisBlackKeyIsSelected,
}) => {
  const {sessionDoc} = useSession(sessionId);

  // TODO: fix bug where Eb is highlighted when E# is selected!
  const determineBackgroundColor = () => {
    let backgroundColor = "";
    if (isGuestKeyboard) {
      if (
        thisBlackKeyIsSelected(note, ind) &&
        sessionDoc?.answerStatus === answerStatus.CORRECT
      ) {
        backgroundColor = "var(--main-color)";
      } else if (
        thisBlackKeyIsSelected(note, ind) &&
        note[0] + "b" + note[1] === sessionDoc?.selectedNote
      ) {
        backgroundColor = "var(--main-color)";
      } else if (
        thisBlackKeyIsSelected(note, ind) &&
        sessionDoc?.answerStatus === answerStatus.INCORRECT
      ) {
        backgroundColor = "red";
      }
    } else {
      if (
        thisBlackKeyIsSelected(note, ind) &&
        sessionDoc?.answerStatus === answerStatus.CORRECT
      ) {
        backgroundColor = "var(--main-color)";
      } else if (
        thisBlackKeyIsSelected(note, ind) &&
        sessionDoc?.selectedNote[1] === "b"
      ) {
        console.log(note);
        backgroundColor = "var(--main-color)";
      } else if (
        note[0] + "b" + note[1] === sessionDoc?.answer &&
        sessionDoc?.answerStatus === answerStatus.INCORRECT
      ) {
        backgroundColor = "red";
      }
    }

    return backgroundColor;
  };

  return (
    <BlackKey
      left={`calc((-${blackKeyWidth} / 2))`}
      style={{
        backgroundColor: determineBackgroundColor(),
        color: thisBlackKeyIsSelected(note, ind) ? "black" : "",
      }}
      onClick={() => setSelectedNote(note[0] + "b" + note[1])}
    >
      {children}
      {!isGuestKeyboard &&
      thisBlackKeyIsSelected(note, ind) &&
      sessionDoc?.answerStatus === answerStatus.CORRECT ? (
        <CheckMark />
      ) : null}
    </BlackKey>
  );
};

export default LowestBlackKey;
