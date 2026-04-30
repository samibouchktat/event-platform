import axiosClient from "./axiosClient";

export const getProviderBookingDocuments = async (bookingId) => {
  const response = await axiosClient.get(
    `/provider/bookings/${bookingId}/documents`
  );

  return response.data;
};

export const createProviderBookingDocument = async (bookingId, payload) => {
  const response = await axiosClient.post(
    `/provider/bookings/${bookingId}/documents`,
    payload
  );

  return response.data;
};

export const uploadProviderBookingDocument = async (bookingId, formData) => {
  const response = await axiosClient.post(
    `/provider/bookings/${bookingId}/documents/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteProviderBookingDocument = async (bookingId, documentId) => {
  await axiosClient.delete(
    `/provider/bookings/${bookingId}/documents/${documentId}`
  );
};

export const getClientBookingDocuments = async (bookingId) => {
  const response = await axiosClient.get(
    `/client/bookings/${bookingId}/documents`
  );

  return response.data;
};