import { useCallback, useReducer, useState } from 'react';
import { bookSeats, bookTickets, fetchEventShows, fetchTicketTypes } from '../api/booking.api';
import type {
  BookingEventData,
  BookingState,
  BookingStep,
  SelectedSeat,
  Show,
  TicketType,
} from '../types/booking.types';

// ─────────────────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_SHOWS'; shows: Show[]; ticketTypes: TicketType[] }
  | { type: 'SET_LOADING_SHOWS' }
  | { type: 'SET_STEP'; step: BookingStep }
  | { type: 'SELECT_DATE'; date: string }
  | { type: 'SELECT_SHOW'; show: Show; isSeated: boolean }
  | { type: 'CLEAR_DATE_SELECTION'; date: string }
  | { type: 'CLEAR_ALL_SELECTIONS' }
  | { type: 'RESTORE_SELECTION'; show: Show; date: string }
  | { type: 'ADD_SEAT'; seat: SelectedSeat; showId?: string }
  | { type: 'REMOVE_SEAT'; seatId: string }
  | { type: 'SET_TICKET_QTY'; ticketType: TicketType; quantity: number }
  | { type: 'SET_BOOKING' }
  | { type: 'SET_SUCCESS'; bookingId: string }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'RESET' };

const initialState: BookingState = {
  step: 'date',
  shows: [],
  availableDates: [],
  ticketTypes: [],
  selectedDate: null,
  selectedShow: null,
  selectedShows: {},
  selectedSeats: [],
  selectedTickets: [],
  isLoadingShows: false,
  isBooking: false,
  isSuccess: false,
  error: null,
  bookingId: null,
};

