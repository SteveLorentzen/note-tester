import * as React from "react";
import {trebleNotes, bassNotes} from "../constants";
import {getBassNoteRange, getRandomNote, getTrebleNoteRange} from "../helpers";
import {presets, clefs} from "../constants";
import ClefCheckbox from "./ClefCheckbox";
import AutoQuizModal from "./FormModal";
import IncludeAccidentals from "./IncludeAccidentals";
import {IAutoQuiz} from "../interfacesAndTypes";

const AutoQuiz: React.FC<{
  onClose: () => void;
  isOpen: boolean;
  selectedNote: string;
  currentSettings: IAutoQuiz;
  onSubmit: (
    autoDoc: IAutoQuiz,
    selectedNote: string,
    selectedClef: clefs
  ) => void;
  submitText: string;
  cancelButton?: boolean;
}> = ({
  onClose,
  isOpen,
  selectedNote,
  onSubmit,
  currentSettings,
  submitText,
  cancelButton,
}) => {
  const [lowTrebleNote, setLowTrebleNote] = React.useState<
    trebleNotes | string
  >(trebleNotes.C3);
  const [highTrebleNote, setHighTrebleNote] = React.useState<
    trebleNotes | string
  >(trebleNotes.A6);
  const [lowBassNote, setLowBassNote] = React.useState<bassNotes | string>(
    bassNotes.E1
  );
  const [highBassNote, setHighBassNote] = React.useState<bassNotes | string>(
    bassNotes.C5
  );
  const [includeSharps, setIncludeSharps] = React.useState(true);
  const [includeFlats, setIncludeFlats] = React.useState(true);
  const [includeTreble, setIncludeTreble] = React.useState(true);
  const [includeBass, setIncludeBass] = React.useState(true);
  const [treblePreset, setTreblePreset] = React.useState<presets | string>(
    presets.CUSTOM
  );
  const [bassPreset, setBassPreset] = React.useState<presets | string>(
    presets.CUSTOM
  );

  const resetAutoQuizFields = React.useCallback(() => {
    if (currentSettings) {
      const {
        lowBassNote,
        lowTrebleNote,
        highBassNote,
        highTrebleNote,
        includeBass,
        includeFlats,
        includeSharps,
        includeTreble,
        bassPreset,
        treblePreset,
      } = currentSettings;
      setLowTrebleNote(lowTrebleNote);
      setHighTrebleNote(highTrebleNote);
      setLowBassNote(lowBassNote);
      setHighBassNote(highBassNote);
      setIncludeTreble(includeTreble);
      setIncludeBass(includeBass);
      setIncludeSharps(includeSharps);
      setIncludeFlats(includeFlats);
      setBassPreset(bassPreset);
      setTreblePreset(treblePreset);
    }
  }, [currentSettings]);

  React.useEffect(() => {
    resetAutoQuizFields();
  }, [resetAutoQuizFields]);

  React.useEffect(() => {
    const {lowTrebleNote, highTrebleNote} = getTrebleNoteRange(treblePreset);
    setLowTrebleNote(lowTrebleNote);
    setHighTrebleNote(highTrebleNote);
  }, [treblePreset]);

  React.useEffect(() => {
    const {lowBassNote, highBassNote} = getBassNoteRange(bassPreset);
    setLowBassNote(lowBassNote);
    setHighBassNote(highBassNote);
  }, [bassPreset]);

  const handleModalClose = () => {
    onClose();
  };

  const handleQuiz = async () => {
    if (!includeBass && !includeTreble) {
      return;
    }
    const result = getRandomNote(
      {
        on: true,
        includeFlats,
        includeSharps,
        includeTreble,
        includeBass,
        lowTrebleNote: lowTrebleNote,
        highTrebleNote: highTrebleNote,
        lowBassNote: lowBassNote,
        highBassNote: highBassNote,
        bassPreset,
        treblePreset,
      },
      selectedNote
    );
    if (!result) {
      const err = new Error();
      err.message = "Generating a random note failed";
      throw err;
    }
    const randomNote = result.randomNote;
    const randomClef = result.randomClef;
    // custom onSubmit function passed in from outside
    try {
      onSubmit(
        {
          on: true,
          includeFlats,
          includeSharps,
          includeTreble,
          includeBass,
          lowTrebleNote: lowTrebleNote,
          highTrebleNote: highTrebleNote,
          lowBassNote: lowBassNote,
          highBassNote: highBassNote,
          bassPreset,
          treblePreset,
        },
        randomNote,
        randomClef
      );
    } catch (err) {
      console.log(err);
    }
    onClose();
  };

  console.log(
    includeFlats,
    includeSharps,
    includeTreble,
    includeBass,
    lowTrebleNote,
    highTrebleNote,
    lowBassNote,
    highBassNote
  );

  return (
    <>
      <AutoQuizModal
        isOpen={isOpen}
        handleModalClose={handleModalClose}
        handleQuiz={handleQuiz}
        submitText={submitText}
        cancelButton={cancelButton}
      >
        <form>
          <ClefCheckbox
            clefName={"Treble"}
            clefOnChange={() => setIncludeTreble((prevBool) => !prevBool)}
            includeClef={includeTreble}
            setPreset={(e) => setTreblePreset(e.target.value)}
            preset={treblePreset}
            setLowNote={setLowTrebleNote}
            lowNote={lowTrebleNote}
            setHighNote={setHighTrebleNote}
            highNote={highTrebleNote}
            notesArray={Object.keys(trebleNotes)}
          />

          <ClefCheckbox
            clefName="Bass"
            clefOnChange={() => setIncludeBass((prevBool) => !prevBool)}
            includeClef={includeBass}
            setPreset={(e) => setBassPreset(e.target.value)}
            preset={bassPreset}
            setLowNote={setLowBassNote}
            lowNote={lowBassNote}
            setHighNote={setHighBassNote}
            highNote={highBassNote}
            notesArray={Object.keys(bassNotes)}
          />

          <IncludeAccidentals
            setIncludeSharps={() => setIncludeSharps((prevBool) => !prevBool)}
            setIncludeFlats={() => setIncludeFlats((prevBool) => !prevBool)}
            includeSharps={includeSharps}
            inlcudeFlats={includeFlats}
          />
        </form>
      </AutoQuizModal>
    </>
  );
};

export default AutoQuiz;
