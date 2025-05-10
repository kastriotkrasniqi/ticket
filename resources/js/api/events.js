// events.js (API methods)
import axios from 'axios';

export const joinQueue = async (eventId) => {
    try {
        const response = await axios.post(`/api/events/${eventId}/join`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const releaseOffer = async (eventId) => {
    try {
        const response = await axios.post(`/events/${eventId}/release`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchEventDetails = async (eventId) => {
    try {
        const response = await axios.get(`events/${eventId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
