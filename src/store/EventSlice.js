import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrlEvents = "https://655b4c17ab37729791a8de3b.mockapi.io/events";

export const fetchEvents = createAsyncThunk("events/fetchEvents", (userId) => {
  return axios.get(apiUrlEvents).then((response) => {
    const filteredEvents = response.data.filter((event) =>
      event.participants.some((participant) => participant.id === userId)
    );
    return filteredEvents;
  });
});

export const addNewEvent = createAsyncThunk("events/addEvent", (newEvent) =>
  axios.post(apiUrlEvents, newEvent).then((response) => response.data)
);

export const removeUserFromEvent = createAsyncThunk(
  "events/removeUserFromEvent",
  ({ eventId, userId }) => {
    return axios.get(`${apiUrlEvents}/${eventId}`).then((response) => {
      const updatedEvent = {
        ...response.data,
        participants: response.data.participants.filter(
          (participant) => participant.id !== userId
        ),
      };
      return axios
        .put(`${apiUrlEvents}/${eventId}`, updatedEvent)
        .then(() => ({ eventId, userId }));
    });
  }
);

export const changeEventStatus = createAsyncThunk(
  "events/changeEventStatus",
  ({ eventId, userId, status }) => {
    return axios.get(`${apiUrlEvents}/${eventId}`).then((response) => {
      const updatedEvent = {
        ...response.data,
        participants: response.data.participants.map((participant) => {
          if (participant.id === userId) {
            return {
              ...participant,
              status: status,
            };
          }
          return participant;
        }),
      };
      return axios
        .put(`${apiUrlEvents}/${eventId}`, updatedEvent)
        .then(() => ({ eventId, userId, status }));
    });
  }
);

export const initialState = {
  events: [],
};

const EventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvent: (state, action) => {
      state.events = [action.payload, ...state.events];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload;
      })
      .addCase(addNewEvent.fulfilled, (state, action) => {
        state.events = [action.payload, ...state.events];
      })
      .addCase(changeEventStatus.fulfilled, (state, action) => {
        const { eventId, userId, status } = action.payload;
        const updatedEvents = state.events.map((event) =>
          event.id === eventId
            ? {
                ...event,
                participants: event.participants.map((participant) =>
                  participant.id === userId
                    ? { ...participant, status: status }
                    : participant
                ),
              }
            : event
        );
        state.events = updatedEvents;
      })
      .addCase(removeUserFromEvent.fulfilled, (state, action) => {
        const eventInfo = action.payload;
        state.events = state.events.filter(
          (event) => event.id !== eventInfo.eventId
        );
      });
  },
});

export const EventActions = EventSlice.actions;
export default EventSlice.reducer;
