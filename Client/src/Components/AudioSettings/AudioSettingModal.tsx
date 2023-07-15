import { useContext, useEffect, useRef } from "react";
import Modal from "../atoms/modal/Modal";
import { SocketContext } from "../../socket/SocketContext";
import Button from "../atoms/button/Button";

export default function AudioSettingsModal({ close }: { close: () => void }) {
  const context = useContext(SocketContext);
  const gainRef = useRef<GainNode | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  function generateAudioContext() {
    audioContext.current = new AudioContext();
  }
  function createGain(context: AudioContext) {
    return context.createGain();
  }
  function createMediaSource() {
    if (context.myStream && audioContext.current) {
      const gain = createGain(audioContext.current);
      const source = audioContext.current.createMediaStreamSource(
        context.myStream
      );
      source.connect(gain);
      gain.connect(audioContext.current.destination);
      gainRef.current = gain;
    }
  }
  function interactWithGainNode(increase: boolean) {
    console.log(gainRef.current);
    gainRef.current?.gain.setValueAtTime(increase ? 2 : 1, 0);
  }
  useEffect(() => {
    generateAudioContext();
    createMediaSource();
  }, []);

  return (
    <Modal>
      <div>hello</div>
      <Button onClick={() => interactWithGainNode(true)} disabled={false}>
        increase
      </Button>
      <Button onClick={() => interactWithGainNode(false)} disabled={false}>
        decrease
      </Button>{" "}
      <Button onClick={close} disabled={false}>
        CLOSE
      </Button>
    </Modal>
  );
}
