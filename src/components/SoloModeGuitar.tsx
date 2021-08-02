import * as React from "react";
import Staff from "./Staff";
import Header from "./Header";
import GuestScore from "./GuestScore";
import {answerStatusOptions, clefs, trebleNotes} from "../constants";
import {useDisclosure, Button, Heading, Flex} from "@chakra-ui/react";
import {IAutoQuiz, IUser} from "../interfacesAndTypes";
import {useUser, useFirestore, useFirestoreDocData} from "reactfire";
import {checkAnswer, getRandomNote} from "../helpers";
import HelperButtons from "./HelperButtons";
import {Guitar} from "./Guitar";
import AutoQuizModal from "./FormModal";
import {useHistory} from "react-router-dom";

const SoloModeGuitar: React.FC = () => {
  const [answer, setAnswer] = React.useState("");
  //   const [selectedClef, setSelectedClef] = React.useState<clefs | string>(
  //     clefs.TREBLE
  //   );
  const [selectedNote, setSelectedNote] = React.useState("");
  const [showLinesOnStaff, setShowLinesOnStaff] = React.useState(false);
  const [showSpacesOnStaff, setShowSpacesOnStaff] = React.useState(false);
  const [answerStatus, setAnswerStatus] = React.useState("");
  const [displayingNotes, setDisplayingNotes] = React.useState(false);
  //   const [activeInstrument, setActiveInstrument] = React.useState<instruments>(
  //     instruments.GUITAR
  //   );

  const [total, setTotal] = React.useState(0);
  const [correct, setCorrect] = React.useState(0);

  const history = useHistory();

  const {isOpen, onOpen, onClose} = useDisclosure();

  const {data} = useUser();

  const userRef = useFirestore().collection("users").doc(data?.uid);

  const userDoc = useFirestoreDocData<IUser>(userRef).data;

  const notes = Object.keys(trebleNotes);

  React.useEffect(() => {
    // for this component the "on" field only determines if the settings have ever been set"
    if (userDoc && !userDoc.soloSettings.on) {
      onOpen();
    }
  }, [onOpen, userDoc?.soloSettings.on, userDoc]);

  React.useEffect(() => {
    if (
      userDoc &&
      // only run this if the document has set at least one clef before
      (userDoc.soloSettings.includeTreble || userDoc.soloSettings.includeBass)
    ) {
      const {randomNote} = getRandomNote(userDoc?.soloSettings, "");
      setSelectedNote(randomNote);
    }
  }, [userDoc?.soloSettings, userDoc]);

  // will be used in the settings modal
  const updateSettings = async (autoDoc: IAutoQuiz, selectedNote: string) => {
    setSelectedNote(selectedNote);
    try {
      await userRef.update({soloSettings: autoDoc});
    } catch (err) {
      console.log(err);
    }
  };

  const handleAnswer = (note: string) => {
    const answerIsCorrect = checkAnswer(note, notes, selectedNote);

    setTotal((prevTotal) => prevTotal + 1);
    if (answerIsCorrect) {
      setAnswerStatus(answerStatusOptions.CORRECT);
      setCorrect((prevCorrect) => prevCorrect + 1);
    } else {
      setAnswerStatus(answerStatusOptions.INCORRECT);
    }
  };

  const handleSelectNote = (note: string) => {
    const {randomNote} = getRandomNote(userDoc?.soloSettings, selectedNote);
    setAnswer(note);

    handleAnswer(note);

    setTimeout(() => {
      setSelectedNote(randomNote);
      setAnswer("");
      setAnswerStatus("");
    }, 1000);
  };

  const resetScore = () => {
    setTotal(0);
    setCorrect(0);
  };

  return (
    <>
      <Header />

      <Flex
        position="absolute"
        margin="1.5rem auto -1rem auto"
        justify="space-between"
        padding="0 2rem"
        direction="column"
      >
        <Button
          onClick={onOpen}
          marginBottom="1rem"
          position="relative"
          zIndex="20"
        >
          Settings
        </Button>
        <Button
          w="8rem"
          position="relative"
          zIndex="20"
          onClick={() => history.push("/solo-mode/keyboard")}
        >
          Keyboard &rarr;
        </Button>
      </Flex>

      <Staff
        selectedClef={clefs.TREBLE}
        selectedNote={selectedNote}
        showLinesOnStaff={showLinesOnStaff}
        showSpacesOnStaff={showSpacesOnStaff}
      />
      <Flex w="100%" justify="space-between" position="relative">
        <Flex
          marginBottom="1rem"
          marginLeft="5%"
          direction="column"
          marginTop={{base: "-4.5rem", md: "-4.5rem"}}
        >
          <HelperButtons
            displayingNotes={displayingNotes}
            showLinesOnStaff={showLinesOnStaff}
            setDisplayingNotes={() =>
              setDisplayingNotes((prevBool) => !prevBool)
            }
            setShowLinesOnStaff={() =>
              setShowLinesOnStaff((prevBool) => !prevBool)
            }
            setShowSpacesOnStaff={() =>
              setShowSpacesOnStaff((prevBool) => !prevBool)
            }
            showSpacesOnStaff={showSpacesOnStaff}
          />

          <GuestScore
            totalNotes={total}
            reset={resetScore}
            identifiedNotes={correct}
            canControl
          />
        </Flex>
        <Heading
          as="h2"
          marginRight="1rem"
          alignSelf="flex-end"
          position="absolute"
          fontSize={{base: "1.5rem", md: "2rem"}}
          right={{base: "0", md: "5%"}}
          bottom={{base: "0", md: "1rem"}}
        >
          {!answer
            ? null
            : answerStatus === answerStatusOptions.CORRECT
            ? "Correct!"
            : "Incorrect :("}
        </Heading>
      </Flex>

      <Guitar
        answer={answer}
        answerStatus={answerStatus}
        displayingNotes={displayingNotes}
        selectedNote={selectedNote}
        setSelectedNote={handleSelectNote}
      />
      <AutoQuizModal
        submitText="Save"
        handleModalClose={onClose}
        isOpen={isOpen}
        handleQuiz={() => console.log("quiz!!")}
      ></AutoQuizModal>
    </>
  );
};

export default SoloModeGuitar;