import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  events: [],
}

const EventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state, action) => {
      state.events = [action.payload, ...state.events]
    },
    deleteEvent: (state, action) => {
      console.log(action.payload);
      const updatedEvents = state.events.filter(
        event => JSON.stringify(event) !== JSON.stringify(action.payload)
      );
      console.log(updatedEvents);
      state.events = updatedEvents;
    }    
    
  }
});

export const EventActions = EventSlice.actions;
export default EventSlice.reducer;