import baseApi from "@/redux/api/baseApi";
import {
  TResponse,
  TRoom,
  TCreateRoomPayload,
  TUpdateRoomPayload,
} from "@/types";

const roomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new room
    createRoom: builder.mutation<TResponse<TRoom>, TCreateRoomPayload>({
      query: (payload) => ({
        url: "/rooms",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Rooms"],
    }),

    // Get all rooms
    getAllRooms: builder.query<TResponse<TRoom[]>, void>({
      query: () => "/rooms",
      providesTags: ["Rooms"],
    }),

    // Get single room by ID
    getRoomById: builder.query<TResponse<TRoom>, string>({
      query: (id) => `/rooms/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Rooms", id }],
    }),

    // Update room
    updateRoom: builder.mutation<
      TResponse<TRoom>,
      { id: string; payload: TUpdateRoomPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/rooms/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Rooms", id },
        "Rooms",
      ],
    }),

    // Delete room
    deleteRoom: builder.mutation<TResponse<TRoom>, string>({
      query: (id) => ({
        url: `/rooms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Rooms",],
    }),
  }),
});

export const {
  useCreateRoomMutation,
  useGetAllRoomsQuery,
  useGetRoomByIdQuery,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomApi;
