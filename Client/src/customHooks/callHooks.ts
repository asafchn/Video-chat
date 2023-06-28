import { useContext } from "react";
import { SocketContext } from "../socket/SocketContext";
import Peer from "simple-peer";
import { useCallerHooks } from "./callerHooks";
import { useCalleeHooks } from "./calleeHooks";
import SimplePeer from "simple-peer";

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

  function callUser(id: string, stream: MediaStream) {
    if (socket.webSocket) {
      const peer = createPeer({ initiator: true, stream: stream });
      callerHooks.onCallerSignal(peer, id);
      callerHooks.onCallerStream(peer);
      callerHooks.callAcceptedListener(socket.webSocket, peer);
      socket.setMyPeer(peer);
    }
  }

  function getPeerVideoTracks(peer: SimplePeer.Instance) {
    return peer.streams[0].getVideoTracks();
  }

  function getMediaStreamVideoTracks(mediaStream: MediaStream) {
    return mediaStream.getVideoTracks();
  }

  function replaceStreamForPeer(mediaStream: MediaStream) {
    if (peer?.streams.length) {
      const peerVideoTracks = getPeerVideoTracks(peer);
      const mediaStreamTracks = getMediaStreamVideoTracks(mediaStream);

      if (peerVideoTracks.length && mediaStreamTracks.length) {
        peer.replaceTrack(
          peerVideoTracks[0],
          mediaStreamTracks[0],
          peer.streams[0]
        );
      }
    }
  }

  function createEmptyStream(width = 3840, height = 2160) {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d")!.fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], {
      enabled: false,
    });
  }

  function acceptCall(stream: MediaStream) {
    calleeHooks.onCallAccepted();
    const peer = createPeer({ initiator: false, stream: stream });
    calleeHooks.onCalleeSignal(peer);
    calleeHooks.onCalleeStream(peer);
    calleeHooks.updateCalleeStates(peer);
  }

  async function getMediaOnInitialConnection() {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
    mediaStream.addTrack(createEmptyStream());
    return mediaStream;
  }

  return {
    acceptCall,
    userIsCallingListener: calleeHooks.userIsCallingListener,
    replaceStreamForPeer,
    getMediaOnInitialConnection,
    callUser,
    createEmptyStream,
  };
}
