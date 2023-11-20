import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserActions } from "../../store/UserSlice";
import {
  Button,
  AppBar,
  Toolbar,
  Stack,
  Modal,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import CreateEventForm from "../CreateEventForm/CreateEventForm";
import DeleteIcon from "@mui/icons-material/Delete";
import { EventActions } from "../../store/EventSlice";
import { fetchUsers } from "../../store/UserSlice";
import InviteForm from "../InviteForm/InviteForm";
import { usersList, eventsList, currentUser } from "../../store/selectors";

const Account = () => {
  const dispatch = useDispatch();
  const users = useSelector(usersList);
  const user = useSelector(currentUser);
  const events = useSelector(eventsList);

  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleEventDelete = (eventObject) => {
    dispatch(EventActions.deleteEvent(eventObject));
  };
  useEffect(() => {
    console.log(events);
  });
  useEffect(() => {
    dispatch(UserActions.getUser());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleLogOut = (event) => {
    event.preventDefault();
    dispatch(UserActions.logOut());
    navigate("/login");
  };

  const isFirstUser = () => {
    if (users.length === 1) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <div className="user-inner">
        <AppBar>
          <Toolbar>
            <h2>Hello, {user.name}</h2>
            <Stack spacing={2} direction="row">
              <Button
                variant="text"
                type="submit"
                size="large"
                onClick={handleOpenModal}
                disabled={isFirstUser()}
              >
                Create event
              </Button>
              <Button
                variant="text"
                type="submit"
                size="large"
                onClick={handleLogOut}
              >
                <LogoutIcon />
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        {isFirstUser() === true && (
          <>
            <Alert severity="info">
              Congratulation you are first client, please invite you friends
              (college's)
              <InviteForm />
            </Alert>
          </>
        )}

        {events.length === 0 ? (
          <Typography variant="h6" align="center" mt={6}>
            No events available.
          </Typography>
        ) : (
          <List>
            {events.map((event) => (
              <ListItem
                key={event.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleEventDelete(event)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={event.eventName}
                  secondary={
                    <>
                      <Typography variant="body1">
                        Description: {event.description}
                      </Typography>
                      <Typography variant="body2">
                        User: {event.selectedUser}
                      </Typography>
                      <Typography variant="body2">
                        Date: {event.dateTime}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="child-modal-title"
        >
          <Box className="modal">
            <h2 id="child-modal-title">Create new event</h2>
            <CreateEventForm onCloseModal={handleCloseModal} />
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default Account;
