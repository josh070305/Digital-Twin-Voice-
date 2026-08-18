import {
  Room,
  RoomEvent,
  RemoteTrackPublication,
  RemoteParticipant,
  Track,
} from 'livekit-client';

export async function connectToRoom(
  token: string,
  onTranscript: (text: string, isFinal: boolean) => void,
  onAgentSpeaking: (speaking: boolean) => void
) {
  const room = new Room({
    adaptiveStream: true,
    dynacast: true,
  });

  room.on(
    RoomEvent.TrackSubscribed,
    (
      track,
      _publication: RemoteTrackPublication,
      _participant: RemoteParticipant
    ) => {
      if (track.kind === Track.Kind.Audio) {
        const audioElement = track.attach();
        document.body.appendChild(audioElement);
        onAgentSpeaking(true);
      }
    }
  );

  room.on(RoomEvent.TrackUnsubscribed, () => {
    onAgentSpeaking(false);
  });

  room.on(RoomEvent.DataReceived, (data) => {
    try {
      const message = JSON.parse(
        new TextDecoder().decode(data)
      );
      if (message.type === 'transcript') {
        onTranscript(message.text, message.isFinal);
      }
    } catch {}
  });

  await room.connect(
    import.meta.env.VITE_LIVEKIT_URL,
    token
  );

  await room.localParticipant.setMicrophoneEnabled(true);

  return room;
}
