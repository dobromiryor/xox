import {
	type NavigationGuardReturn,
	type RouteLocationNormalizedGeneric,
} from "vue-router";
import { ErrorMessage } from "~/enums/error.enum";
import { useNameStore } from "~/stores/name.store";
import { findRoomByName } from "~/supabase/api/room.api";

/**
 * Navigation guard for room routes. Checks if the user has a name and if the room exists.
 * If the room is full or doesn't exist, redirects to the root page with an error message.
 *
 * @param {RouteLocationNormalizedGeneric} to - The target route object.
 * @return {Promise<NavigationGuardReturn>} The redirect object with error message and room name.
 */
export const roomGuard = async (
  to: RouteLocationNormalizedGeneric
): Promise<NavigationGuardReturn> => {
  const nameStore = useNameStore();

  nameStore.setPersistedName();

  if (!nameStore.name) {
    /* Name missing */
    return {
      path: "/",
      query: {
        error:
          Object.keys(ErrorMessage)[
            Object.values(ErrorMessage).indexOf(ErrorMessage.NAME)
          ],
        room: to.params.room_name as string,
      },
    };
  }

  const { data } = await findRoomByName(to.params.room_name as string);

  if (!data) {
    /* Room doesn't exist */
    return {
      path: "/",
      replace: true,
      query: {
        error:
          Object.keys(ErrorMessage)[
            Object.values(ErrorMessage).indexOf(
              ErrorMessage.ROOM_DOES_NOT_EXIST
            )
          ],
      },
    };
  }

  if (
    !!data.x &&
    !!data.o &&
    data.x !== nameStore.name &&
    data.o !== nameStore.name
  ) {
    /* Room is full */
    return {
      path: "/",
      replace: true,
      query: {
        error:
          Object.keys(ErrorMessage)[
            Object.values(ErrorMessage).indexOf(ErrorMessage.ROOM_FULL)
          ],
        room: to.params.room_name as string,
      },
    };
  }
};
