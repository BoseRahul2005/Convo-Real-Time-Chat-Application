const ChatRequest = require("../models/chatRequestModel.js");
const Message = require("../models/messageModel.js");
const { getSocketIdByUserId, getIO } = require("../config/socket.js")

exports.sendRequest = async (req, res) => {
    const sender = req.userId;
    const { receiver } = req.body;

    try {
        if (!receiver) {
            return res.json({ success: false, message: "Receiver ID is required" });
        }

        if (sender === receiver) {
            return res.json({ success: false, message: "Cannot send a request to yourself" });
        }

        //checking if request already exists or is accepted
        const existing = await ChatRequest.findOne({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender },
            ],
            status: { $in: ["pending", "accepted"] } //if the status of the document is pending or accepted
        });

        if (existing) {
            return res.json({ success: false, message: "Request already exists" });
        }

        const chatRequest = new ChatRequest({ sender, receiver });
        await chatRequest.save();

        const receiverSocketId = getSocketIdByUserId(chatRequest.receiver);
        if (receiverSocketId) {
            getIO().to(receiverSocketId).emit("chat_request_sent");
        }
        res.json({ success: true, message: "Chat request sent successfully", chatRequest });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}

exports.pendingRequest = async (req, res) => {
    const sender = req.userId;
    try {
        //This reads as: "find every pending request where either I'm the sender or I'm the receiver."
        const pendingRequests = await ChatRequest.find({
            status: "pending", //filter out by pending status
            $or: [
                { sender: sender }, //filters if the logged in user is sender or,
                { receiver: sender } //filters if the logged in user is receiver
            ]
        })
            .populate("sender receiver", "username name _id email");
        res.json({ success: true, pendingRequests });

    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}
exports.sentRequestsCancel = async (req, res) => {
    const { requestId } = req.params;
    try {
        const chatRequest = await ChatRequest.findByIdAndDelete(requestId);
        if (!chatRequest) {
            return res.json({ success: false, message: "Chat request not found" });
        }

        const receiverSocketId = getSocketIdByUserId(chatRequest.receiver._id);
        if (receiverSocketId) {
            getIO().to(receiverSocketId).emit("chat_request_deleted");
        }
        res.json({ success: true, message: "Request cancelled successfully" });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}

exports.requestReject = async (req, res) => {
    const loggedInUser = req.userId;
    const { requestId } = req.params;
    try {
        //firstly check if the request is sent to the logged in user
        const chatRequest = await ChatRequest.findOne({ _id: requestId, receiver: loggedInUser });
        if (!chatRequest) {
            return res.json({ success: false, message: "Chat request not found" });
        }

        await chatRequest.deleteOne();

        // stores the socket id of the sender
        const senderSocketId = getSocketIdByUserId(chatRequest.sender);
        if (senderSocketId) {
            getIO().to(senderSocketId).emit("chat_request_rejected");
        }
        res.json({ success: true, message: "Request rejected successfully" });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}

exports.acceptRequest = async (req, res) => {
    const loggedInUser = req.userId;
    const { requestId } = req.params;
    try {
        const chatRequest = await ChatRequest.findOneAndUpdate({ _id: requestId, receiver: loggedInUser },
            { $set: { status: "accepted" } },
            { new: true } //returns the updated document
        )

        if (!chatRequest) {
            return res.json({ success: false, message: "Chat request not found" });
        }

        const senderSocketId = getSocketIdByUserId(chatRequest.sender._id);
        if (senderSocketId) {
            getIO().to(senderSocketId).emit("chat_request_accepted");
        }
        res.json({ success: true, message: "Request accepted" });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}

exports.getContacts = async (req, res) => {
    const loggedInUser = req.userId;
    try {
        const acceptedRequest = await ChatRequest.find({
            status: "accepted",
            $or: [
                { sender: loggedInUser },
                { receiver: loggedInUser }
            ]
        }).populate("sender receiver", "username name _id email");

        const contacts = await Promise.all(
        acceptedRequest.map(async (request) => {
            const isSender = request.sender._id.toString() === loggedInUser;
            const otherUser = isSender ? request.receiver : request.sender;

            const lastMessage = await Message.findOne({
                $or:[{sender:loggedInUser, receiver:otherUser._id},{sender:otherUser._id, receiver:loggedInUser}]
            }).sort({createdAt: -1});

            const unreadCount = await Message.countDocuments({
                sender:otherUser._id,
                receiver:loggedInUser,
                seen:false
            });
            
            return {
                _id: request._id,
                contactId: otherUser._id,
                name: otherUser.name,
                username: otherUser.username,
                email: otherUser.email,
                lastMessage: lastMessage? lastMessage.text: null,
                lastMessageTime: lastMessage? lastMessage.createdAt : null,
                unreadCount
            };
        }))

        res.json({ success: true, contacts });
    }
    catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
} 
