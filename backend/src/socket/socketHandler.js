const Specialist = require("../models/Specialist");

/**
 * Socket.IO handler for:
 *  - Real-time chat (per booking rooms)
 *  - Live GPS tracking (specialist → customer)
 *  - Booking status updates (server → all room members)
 */
module.exports = function (io, app) {
  // Attach io to express app for use in controllers
  if (app && typeof app.set === "function") {
    app.set("io", io);
  }

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // ─── Join a booking room ────────────────────────────────────────────────
    socket.on("join_booking", ({ bookingId }) => {
      if (!bookingId) return;
      socket.join(`booking:${bookingId}`);
      console.log(`Socket ${socket.id} joined booking:${bookingId}`);
    });

    // ─── Chat: client sends message ─────────────────────────────────────────
    // Messages are persisted via REST POST /api/messages/:bookingId
    // Here we just handle the real-time broadcast if client uses socket directly
    socket.on("send_message", ({ bookingId, text, senderName, senderRole }) => {
      if (!bookingId || !text) return;
      io.to(`booking:${bookingId}`).emit("new_message", {
        bookingId,
        text,
        senderName,
        senderRole,
        timestamp: new Date().toISOString(),
      });
    });

    // ─── Mark messages read ─────────────────────────────────────────────────
    socket.on("message_read", ({ bookingId }) => {
      if (!bookingId) return;
      socket.to(`booking:${bookingId}`).emit("message_read", { bookingId });
    });

    // ─── Specialist GPS location update ─────────────────────────────────────
    socket.on("specialist_location", async ({ bookingId, specialistId, lat, lng }) => {
      if (!bookingId || lat == null || lng == null) return;

      // Broadcast to everyone in the booking room (customer sees live position)
      io.to(`booking:${bookingId}`).emit("location_update", {
        bookingId,
        specialistId,
        lat,
        lng,
        timestamp: new Date().toISOString(),
      });

      // Persist last known location on specialist document
      if (specialistId) {
        try {
          await Specialist.findOneAndUpdate(
            { id: specialistId },
            { currentLat: lat, currentLng: lng, lastLocationAt: new Date() }
          );
        } catch (_) {}
      }
    });

    // ─── Booking status broadcast ────────────────────────────────────────────
    socket.on("booking_status_update", ({ bookingId, status }) => {
      if (!bookingId || !status) return;
      io.to(`booking:${bookingId}`).emit("booking_status_update", { bookingId, status });
    });

    // ─── Disconnect ──────────────────────────────────────────────────────────
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
