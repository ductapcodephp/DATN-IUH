import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

/**
 * @param {Object} activeLesson - The currently active lesson.
 * @returns {Object} { videoRef, playerRef }
 */
export const useVideoPlayer = (activeLesson) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        if (activeLesson && activeLesson.type === 'video' && activeLesson.video) {
            if (playerRef.current) {
                const player = playerRef.current;
                player.src({
                    src: activeLesson.video.url || `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`,
                    type: activeLesson.video.url ? 'video/mp4' : 'application/x-mpegURL'
                });
            } else {
                const videoElement = document.createElement('video-js');
                videoElement.classList.add('vjs-default-skin', 'vjs-big-play-centered', 'w-100', 'h-100');
                if (videoRef.current) {
                    videoRef.current.appendChild(videoElement);
                    playerRef.current = videojs(videoElement, {
                        controls: true,
                        preload: 'auto',
                        playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
                        sources: [{
                            src: activeLesson.video.url || `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`,
                            type: activeLesson.video.url ? 'video/mp4' : 'application/x-mpegURL'
                        }]
                    });
                }
            }
        }

        return () => {
            if (playerRef.current) {
                console.log("=== [Cleanup] Tiến hành hủy trình phát video cũ ===");
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, [activeLesson]);

    return { videoRef, playerRef };
};
