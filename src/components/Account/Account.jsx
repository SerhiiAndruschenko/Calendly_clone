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
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import { fetchUsers } from "../../store/UserSlice";
import InviteForm from "../InviteForm/InviteForm";
import { usersList, eventsList, currentUser } from "../../store/selectors";
import { fetchEvents } from "../../store/EventSlice";
import { removeUserFromEvent, changeEventStatus } from "../../store/EventSlice";

const Account = () => {
  const dispatch = useDispatch();
  const users = useSelector(usersList);
  const loggedInUser = useSelector(currentUser);
  const events = useSelector(eventsList);
  const [userEvents, setUserEvents] = useState([]);

  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  useEffect(() => {
    dispatch(UserActions.getUserId());
    dispatch(fetchEvents(loggedInUser.id));
  }, [dispatch, users, loggedInUser.id]);

  const handleEventDelete = (eventID) => {
    dispatch(
      removeUserFromEvent({ eventId: eventID, userId: loggedInUser.id })
    );
  };

  const handleStatusChange = (eventID, status) => {
    dispatch(
      changeEventStatus({
        eventId: eventID,
        userId: loggedInUser.id,
        status: status,
      })
    );
  };

  const handleLogOut = (event) => {
    event.preventDefault();
    dispatch(UserActions.logOut());
    navigate("/login");
  };

  const handleEditEvent = (eventID) => {
    console.log(eventID);
  };

  const isFirstUser = () => {
    if (users.length === 1) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    setUserEvents(events);
  }, [events]);

  useEffect(() => {
    setUserEvents(events);
  }, [events]);

  const getStatusForCurrentUser = (event) => {
    const currentUserParticipant = event.participants.find(
      (participant) => participant.id === loggedInUser.id
    );

    return currentUserParticipant
      ? currentUserParticipant.status
      : "no status find";
  };

  const getRoleOfUser = (event) => {
    const currentUserParticipant = event.participants.find(
      (participant) => participant.id === loggedInUser.id
    );

    return currentUserParticipant
      ? currentUserParticipant.role
      : "no status find";
  };

  return (
    <>
      <div className="user-inner">
        <AppBar>
          <Toolbar>
            <h2>Hello, {loggedInUser.name}</h2>
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

        {userEvents.length === 0 ? (
          <Typography variant="h6" align="center" mt={6}>
            No events available.
          </Typography>
        ) : (
          <List>
            {userEvents.map((event) => {
              const status = getStatusForCurrentUser(event);
              const role = getRoleOfUser(event);
              const isOwner = role === "owner";
              return (
                <ListItem
                  key={event.id}
                  className={status}
                  secondaryAction={
                    <>
                      {isOwner && (
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleEditEvent(event.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      {status === "pending" ? (
                        <>
                          <IconButton
                            edge="end"
                            aria-label="accept"
                            onClick={() =>
                              handleStatusChange(event.id, "accepted")
                            }
                          >
                            <CheckIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="cancel"
                            onClick={() =>
                              handleStatusChange(event.id, "cancelled")
                            }
                          >
                            <CancelIcon />
                          </IconButton>
                        </>
                      ) : status === "cancelled" ? (
                        <>
                          <IconButton
                            edge="end"
                            aria-label="accept"
                            onClick={() =>
                              handleStatusChange(event.id, "accepted")
                            }
                          >
                            <CheckIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleEventDelete(event.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            edge="end"
                            aria-label="cancel"
                            onClick={() =>
                              handleStatusChange(event.id, "cancelled")
                            }
                          >
                            <CancelIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleEventDelete(event.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </>
                  }
                >
                  <ListItemText
                    primary={event.eventName}
                    secondary={
                      <>
                        <span>Description: {event.description}</span>
                        <br />
                        <span>Date: {event.dateTime}</span>
                        <span className="users">
                          Users:{" "}
                          {event.participants.map((participant) => (
                            <span
                              key={participant.id}
                              className={participant.status}
                            >
                              {participant.name}
                            </span>
                          ))}
                        </span>
                      </>
                    }
                  />
                </ListItem>
              );
            })}
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