function reducer(state: BookingState, action: Action): BookingState {
  switch (action.type) {
    case 'SET_LOADING_SHOWS':
      return { ...state, isLoadingShows: true, error: null };

    case 'SET_SHOWS': {
      const dates = [...new Set(action.shows.map((s) => s.date))].sort();
      return {
        ...state,
        shows: action.shows,
        availableDates: dates,
        ticketTypes: action.ticketTypes,
        isLoadingShows: false,
      };
    }

    case 'SET_STEP':
      return { ...state, step: action.step };

    case 'SELECT_DATE':
      return { ...state, selectedDate: action.date, selectedShow: null };

    case 'SELECT_SHOW': {
      const newSelectedShows = { ...state.selectedShows, [action.show.date]: action.show };
      return {
        ...state,
        selectedShow: action.show,
        selectedShows: newSelectedShows,
        // For seated: keep existing seats across multi-day selection (cleared via CLEAR_ALL_SELECTIONS).
        // For non-seated: keep tickets across multi-day.
        selectedSeats: state.selectedSeats,
        selectedTickets: action.isSeated ? [] : state.selectedTickets,
      };
    }

    case 'CLEAR_DATE_SELECTION': {
      const { [action.date]: _removed, ...rest } = state.selectedShows;
      const remaining = Object.values(rest);
      return {
        ...state,
        selectedShows: rest,
        selectedShow: remaining.length > 0 ? remaining[remaining.length - 1] ?? null : null,
      };
    }

    case 'CLEAR_ALL_SELECTIONS': {
      return {
        ...state,
        selectedShows: state.selectedShow ? { [state.selectedDate ?? '']: state.selectedShow } : {},
        selectedSeats: [],
        selectedSeatsShowId: undefined,
        selectedTickets: [],
      };
    }

    // Restores a previously saved show+date without clearing tickets/seats
    case 'RESTORE_SELECTION':
      return {
        ...state,
        selectedShow: action.show,
        selectedDate: action.date,
        selectedShows: { [action.show.date]: action.show },
      };

    case 'ADD_SEAT':
      return {
        ...state,
        selectedSeats: [...state.selectedSeats, action.seat],
        selectedSeatsShowId: action.showId ?? state.selectedSeatsShowId,
      };

    case 'REMOVE_SEAT': {
      const remaining = state.selectedSeats.filter((s) => s.id !== action.seatId);
      return {
        ...state,
        selectedSeats: remaining,
        selectedSeatsShowId: remaining.length === 0 ? undefined : state.selectedSeatsShowId,
      };
    }

    case 'SET_TICKET_QTY': {
      const idx = state.selectedTickets.findIndex((t) => t.type.id === action.ticketType.id);
      if (action.quantity === 0) {
        return { ...state, selectedTickets: state.selectedTickets.filter((t) => t.type.id !== action.ticketType.id) };
      }
      if (idx >= 0) {
        const updated = [...state.selectedTickets];
        updated[idx] = { type: action.ticketType, quantity: action.quantity };
        return { ...state, selectedTickets: updated };
      }
      return { ...state, selectedTickets: [...state.selectedTickets, { type: action.ticketType, quantity: action.quantity }] };
    }

    case 'SET_BOOKING':
      return { ...state, isBooking: true, error: null };

    case 'SET_SUCCESS':
      return { ...state, isBooking: false, isSuccess: true, bookingId: action.bookingId };

    case 'SET_ERROR':
      return { ...state, isBooking: false, isLoadingShows: false, error: action.error };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────

export function useBooking(event: BookingEventData) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [stepStack, setStepStack] = useState<BookingStep[]>([]);

  const navigateTo = useCallback((step: BookingStep, currentStep: BookingStep) => {
    setStepStack((prev) => [...prev, currentStep]);
    dispatch({ type: 'SET_STEP', step });
  }, []);

  const goBack = useCallback(() => {
    setStepStack((prev) => {
      const next = prev.slice(0, -1);
      const prevStep = prev[prev.length - 1];
      if (prevStep) dispatch({ type: 'SET_STEP', step: prevStep });
      return next;
    });
  }, []);

  const canGoBack = stepStack.length > 0;

  const loadShows = useCallback(async () => {
    dispatch({ type: 'SET_LOADING_SHOWS' });
    setStepStack([]);
    try {
      const [shows, ticketTypes] = await Promise.all([
        fetchEventShows(event.id),
        event.seating_type !== 'seated' ? fetchTicketTypes(event.id) : Promise.resolve([]),
      ]);

      dispatch({ type: 'SET_SHOWS', shows, ticketTypes });

      const dates = [...new Set(shows.map((s) => s.date))].sort();
      const firstDate = dates[0] ?? '';
      const showsOnFirstDate = shows.filter((s) => s.date === firstDate);
      const firstShow = showsOnFirstDate[0];

      // Pre-select first date; only pre-select first show for non-seated events
      dispatch({ type: 'SELECT_DATE', date: firstDate });
      if (firstShow && event.seating_type !== 'seated') dispatch({ type: 'SELECT_SHOW', show: firstShow, isSeated: false });

      if (dates.length > 1 || showsOnFirstDate.length > 1) {
        dispatch({ type: 'SET_STEP', step: dates.length > 1 ? 'date' : 'time' });
        return;
      }

      if (!firstShow) return;
      dispatch({ type: 'SET_STEP', step: event.seating_type === 'seated' ? 'seats' : 'tickets' });
    } catch {
      dispatch({ type: 'SET_ERROR', error: 'Failed to load shows. Please try again.' });
    }
  }, [event.id, event.seating_type]);

  const selectDate = useCallback(
    (date: string, currentStep: BookingStep) => {
      dispatch({ type: 'SELECT_DATE', date });
      const showsOnDate = state.shows.filter((s) => s.date === date);
      const firstShow = showsOnDate[0];

      // Pre-select first show only for non-seated events
      if (firstShow && event.seating_type !== 'seated') dispatch({ type: 'SELECT_SHOW', show: firstShow, isSeated: false });

      if (showsOnDate.length === 1 && firstShow) {
        navigateTo(event.seating_type === 'seated' ? 'seats' : 'tickets', currentStep);
      } else {
        navigateTo('time', currentStep);
      }
    },
    [state.shows, event.seating_type, navigateTo],
  );

  const selectShow = useCallback(
    (show: Show, currentStep: BookingStep) => {
      dispatch({ type: 'SELECT_SHOW', show, isSeated: event.seating_type === 'seated' });
      navigateTo(event.seating_type === 'seated' ? 'seats' : 'tickets', currentStep);
    },
    [event.seating_type, navigateTo],
  );

  const clearDateSelection = useCallback((date: string) => {
    dispatch({ type: 'CLEAR_DATE_SELECTION', date });
  }, []);

  const clearAllSelections = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_SELECTIONS' });
  }, []);

  const addSeat = useCallback((seat: SelectedSeat, showId?: string) => {
    dispatch({ type: 'ADD_SEAT', seat, showId: showId ?? state.selectedShow?.id });
  }, [state.selectedShow?.id]);

  const removeSeat = useCallback((seatId: string) => {
    dispatch({ type: 'REMOVE_SEAT', seatId });
  }, []);

  const setTicketQty = useCallback((ticketType: TicketType, quantity: number) => {
    dispatch({ type: 'SET_TICKET_QTY', ticketType, quantity });
  }, []);

  const proceedToSummary = useCallback(
    (currentStep: BookingStep) => {
      navigateTo('summary', currentStep);
    },
    [navigateTo],
  );

  const confirmBooking = useCallback(async () => {
    if (!state.selectedShow) return;
    dispatch({ type: 'SET_BOOKING' });
    try {
      if (event.seating_type === 'seated') {
        const result = await bookSeats({
          eventKey: state.selectedShow.seatsio_event_key ?? '',
          seatIds: state.selectedSeats.map((s) => s.id),
        });
        if (result.success) dispatch({ type: 'SET_SUCCESS', bookingId: result.bookingId });
        else throw new Error('Booking failed');
      } else {
        const result = await bookTickets({
          eventId: event.id,
          showId: state.selectedShow.id,
          tickets: state.selectedTickets.map((t) => ({ ticketTypeId: t.type.id, quantity: t.quantity })),
        });
        if (result.success) dispatch({ type: 'SET_SUCCESS', bookingId: result.bookingId });
        else throw new Error('Booking failed');
      }
    } catch {
      dispatch({ type: 'SET_ERROR', error: 'Booking failed. Please try again.' });
    }
  }, [state, event]);

  const restoreSelection = useCallback((show: Show, date: string) => {
    dispatch({ type: 'RESTORE_SELECTION', show, date });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
    setStepStack([]);
  }, []);

  return {
    state,
    canGoBack,
    loadShows,
    selectDate,
    selectShow,
    clearDateSelection,
    clearAllSelections,
    restoreSelection,
    addSeat,
    removeSeat,
    setTicketQty,
    proceedToSummary,
    confirmBooking,
    goBack,
    reset,
  };
}
