import Head from 'next/head'
import styled from 'styled-components'
import Sidebar from '../../components/Sidebar'
import ChatScreen from '../../components/ChatScreen'
import { auth, db } from '../../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import getRecipientEmail from '../../utils/getRecipientEmail'

function Chat({ chat, messages }) {
  const [user] = useAuthState(auth)

  return (
    <Container>
      <Head>
        {/*This head will allow to change the head of different pages*/}
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  )
}

export default Chat

//Server side rendering is done before the page loads
export async function getServerSideProps(context) {
  /*All this code happens inside the server */
  const ref = db.collection('chats').doc(context.query.id)

  // Prep the message on the server
  const messageRes = await ref
    .collection('messages')
    .orderBy('timestamp', 'asc')
    .get()

  // Prep the messages in  server before giving to the client
  const messages = messageRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }))

  // Prep the chats
  const chatRes = await ref.get()
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  }

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  }
}

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`

const Container = styled.div`
  display: flex;
`
