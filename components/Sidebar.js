import { Avatar, Button, IconButton } from '@material-ui/core'
import styled from 'styled-components'
import ChatIcon from '@material-ui/icons/Chat'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import SearchIcon from '@material-ui/icons/Search'
import * as EmailValidator from 'email-validator'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import Chat from '../components/Chat'
import { auth, db } from '../firebase'

function Sidebar() {
  const [user, loading] = useAuthState(auth)
  //Get all the chats from database
  const userChatRef = db
    .collection('chats')
    .where('users', 'array-contains', user.email)

  //Get the latest snapshot from the db
  const [chatsSnapshot] = useCollection(userChatRef)

  const createChat = () => {
    const input = prompt('Please enter an email you wish to chat with.')

    if (!input) return null

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      // Add the chat to the db 'chats' collection if it doesnt already exist and is valid
      db.collection('chats').add({
        users: [user.email, input],
      })
    }
  }

  const chatAlreadyExists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    )

  return (
    <Container>
      <Header>
        <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />

        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>

      <Search>
        <SearchIcon />
        <SearchInput placeholder='Search in chats' />
      </Search>

      <SideBarButton onClick={createChat}>Start a new chat</SideBarButton>

      {/* List of chats*/}
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  )
}

export default Sidebar

const SideBarButton = styled(Button)`
  width: 100%;
  && {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
    font-weight: 600;
  }
`

const SearchInput = styled.input`
  flex: 1;
  outline-width: 0;
  border: none;
`

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`

const IconsContainer = styled.div``

const UserAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`
const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  /* Hide scrollbar for Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`
