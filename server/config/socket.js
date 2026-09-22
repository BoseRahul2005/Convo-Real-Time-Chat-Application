const { Server } = require("socket.io");

let io;
const userSocketMap = {}; // gives every user a socketId to identify a particular user

const initSocket = (server) => {
    io = new Server(server, { //the webSocket server attaches to the old http server
        cors: {
            origin: e3f9e7e12a0e942405c67a90a620de097b5ddc08ec94ea019e0d8d5be29e98a7,
        }
    });

    // This one's on io (the whole server), not an individual socket. It listens for a special built-in event called "connection" — which fires every time any new client connects. Each time it fires, it hands you a fresh socket object representing that specific new connection.
    io.on("connection", (socket) => {

        //reading a piece of data from a particular user that the frontend attached when it made the connection
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap[userId] = socket.id; //storing the user id and the socket id
            console.log(`User ${userId} connected with socket ${socket.id}`);
        }

        // This one is scoped to one specific connection (the socket you got from the connection event above). "disconnect" is another built-in event name — it automatically fires when that particular client closes their tab, loses internet, or otherwise stops being connected. You're saying: "for this one connection, when it disconnects, run this cleanup code."
        socket.on("disconnect", () => {
            console.log(`Socket ${socket.id} disconnected`);

            // it loops through the userSocketMap and checks if the socket id matches the one that disconnected
            //since, userSocketMap is an object and for..of cannot iterate through an object directly, we use Object.entries() to convert it into an array of [key, value] pairs
            for (const [uid, sid] of Object.entries(userSocketMap)) {
                if (sid === socket.id) {
                    delete userSocketMap[uid];
                    break;
                }
            }
        });
    });

    return io;
};

const getSocketIdByUserId = (userId) => userSocketMap[userId]; //gives you the socket id value of the logged in user using their user id as a key

const getIO = () => io;

module.exports = { initSocket, getSocketIdByUserId, getIO };
