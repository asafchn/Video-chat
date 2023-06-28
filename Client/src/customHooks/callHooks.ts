import { useContext } from "react";
import { SocketContext } from "../socket/SocketContext";
import Peer from "simple-peer";
import { useCallerHooks } from "./callerHooks";
import { useCalleeHooks } from "./calleeHooks";

export function useCallHooks() {
  const callerHooks = useCallerHooks();
  const calleeHooks = useCalleeHooks();
  const socket = useContext(SocketContext);
  const peer = socket.connection;

  function createPeer({
    initiator,
    stream,
  }: {
    initiator: boolean;
    stream: MediaStream | null;
  }) {
    return new Peer({
      initiator,
      trickle: false,
      stream: stream ?? undefined,
    });
  }

  function callUser(id: string) {
    if (socket.webSocket) {
      const peer = createPeer({ initiator: true, stream: socket.myStream });
      callerHooks.onCallerSignal(peer, id);
      callerHooks.onCallerStream(peer);
      callerHooks.callAcceptedListener(socket.webSocket, peer);
      socket.setMyPeer(peer);
    }
  }

  function replaceStreamForPeer(mediaStream: MediaStream) {
    if (peer) {
      if (peer.streams.length) {
        peer.replaceTrack(
          peer.streams[0].getVideoTracks()[0],
          mediaStream.getVideoTracks()[0],
          peer.streams[0]
        );
      } else {
        peer.addTrack(mediaStream.getVideoTracks()[0], mediaStream);
      }
    }
  }

  function acceptCall() {
    calleeHooks.onCallAccepted();
    const peer = createPeer({ initiator: false, stream: socket.myStream });
    calleeHooks.onCalleeSignal(peer);
    calleeHooks.onCalleeStream(peer);
    calleeHooks.updateCalleeStates(peer);
  }

  return {
    acceptCall,
    userIsCallingListener: calleeHooks.userIsCallingListener,
    replaceStreamForPeer,
    callUser,
  };
}
