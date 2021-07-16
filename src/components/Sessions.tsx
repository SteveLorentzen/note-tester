import * as React from "react";
import {Button, Flex, Input, Heading} from "@chakra-ui/react";
import {useHistory} from "react-router-dom";
import {useFirestore, useUser, useFirestoreDocData} from "reactfire";
import Header from "./Header";
import styled from "@emotion/styled";
import {clefs} from "../constants";

const SessionButton = styled(Button)`
  margin-top: 1rem;
  background-color: var(--main-color);
  border: 1px solid black;
  border-radius: 5px;
  padding: 1.3rem 5rem;
  font-size: 1.5rem;
  height: 3rem;
`;

const SessionBox = styled(Flex)`
  flex-direction: column;
  width: 30%;
  min-width: 22rem;
  justify-content: space-between;
  margin: 0 4rem 5rem 4rem;
`;
interface IUser {
  uid: string;
  email: string;
  hostSessionId: string;
  displayName: string;
  photoURL: string;
}

const Sessions: React.FC = () => {
  const [sessionCodeInput, setSessionCodeInput] = React.useState("");

  const [errorMessage, setErrorMessage] = React.useState("");

  const {data} = useUser();

  const history = useHistory();

  const sessionsRef = useFirestore().collection("sessions");

  const userRef = useFirestore().collection("users").doc(data.uid);
  const userDoc = useFirestoreDocData<IUser>(userRef).data;

  const createSessionCode = async (number: number) => {
    const charArray = [];
    const newSessionIdArray = [];
    for (let i = 48; i <= 57; i++) {
      charArray.push(String.fromCharCode(i));
    }
    for (let i = 65; i <= 90; i++) {
      charArray.push(String.fromCharCode(i));
    }
    for (let i = 0; i < number; i++) {
      newSessionIdArray.push(
        charArray[Math.floor(Math.random() * charArray.length)]
      );
    }
    const newCode = newSessionIdArray.join("");
    try {
      const sessionsQuery = sessionsRef.where("sessionCode", "==", newCode);
      const sessionsWithThatCode = await sessionsQuery.get();
      if (sessionsWithThatCode.docs.length === 0) {
        return newCode;
      }
      return;
    } catch (err) {
      console.log(err);
    }
  };

  const createBatch = useFirestore().batch();

  const handleCreateSession = async () => {
    setErrorMessage("");
    let oldSessionId;
    if (userDoc?.hostSessionId !== "") {
      oldSessionId = userDoc?.hostSessionId;
    }

    if (oldSessionId) {
      createBatch.delete(sessionsRef.doc(oldSessionId));
    }

    try {
      const newSessionCode = await createSessionCode(6);

      if (!newSessionCode) {
        setErrorMessage("please try again, something went wrong");
        return;
      }

      const newSessionRef = sessionsRef.doc();

      createBatch.set(newSessionRef, {
        answer: "",
        answerStatus: "",
        displayingNotes: false,
        sessionCode: newSessionCode,
        hostId: data.uid,
        guestId: "",
        identifiedNotes: 0,
        totalNotes: 0,
        selectedNote: "",
        selectedClef: clefs.TREBLE,
        mnemonics: {
          showLinesOnStaff: false,
          showSpacesOnStaff: false,
        },
      });

      createBatch.update(userRef, {hostSessionId: newSessionRef.id});

      await createBatch.commit();

      history.push(`/hosted-session/${newSessionRef.id}`);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const joinBatch = useFirestore().batch();

  const handleJoinSession = async () => {
    console.log("running...");
    setErrorMessage("");
    console.log("running2...");
    try {
      console.log("running3...");
      const sessionToJoin = await sessionsRef
        .where("sessionCode", "==", sessionCodeInput.toUpperCase())
        .get();

      console.log("running4...");
      if (sessionToJoin.docs.length > 0) {
        const sessionToJoinId = sessionToJoin.docs[0].id;
        console.log("running5...");
        joinBatch.update(sessionsRef.doc(sessionToJoinId), {guestId: data.uid});
        joinBatch.update(userRef, {guestSessionId: sessionToJoinId});
        await joinBatch.commit();
        console.log(sessionToJoinId);
        history.push(`/guest-session/${sessionToJoinId}`);
        console.log("made it here too!");
      } else {
        setErrorMessage("Please enter a valid code.");
      }
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleSessionCodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSessionCodeInput(e.target.value);
  };

  return (
    <Flex width="100%" direction="column" align="center" position="relative">
      <Header />
      <Heading as="h6" color="red" size="md" padding="1rem">
        {errorMessage}
      </Heading>
      <Flex w="95%" justify="center" flexWrap="wrap" maxWidth="120rem">
        <SessionBox>
          <Flex direction="column">
            <Heading
              as="h1"
              fontSize="2.3rem"
              fontWeight="500"
              marginBottom="2rem"
            >
              <span style={{color: "var(--main-color-dark)"}}>Create</span> a
              new session
            </Heading>
            <Flex
              display={{base: "none", sm: "flex"}}
              direction="column"
              fontSize="1.5rem"
              justify="space-between"
              marginBottom="2rem"
            >
              <p style={{marginBottom: "2rem"}}>
                You’ll get a session code you can send to a student. The app
                will keep score as they identify notes on the staff.
              </p>
              <p>
                You can display helpful mnemonics on the treble staff and bass
                staff, and show the note names on the keyboard.
              </p>
            </Flex>
          </Flex>

          <Flex direction="column" justifyContent="flex-end">
            <SessionButton onClick={handleCreateSession} bg="purple">
              Host Session
            </SessionButton>
          </Flex>
        </SessionBox>

        <SessionBox>
          <Flex direction="column">
            <Heading
              as="h1"
              fontSize="2.3rem"
              fontWeight="500"
              marginBottom="2rem"
            >
              {" "}
              <span style={{color: "var(--main-color-dark)"}}>Join</span> a
              session
            </Heading>
            <Flex
              display={{base: "none", sm: "flex"}}
              direction="column"
              fontSize="1.5rem"
              justify="space-between"
              marginBottom="2rem"
            >
              <p style={{marginBottom: "2rem"}}>
                Did your music teacher say something about entering a code
                somewhere? Enter it below and join their session to learn how to
                read notes!
              </p>
              <p>You’ll be amazing in no time!</p>
            </Flex>
          </Flex>

          <Flex direction="column" justify="flex-end">
            <Input
              value={sessionCodeInput}
              placeholder="Session Code"
              onChange={handleSessionCodeInput}
            />
            <SessionButton onClick={handleJoinSession}>
              Join Session
            </SessionButton>
          </Flex>
        </SessionBox>
      </Flex>
    </Flex>
  );
};

export {Sessions};
