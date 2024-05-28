
import { userSocketIds } from "../../index.js";

export const emitEvent = (req, event, users, data) => {
    const io = req.app.get("io");
    const usersSocket = getSockets(users);
    io.to(usersSocket).emit(event, data);
}

// export const getSockets = (users = []) => {
//     return users.map(user => {
//         const socketId = userSocketIds.get(user.toString());
//         if (!socketId) {
//             console.error(`No socket ID found for user: ${user}`); // Add this line to debug
//         }
//         return socketId;
//     }).filter(socketId => socketId); // Filter out any undefined socket IDs
// }

export const getSockets = (users = []) => {
    // Ensure users is an array
    if (!Array.isArray(users)) {
        console.error('Users is not an array');
        return [];
    }

    return users.map(user => {
        const socketId = userSocketIds.get(user.toString());
        if (!socketId) {
            console.error(`No socket ID found for user: ${user}`);
        }
        return socketId;
    }).filter(socketId => socketId);
}
