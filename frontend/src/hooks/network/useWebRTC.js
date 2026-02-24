import { useState, useEffect, useRef, useCallback } from "react";
import Peer from "peerjs";

export const useWebRTC = (userName) => {
  const [localStream, setLocalStream] = useState(null);
  const [peers, setPeers] = useState({});
  const [myPeerId, setMyPeerId] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false); // Track screen state

  const peerInstance = useRef(null);
  const localStreamRef = useRef(null);
  const originalVideoTrackRef = useRef(null); // Save camera track when screen sharing
  const callsRef = useRef({});

  const cursorColors = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#22c55e",
    "#3b82f6",
    "#a855f7",
    "#ec4899",
  ];

  // 1. Initialize Camera & Mic
  const initStream = useCallback(async (video = true, audio = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video,
        audio,
      });
      setLocalStream(stream);
      localStreamRef.current = stream;
      return stream;
    } catch (err) {
      console.error("Failed to get local stream", err);
      return null;
    }
  }, []);

  // 2. Setup Peer connection ONCE
  useEffect(() => {
    const peer = new Peer();
    peerInstance.current = peer;

    peer.on("open", (id) => setMyPeerId(id));

    peer.on("call", (call) => {
      if (localStreamRef.current) call.answer(localStreamRef.current);

      call.on("stream", (remoteStream) => {
        const callerName = call.metadata?.name || "Anonymous";
        const color =
          cursorColors[Math.floor(Math.random() * cursorColors.length)];
        setPeers((prev) => ({
          ...prev,
          [call.peer]: { stream: remoteStream, name: callerName, color },
        }));
      });

      call.on("close", () => {
        setPeers((prev) => {
          const next = { ...prev };
          delete next[call.peer];
          return next;
        });
      });

      callsRef.current[call.peer] = call;
    });

    return () => peer.destroy();
  }, []);

  // 3. Call another user
  const callPeer = useCallback(
    (targetPeerId) => {
      if (!peerInstance.current || !localStreamRef.current) return;

      const call = peerInstance.current.call(
        targetPeerId,
        localStreamRef.current,
        {
          metadata: { name: userName },
        },
      );

      call.on("stream", (remoteStream) => {
        const color =
          cursorColors[Math.floor(Math.random() * cursorColors.length)];
        setPeers((prev) => ({
          ...prev,
          [targetPeerId]: { stream: remoteStream, name: "Remote User", color },
        }));
      });

      call.on("close", () => {
        setPeers((prev) => {
          const next = { ...prev };
          delete next[targetPeerId];
          return next;
        });
      });

      callsRef.current[targetPeerId] = call;
    },
    [userName],
  );

  // 4. End Call (Kill Hardware)
  const stopStream = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    }
    // Hang up on all peers
    Object.values(callsRef.current).forEach((call) => call.close());
    callsRef.current = {};
    setPeers({});
    setIsScreenSharing(false);
  }, []);

  // 5. Screen Share Swapper
  const toggleScreenShare = useCallback(async () => {
    if (!localStreamRef.current) return;

    if (isScreenSharing) {
      // Revert to camera
      const screenTrack = localStreamRef.current.getVideoTracks()[0];
      screenTrack.stop(); // Kill screen share feed

      if (originalVideoTrackRef.current) {
        localStreamRef.current.removeTrack(screenTrack);
        localStreamRef.current.addTrack(originalVideoTrackRef.current);

        // Tell all active peer connections to swap back to the camera track
        Object.values(callsRef.current).forEach((call) => {
          const sender = call.peerConnection
            .getSenders()
            .find((s) => s.track.kind === "video");
          if (sender) sender.replaceTrack(originalVideoTrackRef.current);
        });
      }
      setIsScreenSharing(false);
    } else {
      // Start screen share
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = screenStream.getVideoTracks()[0];

        // Backup the camera track
        originalVideoTrackRef.current =
          localStreamRef.current.getVideoTracks()[0];

        // Swap the local track
        localStreamRef.current.removeTrack(originalVideoTrackRef.current);
        localStreamRef.current.addTrack(screenTrack);

        // Tell all active peer connections to swap to the screen track
        Object.values(callsRef.current).forEach((call) => {
          const sender = call.peerConnection
            .getSenders()
            .find((s) => s.track.kind === "video");
          if (sender) sender.replaceTrack(screenTrack);
        });

        setIsScreenSharing(true);

        // If the user clicks "Stop Sharing" on the browser's native banner
        screenTrack.onended = () => {
          toggleScreenShare(); // Fire the revert logic
        };
      } catch (err) {
        console.error("Screen sharing cancelled or failed", err);
      }
    }
  }, [isScreenSharing]);

  // 6. Media Toggles
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return !audioTrack.enabled;
      }
    }
    return false;
  }, []);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return !videoTrack.enabled;
      }
    }
    return false;
  }, []);

  return {
    localStream,
    peers,
    myPeerId,
    initStream,
    stopStream,
    callPeer,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    isScreenSharing,
  };
};
