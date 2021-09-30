/** --------------------------------------- */
/** ----Please-Use-localhost-OR-HTTPS------ */
/** --------------------------------------- */
import { useState, useEffect } from "react";

export default function useMedia() {
    const [audioStatus, setAudioStatus] = useState(true);
    const [videoStatus, setVideoStatus] = useState(true);
    const [audio, setAudio] = useState(null);
    const [audioOptions, setAudioOptions] = useState([]);
    const [video, setVideo] = useState(null);
    const [videoOptions, setVideoOptions] = useState([]);
    const [videoStream, setVideoStream] = useState(null);

    // use this in your component to handle variable data states
    // useEffect(() => getStream().then(getDevices).then(gotDevices), []);
    useEffect(() => updateAudioVideo(audioStatus, "audio"), [audioStatus]);
    useEffect(() => updateAudioVideo(videoStatus, "video"), [videoStatus]);

    const getDevices = () => navigator.mediaDevices && navigator.mediaDevices.enumerateDevices();
    const gotDevices = deviceInformation => {
        if (deviceInformation) {
            window.deviceInformation = deviceInformation; // make available to console
            const ao = [], vo = [];
            for (const deviceInfo of deviceInformation) {
                if (deviceInfo.kind === 'audioinput') {
                    ao.push(deviceInfo);
                } else if (deviceInfo.kind === 'videoinput') {
                    vo.push(deviceInfo);
                }
            }
            setAudioOptions(ao);
            setVideoOptions(vo);
        }
    }
    const getStream = (targetValue = null, type = null, unMuted = true) => {
        if (window && window.stream) {
            window.stream.getTracks().map(track => track.stop());
        }
        console.log("targetValue:: ", targetValue)
        let audioValue = targetValue && type === "audio" ? targetValue : null;
        let videoValue = targetValue && type === "video" ? targetValue : null;
        audioValue = !unMuted && type === "audio" ? unMuted : (!audioStatus ? audioStatus : { deviceId: audioValue ? { exact: audioValue } : undefined });
        videoValue = !unMuted && type === "video" ? unMuted : (!videoStatus ? videoStatus : { deviceId: videoValue ? { exact: videoValue } : undefined });
        const constraints = {
            audio: audioValue,
            video: videoValue
        };
        return navigator.mediaDevices && navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);
    }
    const updateAudioVideo = (unMuted, type) => {
        getStream(null, type, unMuted)
    }
    const gotStream = stream => {
        window.stream = stream; // access global
        setAudio(stream.getAudioTracks()[0]);
        setVideo(stream.getVideoTracks()[0]);
        setVideoStream(stream);
    }
    const handleError = (error) => {
        console.log('Media: ', error);
    }
    return {
        audioOptions, videoOptions, audio, video, videoStream, audioStatus, videoStatus,
        setAudio, setVideo, getStream, gotStream, getDevices, gotDevices, setAudioStatus, setVideoStatus, updateAudioVideo
    }
}